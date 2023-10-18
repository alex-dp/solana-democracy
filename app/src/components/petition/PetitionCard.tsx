import { useGateway } from "@civic/solana-gateway-react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import Link from "next/link";
import { useCallback } from "react";
import useNotificationStore from "stores/useNotificationStore";
import useProposalStore from "stores/useProposalStore";
import { PETITION_PROGRAM, useIDL } from "types/types";
import { getPropAddress, getSigAddress, getStateAddress } from "utils/petitions";

type CardProps = {
    id: number,
    creator: PublicKey,
    title: String,
    link: String,
    region: number,
    expiry: number, //unix timestamp
    closed: boolean,
    signatures: number,
};

const PetitionCard = ({
    id,
    creator,
    title,
    link,
    region,
    expiry, //unix timestamp
    closed,
    signatures,
}: CardProps) => {
    const { clearLiveProps, getState, getLiveProps, state } = useProposalStore()

    const { notify } = useNotificationStore();

    const { gatewayToken, gatewayStatus, requestGatewayToken } = useGateway();

    const { setVisible } = useWalletModal();

    const wallet = useWallet();

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);

    const provider = getProvider()

    const programID = new PublicKey(PETITION_PROGRAM)

    const sign = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        let sigAddress = getSigAddress(wallet.publicKey, region, id)

        let sigAcc = await connection.getAccountInfo(sigAddress)

        if (sigAcc != null) {
            notify({ type: "error", message: "You have already signed this petition" })
            return
        }

        const idl = await useIDL(programID, provider)

        const program = new Program(idl, PETITION_PROGRAM, provider)

        let propAddress = getPropAddress(region, id)
        let stateAddr = getStateAddress(region)

        let tx = new Transaction();
        tx.add(
            await program.methods.signProposal().accounts({
                proposal: propAddress,
                signature: sigAddress,
                gatewayToken: gatewayToken.publicKey,
                regionalState: stateAddr,
                userAuthority: wallet.publicKey,
                platformFeeAccount: "DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv",
                systemProgram: SystemProgram.programId
            }).instruction()
        );

        let signature = await wallet.sendTransaction(tx, connection);

        notify({ type: 'info', message: 'The petition is being signed', txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });
        notify({ type: 'success', message: 'Petition signed successfully!', txid: signature });

        clearLiveProps(region)
        getState(connection, region)
        getLiveProps(connection, state)
    }, [wallet, connection, gatewayToken, gatewayStatus])

    return (
        <div className="card rounded-xl max-w-2xl w-fit h-fit m-6 bg-base-100 shadow-xl">
            <div className="card-body">

                <p className="card-title w-fit">{title}</p>

                <a href={link.toString()} className="underline">info ↗️</a>

                {signatures} signature{signatures != 1 && "s"}

                <br />

                {closed ? "expired" : "expiring"} on {new Date(expiry * 1000).toDateString()}

                <div className="card-actions justify-end">
                    <Link href={`/petitions/${region}/${id}`}>
                        <button className="btn btn-square">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 -960 960 960">
                                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />                            </svg>
                        </button>
                    </Link>
                    {
                        closed ?
                            <button className="btn btn-disabled">closed</button>
                            :
                            <button className="btn btn-active btn-primary gap-2" onClick={sign}>
                                Sign
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="M4 48v-6.35h40V48Zm3.95-11.65v-6.8L26.7 10.8l6.85 6.85-18.75 18.7Zm27.65-20.8L28.8 8.7l4.25-4.3q.6-.65 1.35-.675.75-.025 1.5.675l3.9 3.9q.7.7.7 1.5t-.6 1.45Z" /></svg>
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default PetitionCard;
