import type { NextPage } from "next";
import Head from "next/head";
import { RegionView } from "views/petitions/region";
import { useRouter } from 'next/router';
import { useEffect } from "react";

const RegionPage: NextPage = () => {

    const router = useRouter()

    let region = router.query.region;

    useEffect(() => {
        if (!region && router.isReady) {
            region = router.query.region
        }
    }, [router, region])

    return (
        <div>
            <Head>
                <title>Solana Democracy Suite</title>
                <meta
                    name="description"
                    content="Solana Democracy Suite"
                />
            </Head>
            <RegionView code={Number(region.toString())} closed={true} />
        </div>
    );
};

export default RegionPage;