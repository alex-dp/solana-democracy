import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <noscript>
            Please enable JavaScript in your browser. Source available <a href='https://github.com/alex-dp/solana-democracy'>here</a>
          </noscript>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
