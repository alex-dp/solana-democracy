import type { NextPage } from "next";
import Head from "next/head";
import { UBIView } from "views/ubi";

const UBI: NextPage = (props) => {
    return (
        <div className="ubi-body">
            <Head>
                <title>UBI | Solana Democracy Suite</title>
                <meta
                    name="description"
                    content="Universal Basic Income | Solana Democracy Suite"
                />
            </Head>
            <UBIView />
        </div>
    );
};

export default UBI;
