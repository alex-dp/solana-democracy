import type { NextPage } from "next";
import Head from "next/head";
import { FundraisersView } from "../../views/fundraisers";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Fundraisers - Argon Suite</title>
        <meta
          name="description"
          content="a suite of programs for direct democracy on Solana"
        />
      </Head>
      <FundraisersView />
    </div>
  );
};

export default Home;
