import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { FormEvent, useCallback, useEffect, useRef } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";

import { useIDL, FUNDRAISER_PROGRAM } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getEscrowAddresses, getFundAddress, getFundListAddress, getPartitionAddress } from 'utils/fundraisers';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { mints, names } from 'utils';
import useFundraiserStore from 'stores/useFundraiserStore';

type ButtonProps = {
    connection: Connection,
    program: Program
}


export const MakeFund = (props: ButtonProps) => {
    const wallet = useWallet();

    const { setVisible } = useWalletModal();

    const { notify } = useNotificationStore();

    const { idList, getIdList } = useFundraiserStore()

    let mintRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if (!idList) getIdList(props.connection)
    }, [props.connection])

    let check = (e) => {
        if (e.target.checked && !wallet.connected) {
            setVisible(true)
            e.preventDefault()
            e.target.checked = false
            return
        }
    }

    let addFund = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        let data = new Map<String, any>()

        for (let i = 0; e.target[i].id; i++) {
            let target = e.target[i]
            data.set(target.id, target.type == "checkbox" ? target.checked : target.value)
        }

        let obj = Object.fromEntries(data.entries())

        let partitionATA = getAssociatedTokenAddressSync(new PublicKey(obj.mint), new PublicKey(obj.recipient_pk), false)
        let [signer, vault] = getEscrowAddresses(idList.next_fund, new PublicKey(obj.mint))

        try {
            await getAccount(props.connection, partitionATA)
        } catch {
            notify({ type: "error", message: `Recipient ${obj.partition_name} has no token account for mint` })
            return
        }

        let transaction = new Transaction()

        transaction.add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey, // payer
                vault, // ata
                signer, // owner
                new PublicKey(obj.mint) // mint
            )
        );

        transaction.add(
            await props.program.methods.makeFund(
                idList.next_fund,
                !obj.public,
                obj.fund_url,
                obj.partition_url,
                obj.fund_name,
                obj.partition_name).accounts({
                    signer: wallet.publicKey,
                    liveFunds: getFundListAddress(),
                    fund: getFundAddress(idList.next_fund),
                    tokenMint: new PublicKey(obj.mint),
                    firstPartition: getPartitionAddress(idList.next_fund, 0),
                    fpRecOwner: new PublicKey(obj.recipient_pk),
                    fpRecToken: partitionATA,
                    escrowVault: vault,
                    escrowSigner: signer,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId
                }).instruction()
        );

        let signature = null

        try {
            signature = await wallet.sendTransaction(transaction, props.connection);
        } catch (error) {
            console.log(error)
            return
        }

        notify({ type: 'loading', message: `Creating fund "${obj.fund_name}"`, txid: signature });

        const latestBlockHash = await props.connection.getLatestBlockhash();

        await props.connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: `Fund "${obj.fund_name}" created`, txid: signature });

    }, [wallet, props.connection])

    return (

        <div>
            <label htmlFor="my-modal-4" className="btn btn-active mx-auto border-2 border-purple-700">
                Start your own fund
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='currentColor'>
                    <path d="M280-160v-441q0-33 24-56t57-23h439q33 0 56.5 23.5T880-600v320L680-80H360q-33 0-56.5-23.5T280-160ZM81-710q-6-33 13-59.5t52-32.5l434-77q33-6 59.5 13t32.5 52l10 54h-82l-7-40-433 77 40 226v279q-16-9-27.5-24T158-276L81-710Zm279 110v440h280l160-160v-280H360Zm220 220Zm-40 160h80v-120h120v-80H620v-120h-80v120H420v80h120v120Z" />
                </svg>
            </label>

            <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" onChange={check} />

            <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
                <label className="modal-box text-center rounded-xl w-2xl h-fit border-2 border-purple-600" htmlFor="">
                    <h3 className="text-lg font-bold text-center mb-4">Make a fund</h3>

                    <form onSubmit={addFund} className="flex flex-col gap-4">
                        <input id='fund_name' type="text" placeholder="Fund Name" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='fund_url' type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />

                        <div className='flex flex-row'>
                            <input ref={mintRef} id='mint' type="text" placeholder="Receivable Mint Address" className="input input-bordered w-full max-w-xs mx-auto" />
                            <select id='common_mint' value="COMMON MINTS" className="select select-primary w-fit max-w-xs" onChange={(e) => { mintRef.current.value = e.target.value }}>
                                <option disabled>COMMON MINTS</option>
                                {names.map((e, i) => <option value={mints[i]} key={i}>{e}</option>)}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer input input-bordered w-full max-w-xs mx-auto">
                                <span className="label-text">Allow others to make partitions</span>
                                <input id='public' type="checkbox" className="checkbox" />
                            </label>
                        </div>

                        <div className='flex flex-row w-full gap-4 place-content-center place-items-center'>
                            <div className='h-[1px] w-20 bg-white' />
                            <h3>Info for the first participating project</h3>
                            <div className='h-[1px] w-20 bg-white' />
                        </div>

                        <input id='partition_name' type="text" placeholder="Project Name" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='partition_url' type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='recipient_pk' type="text" placeholder="Recipient's Public Key" className="input input-bordered w-full max-w-xs mx-auto" />

                        <button type="submit" className="btn btn-active btn-primary mx-auto gap-2">
                            submit
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                        </button>
                    </form>
                </label>
            </label>
        </div>
    );
};

