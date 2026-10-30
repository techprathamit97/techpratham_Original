'use client';

import { useCallback, useEffect, useState } from 'react';

/* ─── MSG91 OTP Web SDK (Default UI, methods exposed) ───
 *
 * Loads the MSG91 OTP provider script once, initialises the widget with
 * `exposeMethods: true`, and returns promisified sendOtp / verifyOtp / retryOtp
 * helpers so a custom form UI can drive the flow.
 *
 * The widget id and token are public by design (they are embedded in the page).
 * The secret Auth Key is NEVER used here — the verified access token returned by
 * `verifyOtp` is confirmed server-side (see /api/verify-otp) using the Auth Key.
 */

interface Msg91Config {
  widgetId: string;
  tokenAuth: string;
  exposeMethods?: boolean;
  identifier?: string;
  success?: (data: unknown) => void;
  failure?: (error: unknown) => void;
}

type OtpCallback = (data: unknown) => void;

declare global {
  interface Window {
    initSendOTP?: (config: Msg91Config) => void;
    sendOtp?: (identifier: string, success?: OtpCallback, failure?: OtpCallback) => void;
    verifyOtp?: (otp: string | number, success?: OtpCallback, failure?: OtpCallback) => void;
    retryOtp?: (
      channel: string | null,
      success?: OtpCallback,
      failure?: OtpCallback,
    ) => void;
  }
}

const SCRIPT_URLS = [
  'https://verify.msg91.com/otp-provider.js',
  'https://verify.phone91.com/otp-provider.js',
];

// Shared across every hook instance so the script is only ever loaded once.
let scriptPromise: Promise<void> | null = null;
// initSendOTP must be called exactly once per page load.
let otpInitialised = false;

function methodsReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.sendOtp === 'function' &&
    typeof window.verifyOtp === 'function'
  );
}

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.initSendOTP) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    let i = 0;
    const attempt = () => {
      const s = document.createElement('script');
      s.src = SCRIPT_URLS[i];
      s.async = true;
      s.onload = () => {
        if (typeof window.initSendOTP === 'function') resolve();
        else fallback();
      };
      s.onerror = fallback;
      document.head.appendChild(s);
    };
    const fallback = () => {
      i += 1;
      if (i < SCRIPT_URLS.length) attempt();
      else reject(new Error('Failed to load the OTP service.'));
    };
    attempt();
  });

  return scriptPromise;
}

function toError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === 'string') return new Error(err);
  if (err && typeof err === 'object') {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string') return new Error(m);
  }
  return new Error('Something went wrong. Please try again.');
}

// The verified access token comes back as `data.message` (exposeMethods mode).
function extractToken(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const m = (data as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  return '';
}

export interface Msg91Otp {
  ready: boolean;
  /** Send an OTP to a phone identifier (country code + number, no "+"). */
  sendOtp: (identifier: string) => Promise<void>;
  /** Verify the 6-digit OTP; resolves with the verified JWT access token. */
  verifyOtp: (otp: string) => Promise<string>;
  /** Re-send the OTP over the same channel. */
  retryOtp: () => Promise<void>;
}

export function useMsg91Otp(): Msg91Otp {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
    const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH;

    if (!widgetId || !tokenAuth) {
      console.error('MSG91 widget id / token is not configured.');
      return;
    }

    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;

    loadScript()
      .then(() => {
        if (cancelled) return;

        // Initialise the widget once. With exposeMethods:true this attaches
        // window.sendOtp / verifyOtp / retryOtp — but NOT synchronously: the
        // widget first fetches its config, so we must wait for the methods to
        // actually appear before reporting "ready".
        if (!otpInitialised && typeof window.initSendOTP === 'function') {
          try {
            window.initSendOTP({
              widgetId,
              tokenAuth,
              exposeMethods: true,
              // The SDK expects these to exist even when methods are exposed.
              success: () => {},
              failure: () => {},
            });
            otpInitialised = true;
          } catch (e) {
            console.error('MSG91 initSendOTP failed:', e);
            return;
          }
        }

        if (methodsReady()) {
          setReady(true);
          return;
        }

        const start = Date.now();
        poll = setInterval(() => {
          if (methodsReady()) {
            if (poll) clearInterval(poll);
            if (!cancelled) setReady(true);
          } else if (Date.now() - start > 15000) {
            if (poll) clearInterval(poll);
            console.error('MSG91 OTP methods did not initialise in time.');
          }
        }, 150);
      })
      .catch((e) => console.error(e));

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
    };
  }, []);

  const sendOtp = useCallback(
    (identifier: string) =>
      new Promise<void>((resolve, reject) => {
        if (typeof window.sendOtp !== 'function') {
          reject(new Error('OTP service is not ready yet. Please try again.'));
          return;
        }
        window.sendOtp(
          identifier,
          () => resolve(),
          (err) => reject(toError(err)),
        );
      }),
    [],
  );

  const verifyOtp = useCallback(
    (otp: string) =>
      new Promise<string>((resolve, reject) => {
        if (typeof window.verifyOtp !== 'function') {
          reject(new Error('OTP service is not ready yet. Please try again.'));
          return;
        }
        window.verifyOtp(
          otp,
          (data) => {
            const token = extractToken(data);
            if (token) resolve(token);
            else reject(new Error('Could not verify the OTP. Please try again.'));
          },
          (err) => reject(toError(err)),
        );
      }),
    [],
  );

  const retryOtp = useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        if (typeof window.retryOtp !== 'function') {
          reject(new Error('OTP service is not ready yet. Please try again.'));
          return;
        }
        window.retryOtp(
          null,
          () => resolve(),
          (err) => reject(toError(err)),
        );
      }),
    [],
  );

  return { ready, sendOtp, verifyOtp, retryOtp };
}
