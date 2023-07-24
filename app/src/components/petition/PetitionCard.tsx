import { useGateway } from "@civic/solana-gateway-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import Link from "next/link";
import { useCallback } from "react";
import useProposalStore from "stores/useProposalStore";
import { PETITION_PROGRAM, useIDL } from "types/types";
import { notify } from "utils/notifications";

type CardProps = {
    id: number,
    creator: PublicKey,
    title: String,
    link: String,
    region: number,
    expiry: number, //unix timestamp
    closed: boolean,
    signatures: number,
    single?: boolean
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
    single
}: CardProps) => {
    const { clearLiveProps, getState, getLiveProps, state } = useProposalStore()

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

        let idbuf = Buffer.alloc(4)
        idbuf.writeInt32BE(id)

        let regbuf = Buffer.alloc(1)
        regbuf.writeUInt8(region)

        let sigAddress = PublicKey.findProgramAddressSync([Buffer.from("s"), wallet.publicKey.toBuffer(), regbuf, idbuf], programID)

        let sigAcc = await connection.getAccountInfo(sigAddress[0])

        if (sigAcc != null) {
            notify({ type: "error", message: "You have already signed this petition" })
            return
        }

        const idl = await useIDL(programID, provider)

        const program = new Program(idl, PETITION_PROGRAM, provider)

        let propAddress = PublicKey.findProgramAddressSync([Buffer.from("p"), regbuf, idbuf], programID)
        let stateAddr = PublicKey.findProgramAddressSync([Buffer.from("d"), regbuf], programID)

        let tx = new Transaction();
        tx.add(
            await program.methods.signProposal().accounts({
                proposal: propAddress[0],
                signature: sigAddress[0],
                gatewayToken: gatewayToken.publicKey,
                regionalState: stateAddr[0],
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
        <div className="card rounded-2xl w-96 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex flex-row place-content-between">
                    <p className="card-title w-fit">{title}</p>
                    {
                        !single &&
                        <Link href={`/petitions/${region}/${id}`}>
                            <button className="btn btn-square">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                                </svg>
                            </button>
                        </Link>
                    }
                </div>
                <a href={link.toString()} className="underline">info ↗️</a>
                {signatures} signature{signatures != 1 && "s"}
                <br />
                {closed ? "expired" : "expiring"} on {new Date(expiry * 1000).toDateString()}
                <div className="card-actions justify-end">
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
