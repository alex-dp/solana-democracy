import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program } from "@coral-xyz/anchor";

import { FUNDRAISER_PROGRAM, RawFund } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getFundAddress, getPartitionAddress } from 'utils/fundraisers';


const programID = new PublicKey(FUNDRAISER_PROGRAM);

type ButtonProps = {
    fundID: number,
    fund: RawFund,
    partitionID: number,
    connection: Connection,
    program: Program
}


export const DestroyPartition = (props: ButtonProps) => {
    const wallet = useWallet();

    const { setVisible } = useWalletModal();

    const { notify } = useNotificationStore();

    const onClick = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        let transaction = new Transaction().add(
            await props.program.methods.destroyPartition(
                props.fundID,
                props.partitionID,
            ).accounts({
                signer: wallet.publicKey,
                fund: getFundAddress(props.fundID),
                partition: getPartitionAddress(props.fundID, props.partitionID),
            }).instruction()
        )

        let signature = await wallet.sendTransaction(transaction, props.connection);

        notify({ type: 'loading', message: 'Deleting partition...', txid: signature });

        const latestBlockHash = await props.connection.getLatestBlockhash();

        await props.connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ message: 'Partition deleted', txid: signature });

    }, [wallet, props.connection]);

    return (
        <div className='tooltip' data-tip="Delete this partition">
            <button className="btn btn-sm btn-square my-2" onClick={onClick}>
                <svg className='my-auto' xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill='currentColor'>
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
            </button>
        </div>
    );
};

