import type { NextPage } from "next";
import Head from "next/head";
import { PetitionsView } from "../../views";

const Petitions: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Petitions | Argon Suite</title>
        <meta
          name="description"
          content="Petitions | Argon Suite"
        />
      </Head>
      <PetitionsView />
    </div>
  );
};

export default Petitions;
