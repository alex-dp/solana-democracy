import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../../utils/notifications";

import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

import idl from '../../ubi_idl.json'
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { UBIInfo, getMint } from '../../types/types';

const { SystemProgram } = web3;

const programID = new PublicKey(idl.metadata.address);

export const Mint: FC = () => {
    const connection = new Connection("***REMOVED***");
    const moniker = connection.rpcEndpoint.includes("mainnet") ? "mainnet-beta" : "devnet"
    const wallet = useWallet();

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const onClick = useCallback(async () => {
        let idl = await Program.fetchIdl(programID, getProvider())

        if (!wallet.publicKey) {
            notify({ type: 'error', message: 'Please connect your wallet' });
            return;
        }

        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info7"), wallet.publicKey.toBytes()],
            programID
        )

        let info_raw = await connection.getAccountInfo(pda[0])

        if (!info_raw) {
            notify({ type: 'error', message: "Please initialize your account" })
        }

        let provider: AnchorProvider = null

        try {
            provider = getProvider()
        } catch (error) { console.log(error) }

        let mint_signer = PublicKey.findProgramAddressSync(
            [Buffer.from("minter")],
            programID
        )

        let ata = await getAssociatedTokenAddress(
            new PublicKey(getMint(moniker)), // mint
            wallet.publicKey, // owner
            false // allow owner off curve
        );

        let a = null

        try {
            a = await getAccount(connection, ata);
        } catch (error: unknown) {
            if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                try {
                    let tx = new Transaction().add(
                        createAssociatedTokenAccountInstruction(
                            wallet.publicKey, // payer
                            ata, // ata
                            wallet.publicKey, // owner
                            new PublicKey(getMint(moniker)) // mint
                        )
                    );

                    let signature = await wallet.sendTransaction(tx, connection);

                    notify({ type: 'info', message: 'Await token account creation', txid: signature });

                    const latestBlockHash = await connection.getLatestBlockhash();

                    await connection.confirmTransaction({
                        blockhash: latestBlockHash.blockhash,
                        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                        signature: signature,
                    });

                    notify({ type: 'success', message: 'Token account created', txid: signature });
                } catch (error) {
                    notify({ type: 'error', message: `Transaction failed!`, description: error?.message });
                }
            }
        }

        let info = new UBIInfo(info_raw.data)
        const program = new Program(idl, programID, provider)

        if (!info.getIsTrusted().valueOf()) {
            notify({ type: 'error', message: "Need 8 trusters or civic pass in order to mint" })
            return
        } else if (new Date().getTime() / 1000 < info.getLastIssuance() + 24 * 3600) {
            notify({ type: 'error', message: "You minted NUBI less than 24 hours ago" })
            return
        } else {
            let signature: TransactionSignature = '';
            try {


                let transaction = new Transaction().add(
                    await program.methods.mintToken().accounts({
                        mintSigner: mint_signer[0],
                        ubiMint: getMint(moniker),
                        userAuthority: wallet.publicKey,
                        ubiTokenAccount: ata,
                        ubiInfo: pda[0],
                        state: "BfNHs2d373sCcxw5MjNmgLgQCEoFHM3Hv8XpEvqePLjD",
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                        rent: web3.SYSVAR_RENT_PUBKEY,
                    }).instruction()
                );

                signature = await wallet.sendTransaction(transaction, connection);

                const latestBlockHash = await connection.getLatestBlockhash();

                await connection.confirmTransaction({
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: signature,
                });

                notify({ type: 'success', message: 'You have successfully minted some NUBI. Come back in 24 hours!', txid: signature });
            } catch (error) {
                notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            }
        }

    }, [wallet.publicKey, connection]);

    return (
        <button
            className="px-8 m-2 btn bg-gradient-to-r from-[#c53fe9ff] to-indigo-600 hover:from-[#303030] hover:to-[#303030] max-width-200 width-20 ..."
            onClick={onClick}
        >
            <span>mint</span>
        </button>
    );
};

