import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="perload"
          href="/fonts/Poppins-Bold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="perload"
          href="/fonts/Poppins-Regular.ttf"
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="perload"
          href="/fonts/Poppins-SemiBold.ttf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
