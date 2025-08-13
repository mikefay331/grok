import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#33ff66" />
        <meta name="description" content="Live AI debates between Grok and ChatGPT in a backrooms-themed terminal" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}