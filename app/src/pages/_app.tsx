import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import Notifications from '../components/Notification'
import { Analytics } from '@vercel/analytics/react';
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Argon Suite</title>

        <meta name="application-name" content="Argon Suite" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Argon Suite" />
        <meta name="description" content="Direct democracy on Solana" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icon.png" />

        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" type="image/png" href="/icon.png" color="#FFFFFF" />
        <link rel="shortcut icon" type="image/png" href="/icon.png" />

        <link rel="me" href="https://mastodon.social/@alexdp" />
        <link rel="me" href="https://kolektiva.social/@alexdp" />
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <AppBar />
          <Notifications />
          <ContentContainer>
            <Component {...pageProps} />
            <Analytics />
            <Footer />
          </ContentContainer>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
