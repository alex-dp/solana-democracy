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

        <link rel="apple-touch-icon" href="/public/icon.svg" />

        <link rel="icon" type="image/svg+xml" href="/public/icon.svg" />
        <link rel="icon" type="image/png" href="/public/icon.png" />
        <link rel="manifest" href="/public/manifest.json" />
        <link rel="mask-icon" href="/public/icon.svg" color="#8321C5" />
        <link rel="shortcut icon" href="/public/icon.svg" />

        <meta property="og:type" content="Solana Dapp" />
        <meta property="og:title" content="Argon Suite" />
        <meta property="og:description" content="Direct democracy on Solana" />
        <meta property="og:site_name" content="Argon Suite" />
        <meta property="og:url" content="https://argonsuite.org" />
        <meta property="og:image" content="https://argonsuite.org/icon.svg" />
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
