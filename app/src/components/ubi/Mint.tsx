import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';
import { notify } from "../../utils/notifications";

import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';

import idl from '../../ubi_idl.json'
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { RawUBIInfo, getMint } from '../../types/types';
import { useGateway } from '@civic/solana-gateway-react';
import { env } from 'process';

const { SystemProgram } = web3;

const programID = new PublicKey(idl.metadata.address);

type MintProps = {
    info: RawUBIInfo,
    infoAddress: PublicKey
}

export const Mint = ({ info, infoAddress }: MintProps) => {
    const connection = new Connection(env.NEXT_PUBLIC_ENDPOINT);
    const moniker = connection.rpcEndpoint.includes("mainnet") ? "mainnet-beta" : "devnet"
    const wallet = useWallet();

    const { gatewayToken, gatewayStatus, requestGatewayToken } = useGateway();

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const onClick = useCallback(async () => {

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        let idl = await Program.fetchIdl(programID, getProvider())

        if (!wallet.publicKey) {
            notify({ type: 'error', message: 'Please connect your wallet' });
            return;
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

        const program = new Program(idl, programID, provider)

        if (new Date().getTime() / 1000 < Number(info.lastIssuance) + 24 * 3600) {
            notify({ type: 'error', message: "You minted NUBI less than 24 hours ago" })
            return
        } else {
            let signature: TransactionSignature = '';
            try {

                let transaction = new Transaction().add(
                    await program.methods.mintToken(gatewayToken.gatekeeperNetworkAddress).accounts({
                        mintSigner: mint_signer[0],
                        ubiMint: getMint(moniker),
                        userAuthority: wallet.publicKey,
                        ubiTokenAccount: ata,
                        ubiInfo: infoAddress,
                        state: "BfNHs2d373sCcxw5MjNmgLgQCEoFHM3Hv8XpEvqePLjD",
                        gatewayToken: gatewayToken.publicKey,
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
            className="px-8 m-2 btn btn-active btn-primary gap-2"
            onClick={onClick}
        >
            <span>mint</span>
        </button>
    );
};

