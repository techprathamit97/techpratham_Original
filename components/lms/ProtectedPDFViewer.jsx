"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Renders a PDF as canvas pages using pdf.js directly.
 *
 * Why this blocks what an <iframe> cannot:
 *  - the native PDF viewer (and its download / print / save-as controls) is gone
 *  - pages live in this document, not a cross-origin one, so contextmenu is
 *    genuinely cancellable
 *  - nothing but pixels are produced, so there is no text to select or copy
 *
 * This does not make the file unobtainable. The bytes still reach the browser
 * and can be recovered from devtools or screenshotted. It removes the easy paths.
 *
 * pdf.js is loaded at runtime from /pdf.min.mjs with a webpackIgnore hint, so
 * the browser fetches it as native ESM. Importing the npm package instead makes
 * webpack process its .mjs build as CommonJS, which throws
 * "Object.defineProperty called on non-object".
 *
 * Both /pdf.min.mjs and /pdf.worker.min.mjs are copied from
 * node_modules/react-pdf/node_modules/pdfjs-dist/build/ and must stay on the
 * same version as each other.
 *
 * Standalone: nothing here is imported by PDFSection or the e-book pages.
 */

const PDF_LIB_URL = "/pdf.min.mjs";
const PDF_WORKER_URL = "/pdf.worker.min.mjs";

/** Cached so repeated mounts reuse one module instance. */
let pdfLibPromise = null;

function loadPdfLib() {
  if (!pdfLibPromise) {
    pdfLibPromise = import(/* webpackIgnore: true */ PDF_LIB_URL).then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
      return lib;
    });
  }
  return pdfLibPromise;
}

/** Renders a single page to its own canvas. */
const PdfCanvas = ({ pdfDoc, pageNumber, width }) => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let renderTask = null;

    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !pdfDoc) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = width / baseViewport.width;
        const viewport = page.getViewport({ scale });

        // Render at device resolution so pages stay sharp on retina screens.
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);

        /**
         * Only the CSS width is set. Height stays auto so the canvas keeps the
         * aspect ratio implied by its width/height attributes, which lets the
         * max-w-full class below scale a page down rather than overflow. Setting
         * an explicit CSS height here would defeat that and reintroduce the
         * horizontal scrollbar on wide (landscape) pages.
         */
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = "auto";

        const context = canvas.getContext("2d");
        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (!cancelled) setReady(true);
      } catch (error) {
        // RenderingCancelledException is expected on unmount or resize.
        if (!cancelled && error?.name !== "RenderingCancelledException") {
          console.error(`Failed to render page ${pageNumber}:`, error);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDoc, pageNumber, width]);

  return (
    <div
      className="relative max-w-full overflow-hidden rounded bg-white shadow-md"
      style={{ minHeight: ready ? undefined : width * 1.414 }}
    >
      {!ready && (
        <div
          className="absolute inset-0 max-w-full animate-pulse bg-gray-100"
          style={{ height: width * 1.414 }}
        />
      )}
      {/* max-w-full with height auto scales a page down instead of overflowing. */}
      <canvas ref={canvasRef} className="block h-auto max-w-full" />
    </div>
  );
};

/**
 * Every prop has a default so TypeScript callers can pass only what they need.
 * Without defaults, TS infers fileKey/fileUrl/title/onLoadError as required and
 * a .tsx consumer fails to compile.
 */
