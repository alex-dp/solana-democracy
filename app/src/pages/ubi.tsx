import type { NextPage } from "next";
import Head from "next/head";
import { UBIView } from "views/ubi";

const UBI: NextPage = (props) => {
    return (
        <div className="ubi-body">
            <Head>
                <title>Solana Scaffold</title>
                <meta
                    name="description"
                    content="Solana Scaffold"
                />
            </Head>
            <UBIView />
        </div>
    );
};

export default UBI;
