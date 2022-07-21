import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head></Head>
      <body>
        <Main/>
        <NextScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin='true'/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'/>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=optional" rel="stylesheet"/>
      </body>
    </Html>
  )
}