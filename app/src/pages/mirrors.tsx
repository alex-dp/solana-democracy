import type { NextPage } from "next";
import Head from "next/head";
import { MirrorsView } from "views/mirrors";

const Mirrors: NextPage = (props) => {
    return (
        <div className="ubi-body">
            <Head>
                <title>Mirrors | Argon Suite</title>
                <meta
                    name="description"
                    content="Mirrors | Argon Suite"
                />
            </Head>
            <MirrorsView />
        </div>
    );
};

export default Mirrors;
