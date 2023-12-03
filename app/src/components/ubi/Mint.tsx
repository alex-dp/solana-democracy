import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program, web3 } from "@coral-xyz/anchor";

import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { createAssociatedTokenAccountInstruction, getAccount, TokenAccountNotFoundError, TokenInvalidAccountOwnerError } from '@solana/spl-token';
import { RawUBIInfo, UBI_MINT } from '../../types/types';
import { useGateway } from '@civic/solana-gateway-react';
import useUBIInfoStore from 'stores/useUBIInfoStore';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getMintSignerAddress, getUbiInfoAddress, getUserToken } from 'utils/ubi';

const { SystemProgram } = web3;

type MintProps = {
    ubiInfo: RawUBIInfo,
    connection: Connection,
    program: Program
}

export const Mint = (props: MintProps) => {
    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);
    const wallet = useWallet();

    const { gatewayToken, requestGatewayToken } = useGateway();

    const { setVisible } = useWalletModal();

    const { getInfo, clearInfo, info } = useUBIInfoStore();

    const { notify } = useNotificationStore();

    const onClick = useCallback(async () => {

        if (!wallet.connected) {
            setVisible(true)
            return
        }

        if (!gatewayToken) {
            requestGatewayToken()
            return
        }

        if (Date.now() / 1000 < Number(props.ubiInfo.lastIssuance) + 24 * 3600) {
            let hDiff = Math.ceil((Number(props.ubiInfo.lastIssuance) + 24 * 3600 - Date.now() / 1000) / 3600)
            notify({ type: 'error', message: `Please try again in ${hDiff} hour${hDiff != 1 && "s"}` })
            return
        }

        let mint_signer = getMintSignerAddress()

        let ata = await getUserToken(wallet.publicKey)

        try {
            await getAccount(connection, ata);
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

        let signature: TransactionSignature = '';
        try {

            let pda = getUbiInfoAddress(wallet.publicKey)

            let transaction = new Transaction().add(
                await props.program.methods.mintToken(gatewayToken.gatekeeperNetworkAddress).accounts({
                    mintSigner: mint_signer,
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

            notify({ type: 'loading', message: 'Minting in progress', txid: signature });

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: signature,
            });

            notify({ message: 'You have successfully minted some ARGON. Come back in 24 hours!', txid: signature });
            clearInfo(wallet.publicKey)
            getInfo(connection, wallet.publicKey)
        } catch (error) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
        }

    }, [wallet, connection, info]);

    return (

        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>mint</span>
        </button>
    );
};

