import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, X, AlertTriangle } from "lucide-react";

interface DraftRestoreBannerProps {
  hasDraft: boolean;
  draftSavedAt: Date | null;
  onRestore: () => void;
  onDiscard: () => void;
  saveError?: string | null;
  /** Shown when a draft may be older than the data currently loaded. */
  warning?: string;
}

function formatSavedAt(date: Date): string {
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) return `today at ${time}`;

  return `${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })} at ${time}`;
}

/**
 * Offers an unsaved draft for restore. Deliberately opt-in: restoring is never
 * automatic, so a stale draft cannot silently overwrite newer saved data.
 */
const DraftRestoreBanner: React.FC<DraftRestoreBannerProps> = ({
  hasDraft,
  draftSavedAt,
  onRestore,
  onDiscard,
  saveError,
  warning,
}) => {
  if (!hasDraft && !saveError) return null;

  if (!hasDraft && saveError) {
    return (
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{saveError}</p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-blue-300 bg-blue-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-blue-900">
          <p className="font-semibold">
            Unsaved changes found
            {draftSavedAt ? ` from ${formatSavedAt(draftSavedAt)}` : ""}
          </p>
          <p className="mt-0.5 text-blue-800">
            {warning ||
              "You can restore them or start from the current values."}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onRestore}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Restore
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onDiscard}
            className="border-blue-300 text-blue-800 hover:bg-blue-100"
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Discard
          </Button>
        </div>
      </div>

      {saveError && (
        <p className="mt-3 border-t border-blue-200 pt-2 text-xs text-amber-800">
          {saveError}
        </p>
      )}
    </div>
  );
};

export default DraftRestoreBanner;
