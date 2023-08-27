import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Argon Suite</title>
        <meta
          name="description"
          content="a suite of programs for direct democracy on Solana"
        />
        <link rel="icon" href="/icon.png" type="image/svg+xml" />

        <link rel="apple-touch-icon" href="/icon.png" />

        <link rel="shortcut icon" type="image/png" href="/icon.png" />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
