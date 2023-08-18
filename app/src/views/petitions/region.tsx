import { useGateway } from "@civic/solana-gateway-react";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, SystemProgram, Transaction, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import PetitionCard from "components/petition/PetitionCard";
import { GetISC } from "components/GetISC"
import Link from "next/link";
import { FormEvent, useCallback, useEffect } from "react";
import useProposalStore from "stores/useProposalStore";
import { ISC_MINT, PETITION_PROGRAM, useIDL } from "types/types";
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

    const { state, getState, liveProps, closedProps, getLiveProps, getClosedProps, clearLiveProps } = useProposalStore()
    const { gatewayToken, gatewayStatus, requestGatewayToken } = useGateway();
    const { setVisible } = useWalletModal();

    const provider = getProvider()

    const programID = new PublicKey(PETITION_PROGRAM)

    let fetchedAll = false

    useEffect(() => {

        if (!fetchedAll) {
            if (!state || state.region != code) {
                getState(connection, code)
            } else if (state) {
                if (!closed)
                    getLiveProps(connection, state)
                else
                    getClosedProps(connection, state)

                fetchedAll = true;
            }
        }
    }, [state])

    let addPetition = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        const idl = await useIDL(programID, provider)

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

        let ata = await getAssociatedTokenAddress(
            new PublicKey(ISC_MINT), // mint
            wallet.publicKey, // owner
            false // allow owner off curve
        );

        let a = null

        try {
            a = await getAccount(connection, ata);
        } catch (error: unknown) {
            if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                notify({ type: 'error', message: 'Please acquire at least 2 ISC for this transaction' });
                return
            }
        }

        tx.add(
            await program.methods.createProposal(state.region, title, link, new BN(expiry)).accounts({
                proposal: ppda[0],
                regionalState: statepda[0],
                gatewayToken: gatewayToken.publicKey,
                userAuthority: wallet.publicKey,
                platformFeeAccount: "DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv",
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
                ownerIsc: ata,
                platformIsc: "FKaxZ2sxmkQBTTqyPoWsRP6CiEHRotMppcis6zewdzoM",
                iscMint: ISC_MINT,
                tokenProgram: TOKEN_PROGRAM_ID
            }).instruction()
        );

        let signature = await wallet.sendTransaction(tx, connection);

        notify({ type: 'info', message: 'Your petition is being submitted', txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });
        notify({ type: 'success', message: 'Your petition has been recorded!', txid: signature });
        clearLiveProps(state.region)
        getState(connection, state.region)
        getLiveProps(connection, state)
    }, [gatewayToken, gatewayStatus, connection, wallet])

    let date = new Date()
    date.setDate(date.getDate() + 1)
    let minDate = date.toISOString().slice(0, 10)

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <p className="pt-8 pb-4 mx-auto">
                    <img src='/argonpetitions.svg' className='h-16' />
                </p>
                <h1 className="text-white capitalize">
                    {closed ? "Closed proposals" : ""}
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
                </h4>

                <label htmlFor="my-modal-4" className="btn btn-active mx-auto">
                    Make a proposal
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48">
                        <path d="M22.5 36.3h3v-6.45H32v-3h-6.5v-6.5h-3v6.5H16v3h6.5ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
                    </svg>
                </label>

                <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" />

                <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
                    <label className="modal-box text-center" htmlFor="">
                        <h3 className="text-lg font-bold my-6 text-center">Create a proposal</h3>

                        <form onSubmit={addPetition} className="flex flex-col">
                            <input type="text" placeholder="Title" className="input input-bordered w-full max-w-xs mt-6 mb-4 mx-auto" />
                            <input type="text" placeholder="URL" className="input input-bordered w-full max-w-xs my-4 mx-auto" />
                            <label className="input-group input-group-md w-full max-w-xs my-4 mx-auto place-content-center">
                                <span>Expiry</span>
                                <input type="date" id="expiry" className="input input-bordered" min={minDate} />
                            </label>

                            <button type="submit" className="btn btn-active btn-primary mx-auto mt-4 gap-2">
                                submit
                                <div className="badge">2 ISC</div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                            </button>
                        </form>

                        <GetISC />
                    </label>
                </label>
                <div className="flex flex-wrap place-content-center">
                    {(closed ? closedProps : liveProps).map((e, i) => <PetitionCard {...e} key={i} />)}
                </div>
            </div>
        </div>
    );
};