import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import { FormEvent, useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';

import { FUNDRAISER_PROGRAM, RawFund, RawPartition, useIDL } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import useNotificationStore from 'stores/useNotificationStore';
import { AnchorProvider, BN, Program, web3 } from '@coral-xyz/anchor';
import { getProvider } from 'utils';
import { getDistributionAddress, getEscrowAddresses, getFundAddress, getPartitionAddress } from 'utils/fundraisers';

type ButtonProps = {
    fundID: number,
    fund: RawFund,
    partitions: RawPartition[]
}

const programID = new PublicKey(FUNDRAISER_PROGRAM)

export const Donate = (props: ButtonProps) => {
    const connection = new Connection("https://api.devnet.solana.com")
    const wallet = useWallet();

    const { setVisible, visible } = useWalletModal();

    const { notify } = useNotificationStore()

    const modal_id = "d-modal-" + props.fundID

    let donate = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        console.log(e.target)

        let amount = e.target[0].value

        console.log("fund", props.fund)

        let ata = getAssociatedTokenAddressSync(props.fund.mint_addr, wallet.publicKey, false)

        try {
            await getAccount(connection, ata)
        } catch {
            notify({ type: "error", message: `You have no token account for this fund's mint` })
            return
        }

        let provider: AnchorProvider = null

        try {
            provider = getProvider(connection, wallet)
        } catch (error) { console.log(error) }

        let idl = await useIDL(programID, provider)

        const program = new Program(idl, programID, provider)

        let [signer, vault, bump] = getEscrowAddresses(props.fundID, props.fund.mint_addr)

        let transaction = new Transaction().add(
            await program.methods.donate(
                props.fundID,
                new BN(amount)).accounts({
                    signer: wallet.publicKey,
                    fund: getFundAddress(props.fundID),
                    escrowVault: vault,
                    escrowSigner: signer,
                    tokenMint: props.fund.mint_addr,
                    distribution: getDistributionAddress(props.fundID),
                    donorTokenAccount: ata,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId
                }).instruction()
        );

        let signature = null

        try {
            signature = await wallet.sendTransaction(transaction, connection);
        } catch (error) {
            console.log(error)
            return
        }

        notify({ type: 'loading', message: `Transferring to escrow account "${props.fund.name}"`, txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ type:"loading", message: `Distributing from escrow account`, txid: signature });

        transaction = new Transaction();

        props.fund.partitions.forEach(async (v, i) => {
            transaction.add(
                await program.methods.distributeDonation(
                    props.fundID,
                    v,
                    bump
                ).accounts({
                    signer: wallet.publicKey,
                    fund: getFundAddress(props.fundID),
                    escrowVault: vault,
                    escrowSigner: signer,
                    tokenMint: props.fund.mint_addr,
                    partitionTokenAccount: props.partitions[i].recipient_token_addr,
                    partition: getPartitionAddress(props.fundID, v),
                    distribution: getDistributionAddress(props.fundID),
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId
                }).instruction()
            )
        })

        try {
            signature = await wallet.sendTransaction(transaction, connection);
        } catch (error) {
            console.log(error)
            return
        }

        notify({ type: 'loading', message: `Transferring out from escrow account "${props.fund.name}" ...`, txid: signature });

        const latestBlockHash2 = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash2.blockhash,
            lastValidBlockHeight: latestBlockHash2.lastValidBlockHeight,
            signature: signature,
        });

        notify({ type: 'loading', message: `Distributed to all recipients. Unlocking fund...`, txid: signature });

        transaction = new Transaction().add(
            await program.methods.unlockFund(
                props.fundID).accounts({
                    signer: wallet.publicKey,
                    fund: getFundAddress(props.fundID),
                    distribution: getDistributionAddress(props.fundID),
                    systemProgram: web3.SystemProgram.programId
                }).instruction()
        );

        try {
            signature = await wallet.sendTransaction(transaction, connection);
        } catch (error) {
            console.log(error)
            return
        }

        const latestBlockHash3 = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash3.blockhash,
            lastValidBlockHeight: latestBlockHash3.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: `Fund unlocked`, txid: signature });

    }, [wallet, connection])

    let check = (e) => {
        if (e.target.checked && !wallet.connected) {
            setVisible(true)
            e.preventDefault()
            e.target.checked = false
            return
        }
    }

    return (

        <div>
            <label htmlFor={modal_id} className="btn btn-square">
                <svg fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M640-520q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520Zm-320-80h200v-80H320v80ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Zm60-80h80v-80h240v80h80l62-206 98-33v-141h-40L620-720q0-20 2.5-38.5T630-796q-29 8-51 27.5T547-720H300q-58 0-99 41t-41 99q0 98 27 191.5T240-200Zm240-298Z" />
                </svg>
            </label>

            <input type="checkbox" id={modal_id} className="modal-toggle z-100000" onChange={check} />

            <label htmlFor={modal_id} className="modal cursor-pointer z-1000">
                <label className="modal-box text-center rounded-xl w-2xl h-fit border-2 border-purple-600" htmlFor="">
                    <form onSubmit={donate} className="flex flex-col gap-4">

                        <div className='flex flex-row w-full gap-4 place-content-center place-items-center'>
                            <div className='h-[1px] w-20 bg-white' />
                            <h3>Donate {props.fund.mint_addr.toString()} to {props.fund.name}</h3>
                            <div className='h-[1px] w-20 bg-white' />
                        </div>

                        <input id='amount' type="number" placeholder="Amount" className="input input-bordered w-full max-w-xs mx-auto" />

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

