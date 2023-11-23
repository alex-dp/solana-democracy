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
import { getProvider } from "utils";
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

    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);

    const provider = getProvider(connection, wallet)

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
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                                    <path d="M563-491q73-54 114-118.5T718-738q0-32-10.5-47T679-800q-47 0-83 79.5T560-541q0 14 .5 26.5T563-491ZM120-120v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM136-280l-56-56 64-64-64-64 56-56 64 64 64-64 56 56-64 64 64 64-56 56-64-64-64 64Zm482-40q-30 0-55-11.5T520-369q-25 14-51.5 25T414-322l-28-75q28-10 53.5-21.5T489-443q-5-22-7.5-48t-2.5-56q0-144 57-238.5T679-880q52 0 85 38.5T797-734q0 86-54.5 170T591-413q7 7 14.5 10.5T621-399q26 0 60.5-33t62.5-87l73 34q-7 17-11 41t1 42q10-5 23.5-17t27.5-30l63 49q-26 36-60 58t-63 22q-21 0-37.5-12.5T733-371q-28 25-57 38t-58 13Z" />
                                </svg>
                            </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default PetitionCard;
