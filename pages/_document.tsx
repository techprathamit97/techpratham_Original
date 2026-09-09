import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom _document to set lang="en" on <html>.
 * This is required for accessibility (screen readers) and is flagged by
 * Lighthouse as a failing audit when absent.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