const ProtectedPDFViewer = ({
  /** S3 key (e.g. "puck/1234-file.pdf") or a full bucket URL. */
  fileKey = "",
  /**
   * Direct same-origin URL to a PDF, for files that are not in S3 (for example
   * /training/x.pdf). When provided this is used instead of fileKey and the
   * /api/secure-pdf proxy is skipped.
   */
  fileUrl = "",
  title = "",
  maxWidth = 900,
  /** Pages rendered before scrolling triggers more. */
  initialPages = 3,
  blockKeyboardShortcuts = true,
  /** Defaults to a no-op so the inferred type is a function, not null. */
  onLoadError = () => {},
}) => {
  const containerRef = useRef(null);
  const docRef = useRef(null);

  /**
   * Held in a ref so it is not an effect dependency. The prop has a default of
   * () => {} to keep TypeScript callers happy, which means a new function
   * identity on every render. Depending on it directly made the load effect
   * re-run continuously and the viewer never left the loading state.
   */
  const onLoadErrorRef = useRef(onLoadError);
  onLoadErrorRef.current = onLoadError;

  /** Watched by IntersectionObserver to trigger rendering further pages. */
  const sentinelRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [visiblePages, setVisiblePages] = useState(initialPages);
  const [pageWidth, setPageWidth] = useState(maxWidth);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  /**
   * Match rendered page width to the container, capped at maxWidth.
   *
   * The measurement is also clamped to documentElement.clientWidth. PDFSection
   * applies `width: 100vw` to its container by default, and 100vw includes the
   * vertical scrollbar, so clientWidth alone reports a few pixels more than is
   * actually visible and the page would overflow horizontally.
   */
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current?.clientWidth ?? maxWidth;
      const visible = document.documentElement.clientWidth || container;
      const available = Math.min(container, visible);
      setPageWidth(Math.max(240, Math.min(available, maxWidth)));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [maxWidth]);

  /* Load the document. For S3 files the browser only sees our own API route. */
  useEffect(() => {
    if (!fileKey && !fileUrl) return;

    let cancelled = false;
    setStatus("loading");
    setError("");
    setVisiblePages(initialPages);

    const load = async () => {
      try {
        const pdfjs = await loadPdfLib();
        if (cancelled) return;

        // Strip any #toolbar=0 style hash; it is meaningless to pdf.js.
        const usingProxy = !fileUrl;
        const url = fileUrl
          ? fileUrl.split("#")[0]
          : `/api/secure-pdf?key=${encodeURIComponent(fileKey)}`;

        /**
         * Ranged chunk fetching is only needed for the /api/secure-pdf proxy.
         * Amplify serves route handlers from Lambda, which caps responses around
         * 6MB, and S3 course PDFs already exceed 10MB.
         *
         * Static files under /public must NOT use these options. With
         * disableStream, pdf.js waits on ranged responses that the Next static
         * file handler does not advertise the same way the proxy does, and the
         * load hangs at "Loading document...". Those files are only a few MB, so
         * the default streaming behaviour is correct for them.
         */
        const rangeOptions = usingProxy
          ? {
              disableStream: true,
              disableAutoFetch: true,
              rangeChunkSize: 262144,
            }
          : {};

        const doc = await pdfjs.getDocument({
          url,
          ...rangeOptions,
        }).promise;

        if (cancelled) {
          doc.destroy();
          return;
        }

        docRef.current = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        console.error("PDF load error:", err);
        setError(err?.message || "Could not load this document.");
        setStatus("error");
        onLoadErrorRef.current?.(err);
      }
    };

    load();

    return () => {
      cancelled = true;
      docRef.current?.destroy();
      docRef.current = null;
    };
    // onLoadError is intentionally excluded: it is read through a ref so an
    // unstable prop identity cannot restart the load.
  }, [fileKey, fileUrl, initialPages]);

  /**
   * Render more pages as the end of the list comes into view.
   *
   * Uses IntersectionObserver rather than a window scroll listener. The viewer
   * is sometimes placed inside a fixed-height overflow-y-auto container (the
   * course curriculum section does this), where scrolling happens on that inner
   * element and a window listener never fires, so pages past the first batch
   * were never rendered. IntersectionObserver accounts for clipping ancestors,
   * so it works for both page-level and inner-container scrolling.
   */
  useEffect(() => {
    if (status !== "ready" || visiblePages >= numPages) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisiblePages((current) => Math.min(current + 3, numPages));
        }
      },
      // Start fetching slightly before the sentinel is actually visible.
      { root: null, rootMargin: "300px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [status, visiblePages, numPages]);

  /* Right-click, drag, and copy cancelled inside the viewer only. */
  const swallow = useCallback((event) => {
    event.preventDefault();
    return false;
  }, []);

  /* Ctrl+S / Ctrl+P while the viewer has focus. */
  useEffect(() => {
    if (!blockKeyboardShortcuts) return;
    const node = containerRef.current;
    if (!node) return;

    const onKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        ["s", "p"].includes(event.key.toLowerCase())
      ) {
        event.preventDefault();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [blockKeyboardShortcuts]);

  if (!fileKey && !fileUrl) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center text-gray-500">
        No PDF provided.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      onContextMenu={swallow}
      onDragStart={swallow}
      onCopy={swallow}
      onCut={swallow}
      className="protected-pdf w-full max-w-full overflow-x-hidden outline-none"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      {title && (
        <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
          {title}
        </h3>
      )}

      {status === "loading" && (
        <div className="py-16 text-center text-sm text-gray-500">
          Loading document...
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center text-sm text-red-700">
          <p className="mb-1 font-semibold">Could not load this document.</p>
          <p className="font-mono text-xs">{error}</p>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="flex flex-col items-center gap-6">
            {Array.from({ length: Math.min(visiblePages, numPages) }, (_, index) => (
              <PdfCanvas
                key={`page-${index + 1}`}
                pdfDoc={pdfDoc}
                pageNumber={index + 1}
                width={pageWidth}
              />
            ))}

            {/* Watched by IntersectionObserver to load the next batch. */}
            {visiblePages < numPages && (
              <div ref={sentinelRef} className="h-4 w-full shrink-0" />
            )}
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Showing {Math.min(visiblePages, numPages)} of {numPages} page
            {numPages === 1 ? "" : "s"}
          </p>
        </>
      )}
    </div>
  );
};

export default ProtectedPDFViewer;
