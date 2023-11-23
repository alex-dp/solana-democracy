import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import { useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';

import { FUNDRAISER_PROGRAM, RawFund, RawPartition } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { Program } from '@coral-xyz/anchor';
import { getFundAddress, getFundListAddress, getPartitionAddress } from 'utils/fundraisers';

type ButtonProps = {
    fundID: number,
    fund: RawFund,
    partitions: RawPartition[],
    program: Program,
    connection: Connection
}

const programID = new PublicKey(FUNDRAISER_PROGRAM)

export const DestroyFund = (props: ButtonProps) => {
    
    const wallet = useWallet();

    const { setVisible } = useWalletModal();

    const { notify } = useNotificationStore()

    let deleteFund = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        let signature = null

        let transaction = new Transaction();

        props.fund.partitions.forEach(async (v, i) => {
            transaction.add(
                await props.program.methods.destroyPartition(
                    props.fundID,
                    v,
                ).accounts({
                    signer: wallet.publicKey,
                    fund: getFundAddress(props.fundID),
                    partition: getPartitionAddress(props.fundID, v),
                }).instruction()
            )
        })

        transaction.add(
            await props.program.methods.destroyFund(
                props.fundID).accounts({
                    signer: wallet.publicKey,
                    liveFunds: getFundListAddress(),
                    fund: getFundAddress(props.fundID),
                }).instruction()
        );

        try {
            signature = await wallet.sendTransaction(transaction, props.connection);
        } catch (error) {
            console.log(error)
            return
        }

        notify({ type: "loading", message: `Deleting fund...`, txid: signature });

        const latestBlockHash3 = await props.connection.getLatestBlockhash();

        await props.connection.confirmTransaction({
            blockhash: latestBlockHash3.blockhash,
            lastValidBlockHeight: latestBlockHash3.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: `Fund deleted`, txid: signature });

    }, [wallet, props.connection])

    return (

        <div className={'tooltip'} data-tip='Delete this fund'>
            <button className="btn btn-square" onClick={deleteFund}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='currentColor'>
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
            </button>
        </div>
    );
};

