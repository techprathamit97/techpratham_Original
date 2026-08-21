import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Autosaves a react-hook-form's values to localStorage so a refresh, crash,
 * closed tab, or dropped connection does not discard in-progress work.
 *
 * Design rules, because this runs on admin forms backed by a live database:
 *  - Purely client side. No API calls, no schema changes, no effect on the
 *    payload that gets submitted.
 *  - Every storage operation is individually guarded. Private browsing, a full
 *    quota, or disabled storage degrades to "no draft" and must never throw
 *    into the form render or block a submit.
 *  - Restoring is always an explicit user action, never automatic, so a stale
 *    draft cannot silently overwrite newer server data.
 */

/** Bumped if the persisted shape ever changes, so old drafts are ignored. */
const DRAFT_VERSION = 1;

/** Drafts older than this are treated as absent. */
const MAX_DRAFT_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const KEY_PREFIX = "course-draft:";

interface StoredDraft {
  version: number;
  savedAt: number;
  values: unknown;
}

export interface FormDraftState {
  /** True when a usable draft was found on mount. */
  hasDraft: boolean;
  /** When that draft was written, for display. */
  draftSavedAt: Date | null;
  /** Applies the draft to the form. */
  restoreDraft: () => void;
  /** Removes the draft and hides the prompt. */
  discardDraft: () => void;
  /** Call after a successful submit so the prompt does not reappear. */
  clearDraft: () => void;
  /** Set when saving failed, e.g. quota exceeded. */
  saveError: string | null;
}

/** localStorage access can throw on access, not just on write. */
function safeGetItem(key: string): string | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // Nothing useful to do; a lingering draft is harmless.
  }
}

/**
 * Strips values that cannot survive a reload.
 *
 * Image handlers write URL.createObjectURL previews into form state while an
 * upload is in flight. Those blob: URLs are dead after a refresh, so persisting
 * one would restore a broken image.
 */
function stripEphemeralValues(input: unknown): unknown {
  if (typeof input === "string") {
    return input.startsWith("blob:") ? "" : input;
  }

  if (Array.isArray(input)) {
    return input.map(stripEphemeralValues);
  }

  if (input && typeof input === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      output[key] = stripEphemeralValues(value);
    }
    return output;
  }

  return input;
}

export function useFormDraft<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  /**
   * Unique per form instance: "new" for creation, the course link for updates.
   * Pass null to disable saving entirely, which the update page relies on until
   * the fetched course has been loaded into the form.
   */
  draftId: string | null,
  options?: {
    /** Quiet period before writing. Quill fires on every keystroke. */
    debounceMs?: number;
    /**
     * While false, nothing is saved. The update page holds this off until its
     * reset() with server data has run, so the fetch is not recorded as a draft.
     */
    enabled?: boolean;
  }
): FormDraftState {
  const debounceMs = options?.debounceMs ?? 800;
  const enabled = options?.enabled ?? true;

  const storageKey = draftId ? `${KEY_PREFIX}${draftId}` : null;

  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /** Holds the draft read on mount until the user accepts or rejects it. */
  const pendingDraftRef = useRef<unknown>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Suppresses the save that our own restore() would otherwise trigger. */
  const skipNextSaveRef = useRef(false);

  /* Look for an existing draft once the key is known. */
  useEffect(() => {
    if (!storageKey) return;

    const raw = safeGetItem(storageKey);
    if (!raw) return;

    try {
      const parsed: StoredDraft = JSON.parse(raw);

      if (
        !parsed ||
        parsed.version !== DRAFT_VERSION ||
        typeof parsed.savedAt !== "number" ||
        !parsed.values
      ) {
        safeRemoveItem(storageKey);
        return;
      }

      if (Date.now() - parsed.savedAt > MAX_DRAFT_AGE_MS) {
        safeRemoveItem(storageKey);
        return;
      }

      pendingDraftRef.current = parsed.values;
      setDraftSavedAt(new Date(parsed.savedAt));
      setHasDraft(true);
    } catch {
      // Corrupt entry is worse than none.
      safeRemoveItem(storageKey);
    }
  }, [storageKey]);

  /* Debounced autosave driven by the form's own subscription. */
  useEffect(() => {
    if (!storageKey || !enabled) return;

    const subscription = form.watch((values) => {
      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false;
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        try {
          const payload: StoredDraft = {
            version: DRAFT_VERSION,
            savedAt: Date.now(),
            values: stripEphemeralValues(values),
          };

          window.localStorage.setItem(storageKey, JSON.stringify(payload));
          setSaveError(null);
        } catch (error: any) {
          // Most likely QuotaExceededError. Surface it rather than let the user
          // believe a draft exists when it does not.
          setSaveError(
            error?.name === "QuotaExceededError"
              ? "Draft too large to save automatically. Please submit soon."
              : "Could not save draft automatically."
          );
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, storageKey, enabled, debounceMs]);

  const restoreDraft = useCallback(() => {
    const values = pendingDraftRef.current;
    if (!values) return;

    skipNextSaveRef.current = true;

    try {
      // keepDefaultValues preserves the schema's defaults for any key the draft
      // does not carry, so an older draft cannot leave fields undefined.
      form.reset(values as T, { keepDefaultValues: true });
    } catch (error) {
      console.error("Failed to restore draft:", error);
      setSaveError("Could not restore the saved draft.");
    }

    setHasDraft(false);
  }, [form]);

  const discardDraft = useCallback(() => {
    if (storageKey) safeRemoveItem(storageKey);
    pendingDraftRef.current = null;
    setHasDraft(false);
    setDraftSavedAt(null);
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (storageKey) safeRemoveItem(storageKey);
    pendingDraftRef.current = null;
    setHasDraft(false);
    setDraftSavedAt(null);
  }, [storageKey]);

  return {
    hasDraft,
    draftSavedAt,
    restoreDraft,
    discardDraft,
    clearDraft,
    saveError,
  };
}

/**
 * Asks the browser to confirm before unloading while there are unsaved changes.
 * Catches the accidental Ctrl+R or tab close.
 */
export function useUnsavedChangesWarning(isDirty: boolean): void {
  useEffect(() => {
    if (!isDirty) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Required by some browsers to trigger the native prompt.
      event.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);
}
