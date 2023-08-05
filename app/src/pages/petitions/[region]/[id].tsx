import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { GatewayProvider } from "@civic/solana-gateway-react";
import useSingleProposalStore from "stores/useSingleProposalStore";
import PetitionCard from "components/petition/PetitionCard";
import useProposalStore from "stores/useProposalStore";
import Link from "next/link";

const RegionPage: NextPage = () => {

    const wallet = useWallet();

    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);

    const { proposal, getProposal } = useSingleProposalStore();

    const { state, getState } = useProposalStore();

    const router = useRouter()

    let regionID = router.query.region;
    let propID = router.query.id;

    useEffect(() => {
        if (!regionID && router.isReady) {
            regionID = router.query.region
            propID = router.query.id
        }

        if (regionID != null && (!state || Number(regionID.toString()) != state?.region)) {
            getState(connection, Number(regionID.toString()))
        }

        if (regionID != null && (!proposal || Number(propID.toString()) != proposal?.id)) {
            getProposal(connection, Number(regionID.toString()), Number(propID.toString()))
        }
    }, [router.isReady, proposal, state, router.query])

    return (
        <div>
            <Head>
                <title>Petition | Argon Suite</title>
                <meta
                    name="description"
                    content="Petition | Argon Suite"
                />
            </Head>
            <div className="md:hero mx-auto p-4">
                <div className="flex flex-col">
                    <Link href={`/petitions/${regionID}`}>
                        <button className="btn btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
                                <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
                            </svg>
                        </button>
                    </Link>
                    <div className="flex flex-wrap place-content-center">
                        {(state?.gatekeeper && proposal) &&
                            <GatewayProvider
                                wallet={wallet}
                                gatekeeperNetwork={new PublicKey(state.gatekeeper)}
                                connection={connection}
                                cluster={"mainnet"}
                                options={{ autoShowModal: false }}>
                                <PetitionCard {...proposal} single={true} />
                            </GatewayProvider>
                        }
                    </div>

                </div>
            </div >
        </div>
    );
};

export default RegionPage;