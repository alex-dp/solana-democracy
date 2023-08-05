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
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
