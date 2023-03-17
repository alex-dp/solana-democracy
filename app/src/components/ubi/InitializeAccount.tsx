import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../../utils/notifications";

import { Buffer } from 'buffer';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

import {
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    TokenAccountNotFoundError,
    TokenInvalidAccountOwnerError,
} from "@solana/spl-token";

import { UBI_MINT, UBI_PROGRAM, useIDL } from '../../types/types';

const { SystemProgram } = web3;

const programID = new PublicKey(UBI_PROGRAM);

export const InitializeAccount: FC = () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);
    const wallet = useWallet()

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const onClick = useCallback(async () => {

        const idl = await useIDL(programID, getProvider())

        if (!wallet.connected) {
            notify({ type: "info", message: "Please connect your wallet" })
            return
        }

        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info3"), wallet.publicKey.toBytes()],
            programID
        )

        let info_raw = await connection.getAccountInfo(pda[0])

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

                const program = new Program(idl, programID, getProvider())

                let transaction = new Transaction();

                transaction.add(
                    await program.methods.initializeAccount().accounts({
                        ubiInfo: pda[0],
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

    }, [wallet.publicKey, connection]);

    return (
        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>initialize</span>
        </button>
    );
};

