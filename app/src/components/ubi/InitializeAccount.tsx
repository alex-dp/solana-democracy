import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';

import { Connection, PublicKey } from '@solana/web3.js';
import { Program, web3 } from "@coral-xyz/anchor";

import {
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

import { UBI_MINT } from '../../types/types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getUbiInfoAddress } from 'utils/ubi';

const { SystemProgram } = web3;

type ButtonProps = {
    connection: Connection,
    program: Program
}

export const InitializeAccount: FC = (props: ButtonProps) => {
    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);
    const wallet = useWallet()

    const { setVisible } = useWalletModal();

    const { notify } = useNotificationStore();

    const onClick = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        let pda = getUbiInfoAddress(wallet.publicKey)

        let info_raw = await connection.getAccountInfo(pda)

        let signature: TransactionSignature = '';

        let ata = await getAssociatedTokenAddress(
            new PublicKey(UBI_MINT), // mint
            wallet.publicKey, // owner
            false // allow owner off curve
        );

        let txs: Transaction[] = []
        let latest = await connection.getLatestBlockhash()

        if (!info_raw) {
            try {

                let transaction = new Transaction();

                transaction.add(
                    await props.program.methods.initializeAccount().accounts({
                        ubiInfo: pda,
                        userAuthority: wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                        platformFeeAccount: new PublicKey("DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv")
                    }).instruction()
                );
                transaction.recentBlockhash = latest.blockhash;
                transaction.feePayer = wallet.publicKey

                txs.push(transaction)
            } catch (error) {
                notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            }
        }

        let a = null

        try {
            a = await getAccount(connection, ata);
        } catch (error: unknown) {
            if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                try {
                    let tx = new Transaction();
                    tx.add(
                        createAssociatedTokenAccountInstruction(
                            wallet.publicKey, // payer
                            ata, // ata
                            wallet.publicKey, // owner
                            new PublicKey(UBI_MINT) // mint
                        )
                    );
                    tx.recentBlockhash = latest.blockhash;
                    tx.feePayer = wallet.publicKey

                    txs.push(tx);
                } catch (error) {
                    notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
                }
            }
        } finally {
            if (a && info_raw) {
                notify({ type: 'success', message: 'Your account is already initialized' });
            }
        }

        if (txs.length != 0) {
            try {
                let signedTxs = await wallet.signAllTransactions(txs)
                notify({ type: 'info', message: 'Your account is being initialized' });
                let sigs: Promise<TransactionSignature>[] = signedTxs.map(async (t) => {
                    return connection.sendRawTransaction(t.serialize())
                });
                await Promise.all(sigs)
                notify({ type: 'success', message: 'Your account has been initialized' });
            } catch (error) {
                notify({ type: 'error', message: error?.message });
            }

        }

    }, [wallet, connection]);

    return (
        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>initialize</span>
        </button>
    );
};

