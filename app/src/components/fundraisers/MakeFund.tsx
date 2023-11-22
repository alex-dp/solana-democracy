import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { FormEvent, useCallback, useEffect } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";

import { useIDL, FUNDRAISER_PROGRAM } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getEscrowAddresses, getFundAddress, getFundListAddress, getPartitionAddress } from 'utils/fundraisers';
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { getProvider } from 'utils';
import useFundraiserStore from 'stores/useFundraiserStore';

const programID = new PublicKey(FUNDRAISER_PROGRAM);


export const MakeFund = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const wallet = useWallet();

    const { setVisible } = useWalletModal();

    const { notify } = useNotificationStore();

    const {idList, getIdList} = useFundraiserStore()

    useEffect(() => {
        if(!idList) getIdList(connection)
    }, [connection])

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

        for(let i=0;e.target[i].id;i++) {
            let target = e.target[i]
            data.set(target.id, target.type == "checkbox" ? target.checked : target.value)
        }

        let obj = Object.fromEntries(data.entries())

        let partitionATA = getAssociatedTokenAddressSync(new PublicKey(obj.mint), new PublicKey(obj.recipient_pk), false)
        let [signer, vault] = getEscrowAddresses(idList.next_fund, new PublicKey(obj.mint))

        try {
            await getAccount(connection, partitionATA)
        } catch {
            notify({type: "error", message: `Recipient ${obj.partition_name} has no token account for mint`})
            return
        }

        let provider: AnchorProvider = null

        try {
            provider = getProvider(connection, wallet)
        } catch (error) { console.log(error) }

        let idl = await useIDL(programID, provider)

        const program = new Program(idl, programID, provider)

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
            await program.methods.makeFund(
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
            signature = await wallet.sendTransaction(transaction, connection);
        } catch (error) {
            console.log(error)
        }

        notify({ type: 'loading', message: `Creating fund "${obj.fund_name}"`, txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: `Fund "${obj.fund_name}" created`, txid: signature });

    }, [wallet, connection])

    return (

        <div>
            <label htmlFor="my-modal-4" className="btn btn-active mx-auto border-2 border-purple-700">
                Start a new fund
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M22.5 36.3h3v-6.45H32v-3h-6.5v-6.5h-3v6.5H16v3h6.5ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
                </svg>
            </label>

            <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" onChange={check}/>

            <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
                <label className="modal-box text-center rounded-xl w-2xl h-fit border-2 border-purple-600" htmlFor="">
                    <h3 className="text-lg font-bold text-center mb-4">Make a fund</h3>

                    <form onSubmit={addFund} className="flex flex-col gap-4">
                        <input id='fund_name' type="text" placeholder="Fund Name" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='fund_url' type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='mint' type="text" placeholder="Receivable Mint Address" className="input input-bordered w-full max-w-xs mx-auto" />

                        <div className="form-control">
                            <label className="label cursor-pointer input input-bordered w-full max-w-xs mx-auto">
                                <span className="label-text">Allow others to make partitions</span>
                                <input id='public' type="checkbox" className="checkbox" />
                            </label>
                        </div>

                        <div className='flex flex-row w-full gap-4 place-content-center place-items-center'>
                            <div className='h-[1px] w-20 bg-white'/>
                            <h3>Info for the first participating project</h3>
                            <div className='h-[1px] w-20 bg-white'/>
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

