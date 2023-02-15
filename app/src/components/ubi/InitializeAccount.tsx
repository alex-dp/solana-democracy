import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../../utils/notifications";
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

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

import idl from '../../ubi_idl.json'
import { getMint } from '../../types/types';

const { SystemProgram } = web3;

const programID = new PublicKey(idl.metadata.address);

export const InitializeAccount: FC = () => {
    const connection = new Connection("***REMOVED***");
    const moniker = connection.rpcEndpoint.includes("mainnet") ? "mainnet-beta" : "devnet"
    const wallet = useWallet()
    const { getUserSOLBalance } = useUserSOLBalanceStore();

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const onClick = useCallback(async () => {

        const idl = await Program.fetchIdl(programID, getProvider())

        if (!wallet.publicKey) {
            notify({ type: 'error', message: 'Please connect your wallet' });
            return;
        }

        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info7"), wallet.publicKey.toBytes()],
            programID
        )

        let info_raw = await connection.getAccountInfo(pda[0])

        let signature: TransactionSignature = '';

        let ata = await getAssociatedTokenAddress(
            new PublicKey(getMint(moniker)), // mint
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
                            new PublicKey(getMint(moniker)) // mint
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
                signedTxs.forEach(element => {
                    connection.sendRawTransaction(element.serialize())
                });
                notify({ type: 'success', message: 'Your account has been initialized' });
            } catch (error) {
                notify({ type: 'error', message: error?.message });
            }

        }

    }, [wallet.publicKey, connection, getUserSOLBalance]);

    return (
        <button
            className="px-8 m-2 btn bg-gradient-to-r from-[#c53fe9ff] to-indigo-600 hover:from-[#303030] hover:to-[#303030] max-width-200 width-20..."
            onClick={onClick}
        >
            <span>initialize</span>
        </button>
    );
};

