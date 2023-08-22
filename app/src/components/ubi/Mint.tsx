import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';

import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";

import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { createAssociatedTokenAccountInstruction, getAccount, getAssociatedTokenAddress, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { RawUBIInfo, useIDL, UBI_PROGRAM, UBI_MINT } from '../../types/types';
import { useGateway } from '@civic/solana-gateway-react';
import useUBIInfoStore from 'stores/useUBIInfoStore';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getUbiInfoAddress, getUserToken } from 'utils/ubi';

const { SystemProgram } = web3;

const programID = new PublicKey(UBI_PROGRAM);

type MintProps = {
    info: RawUBIInfo
}

export const Mint = ({ info }: MintProps) => {
    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);
    const wallet = useWallet();

    const { gatewayToken, requestGatewayToken } = useGateway();

    const { setVisible } = useWalletModal();

    const { getInfo, clearInfo } = useUBIInfoStore();

    const { notify } = useNotificationStore();

    const getProvider = () => {
        const provider = new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
        return provider;
    };

    const onClick = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        if (Date.now() / 1000 < Number(info.lastIssuance) + 24 * 3600) {
            let hDiff = Math.ceil((Number(info.lastIssuance) + 24 * 3600 - Date.now() / 1000) / 3600)
            notify({ type: 'error', message: `Please try again in ${hDiff} hour${hDiff != 1 ? "s" : ""}` })
            return
        }

        let idl = await useIDL(programID, getProvider())

        let provider: AnchorProvider = null

        try {
            provider = getProvider()
        } catch (error) { console.log(error) }

        let mint_signer = PublicKey.findProgramAddressSync(
            [Buffer.from("minter")],
            programID
        )

        let ata = await getUserToken(wallet.publicKey)

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
                            new PublicKey(UBI_MINT) // mint
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

        let signature: TransactionSignature = '';
        try {

            let pda = getUbiInfoAddress(wallet.publicKey)

            let transaction = new Transaction().add(
                await program.methods.mintToken(gatewayToken.gatekeeperNetworkAddress).accounts({
                    mintSigner: mint_signer[0],
                    ubiMint: UBI_MINT,
                    userAuthority: wallet.publicKey,
                    ubiTokenAccount: ata,
                    ubiInfo: pda,
                    state: "BfNHs2d373sCcxw5MjNmgLgQCEoFHM3Hv8XpEvqePLjD",
                    gatewayToken: gatewayToken.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                }).instruction()
            );

            signature = await wallet.sendTransaction(transaction, connection);

            notify({ type: 'info', message: 'Minting in progress', txid: signature });

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: signature,
            });

            notify({ type: 'success', message: 'You have successfully minted some NUBI. Come back in 24 hours!', txid: signature });
            clearInfo(wallet.publicKey)
            getInfo(connection, wallet.publicKey)
        } catch (error) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
        }

    }, [wallet, connection]);

    return (

        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>mint</span>
        </button>
    );
};

