import type { NextPage } from "next";
import Head from "next/head";
import { UBIView } from "views/ubi";

const UBI: NextPage = (props) => {
    return (
        <div className="ubi-body">
            <Head>
                <title>UBI | Argon Suite</title>
                <meta
                    name="description"
                    content="Universal Basic Income | Argon Suite"
                />
            </Head>
            <UBIView />
        </div>
    );
};

export default UBI;
