import { useGateway } from "@civic/solana-gateway-react";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { OSS } from "components/OSS";
import PetitionCard from "components/petition/PetitionCard";
import Link from "next/link";
import { env } from "process";
import { FormEvent, useCallback, useEffect } from "react";
import useProposalStore from "stores/useProposalStore";
import { PETITION_PROGRAM } from "types/types";
import { notify } from "utils/notifications";

type ViewProps = {
    code: number,
    closed: boolean
}

export const RegionView = ({ code, closed }: ViewProps) => {

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

    const { state, getState, liveProps, closedProps, getLiveProps, getClosedProps } = useProposalStore()
    const { gatewayToken, gatewayStatus, requestGatewayToken } = useGateway();

    const provider = getProvider()

    const programID = new PublicKey(PETITION_PROGRAM)

    let fetchedAll = false

    useEffect(() => {
        if (!fetchedAll && !state) {
            getState(connection, code);
        } else if (state) {
            if (!closed && liveProps.length == 0 && state.liveProps.length != 0)
                getLiveProps(connection, state)
            else if (closedProps.length == 0 && state.closedProps.length != 0)
                getClosedProps(connection, state)
        } else fetchedAll = true;
    }, [state])

    let addPetition = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        const idl = await Program.fetchIdl(programID, provider)

        const program = new Program(idl, programID, provider)

        let title = e.target[0].value
        let link = e.target[1].value
        let expiry = Date.parse(e.target[2].value) / 1000

        let idbuf = Buffer.alloc(4)
        idbuf.writeInt32BE(state.lastId + 1)

        let regbuf = Buffer.alloc(1)
        regbuf.writeUInt8(state.region)

        let tx = new Transaction()

        let ppda = PublicKey.findProgramAddressSync([Buffer.from("p"), regbuf, idbuf], programID)
        let statepda = PublicKey.findProgramAddressSync([Buffer.from("d"), regbuf], programID)

        tx.add(
            await program.methods.createProposal(state.region, title, link, new BN(expiry)).accounts({
                proposal: ppda[0],
                regionalState: statepda[0],
                gatewayToken: gatewayToken.publicKey,
                userAuthority: "7KJGpvi9KdS6eFNwofcVqLQeqPTbUnGTcQShJzsqdqdv",
                platformFeeAccount: "DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv",
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            }).instruction()
        );

        let signature = await wallet.sendTransaction(tx, connection);

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });
        notify({ type: 'success', message: 'Transaction successful!', txid: signature });
    }, [gatewayToken, gatewayStatus, connection, wallet])

    let date = new Date()
    date.setDate(date.getDate() + 1)
    let minDate = date.toISOString().slice(0, 10)

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#c53fe9ff] to-blue-600 py-8">
                    {closed ? "Closed" : ""} Petitions
                </h1>

                <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
                    <Link href={`/petitions`}>
                        <button className="btn btn-square mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
                                <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
                            </svg>
                        </button>
                    </Link>
                    {state?.description}
                    <OSS />
                </h4>

                {
                    wallet.connected &&
                    <label htmlFor="my-modal-4" className="btn btn-active mx-auto">
                        Make a proposal
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48">
                            <path d="M22.5 36.3h3v-6.45H32v-3h-6.5v-6.5h-3v6.5H16v3h6.5ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
                        </svg>
                    </label>
                }

                <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" />

                <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
                    <label className="modal-box" htmlFor="">
                        <h3 className="text-lg font-bold my-6 text-center">Create a proposal</h3>
                        <form onSubmit={addPetition} className="flex flex-col">
                            <input type="text" placeholder="Title" className="input input-bordered w-full max-w-xs mt-6 mb-4 mx-auto" />
                            <input type="text" placeholder="URL" className="input input-bordered w-full max-w-xs my-4 mx-auto" />
                            <div className="my-4 mx-auto flex flex-row">
                                <label htmlFor="expiry" className="my-auto mx-4">Expiry</label>
                                <input type="date" id="expiry" className="input input-bordered w-full max-w-xs my-auto mx-4" min={minDate} />
                            </div>
                            <button type="submit" className="btn btn-active btn-primary mx-auto my-4">
                                submit
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                            </button>
                        </form>
                    </label>
                </label>
                <div className="flex flex-wrap place-content-center">
                    {(closed ? closedProps : liveProps).map((e, i) => <PetitionCard {...e} key={i} />)}
                </div>
            </div>
        </div>
    );
};