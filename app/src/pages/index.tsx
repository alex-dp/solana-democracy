import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Democracy Suite</title>
        <meta
          name="description"
          content="Solana Democracy Suite"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
