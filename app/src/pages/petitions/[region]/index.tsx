import type { NextPage } from "next";
import Head from "next/head";
import { RegionView } from "views/petitions/region";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import useProposalStore from "stores/useProposalStore";
import { GatewayProvider } from "@civic/solana-gateway-react";

const RegionPage: NextPage = () => {

    const wallet = useWallet();

    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);

    const { state, getState } = useProposalStore();

    const router = useRouter()

    let regionID = router.query.region;

    useEffect(() => {
        if (!regionID && router.isReady) {
            regionID = router.query.region
        }

        if (regionID != null && !state) {
            getState(connection, Number(regionID.toString()))
        }
    }, [router.isReady, state])

    return (
        <div>
            <Head>
                <title>Petitions | Argon Suite</title>
                <meta
                    name="description"
                    content="Petitions | Argon Suite"
                />
            </Head>
            {state?.gatekeeper &&
                <GatewayProvider
                    wallet={wallet}
                    gatekeeperNetwork={new PublicKey(state.gatekeeper)}
                    connection={connection}
                    options={{ autoShowModal: false }}>
                    <RegionView code={Number(regionID.toString())} closed={false} />
                </GatewayProvider>
            }

        </div>
    );
};

export default RegionPage;