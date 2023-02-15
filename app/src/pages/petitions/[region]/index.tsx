import type { NextPage } from "next";
import Head from "next/head";
import RegionView from "views/petitions/region";
import { useRouter } from 'next/router';
import { useEffect } from "react";

const RegionPage: NextPage = () => {

    const router = useRouter()

    let region = router.query.region;

    useEffect(() => {
        if (!region && router.isReady) {
            region = router.query.region
        }
    }, [router.isReady])

    return (
        <div>
            <Head>
                <title>Solana Scaffold</title>
                <meta
                    name="description"
                    content="Basic Functionality"
                />
            </Head>
            <RegionView code={Number(region.toString())} closed={false} />
        </div>
    );
};

export default RegionPage;