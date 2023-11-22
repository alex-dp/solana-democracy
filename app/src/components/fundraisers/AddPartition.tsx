import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { FormEvent, useCallback, useEffect } from 'react';

import { PublicKey } from '@solana/web3.js';

import { FUNDRAISER_PROGRAM, RawFund, useIDL } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import useNotificationStore from 'stores/useNotificationStore';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { getProvider } from 'utils';
import { getFundAddress, getPartitionAddress } from 'utils/fundraisers';

type ButtonProps = {
    fundID: number,
    fund: RawFund
}

const programID = new PublicKey(FUNDRAISER_PROGRAM)

export const AddPartition = (props: ButtonProps) => {
    const connection = new Connection("https://api.devnet.solana.com")
    const wallet = useWallet();

    const { setVisible, visible } = useWalletModal();

    const { notify } = useNotificationStore()

    const modal_id = "ap-modal-" + props.fundID

    let addPartition = useCallback(async (e: FormEvent<HTMLFormElement>) => {
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

        console.log("fund", props.fund)

        let ata = getAssociatedTokenAddressSync(props.fund.mint_addr, new PublicKey(obj.recipient_pk), false)

        try {
            await getAccount(connection, ata)
        } catch {
            notify({ type: "error", message: `Recipient ${obj.partition_name} has no token account for mint` })
            return
        }

        let provider: AnchorProvider = null

        try {
            provider = getProvider(connection, wallet)
        } catch (error) { console.log(error) }

        let idl = await useIDL(programID, provider)

        const program = new Program(idl, programID, provider)

        let transaction = new Transaction().add(
            await program.methods.makePartition(
                props.fundID,
                obj.partition_url,
                obj.partition_name).accounts({
                    signer: wallet.publicKey,
                    fund: getFundAddress(props.fundID),
                    partition: getPartitionAddress(props.fundID, props.fund.next_partition),
                    recipientOwner: new PublicKey(obj.recipient_pk),
                    recipientTokenAccount: ata,
                    systemProgram: web3.SystemProgram.programId
                }).instruction()
        );

        let signature = null

        try {
            signature = await wallet.sendTransaction(transaction, connection);
        } catch (error) {
            console.log(error)
        }

        notify({ type: 'loading', message: `Listing project "${obj.partition_name}"`, txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: `Project "${obj.partition_name}" created`, txid: signature });
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
                <svg fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M500-482q29-32 44.5-73t15.5-85q0-44-15.5-85T500-798q60 8 100 53t40 105q0 60-40 105t-100 53Zm220 322v-120q0-36-16-68.5T662-406q51 18 94.5 46.5T800-280v120h-80Zm80-280v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Zm-480-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM0-160v-112q0-34 17.5-62.5T64-378q62-31 126-46.5T320-440q66 0 130 15.5T576-378q29 15 46.5 43.5T640-272v112H0Zm320-400q33 0 56.5-23.5T400-640q0-33-23.5-56.5T320-720q-33 0-56.5 23.5T240-640q0 33 23.5 56.5T320-560ZM80-240h480v-32q0-11-5.5-20T540-306q-54-27-109-40.5T320-360q-56 0-111 13.5T100-306q-9 5-14.5 14T80-272v32Zm240-400Zm0 400Z" /></svg>
            </label>

            <input type="checkbox" id={modal_id} className="modal-toggle z-100000" onChange={check} />

            <label htmlFor={modal_id} className="modal cursor-pointer z-1000">
                <label className="modal-box text-center rounded-xl w-2xl h-fit border-2 border-purple-600" htmlFor="">
                    <form onSubmit={addPartition} className="flex flex-col gap-4">

                        <div className='flex flex-row w-full gap-4 place-content-center place-items-center'>
                            <div className='h-[1px] w-20 bg-white' />
                            <h3>Participate in "{props.fund.name}" with your project</h3>
                            <div className='h-[1px] w-20 bg-white' />
                        </div>

                        <input id='partition_name' type="text" placeholder="Project Name" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='partition_url' type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input id='recipient_pk' type="text" placeholder="Recipient's public key" className="input input-bordered w-full max-w-xs mx-auto" />

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

