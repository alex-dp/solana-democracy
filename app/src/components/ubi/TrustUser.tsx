import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, TransactionSignature, sendAndConfirmTransaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../../utils/notifications";
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

import { Buffer } from 'buffer';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";

import idl from '../../ubi_idl.json'
import { UBIInfo } from '../../types/types';

const programID = new PublicKey(idl.metadata.address);

export const TrustUser: FC = () => {
    const connection = new Connection("***REMOVED***");
    const wallet = useWallet();
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

        let signature: TransactionSignature = '';

        let provider = null

        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info7"), wallet.publicKey.toBytes()],
            programID
        )

        let info_raw = await connection.getAccountInfo(pda[0])
        if (info_raw) {
            let info = new UBIInfo(info_raw.data)
            if (info.getIsTrusted()) {
                try {
                    provider = getProvider() //checks & verify the dapp it can able to connect solana network

                    const program = new Program(idl, programID, provider) //program will communicate to solana network via rpc using lib.json as model

                    let transaction = new Transaction();
                    let trusteePKstr = prompt("Paste public key or SOL domain of user you wish to trust")
                    if (!trusteePKstr) return
                    let trusteePK: PublicKey = null
                    if (trusteePKstr.toLowerCase().endsWith(".sol")) {
                        try {
                            let pubkey = (await getDomainKey(trusteePKstr)).pubkey;
                            trusteePK = (await NameRegistryState.retrieve(connection, pubkey)).registry.owner
                        } catch (e: any) {
                            notify({ type: 'error', message: "Unable to resolve Sol domain" });
                            return;
                        }
                    } else if (!PublicKey.isOnCurve(trusteePKstr)) {
                        notify({ type: 'error', message: "Invalid public key!" });
                        return;
                    } else {
                        trusteePK = new PublicKey(trusteePKstr);
                    }

                    if (trusteePK.toString() == wallet.publicKey.toString()) {
                        notify({ type: 'error', message: "You may not trust yourself" });
                        return;
                    }

                    let trusteePda = PublicKey.findProgramAddressSync(
                        [Buffer.from("ubi_info7"), trusteePK.toBytes()],
                        programID
                    )

                    let trustee_info_raw = await connection.getAccountInfo(trusteePda[0])



                    if (!trustee_info_raw) {
                        notify({ type: 'error', message: "You are trying to trust an account which hasn't been initialized" });
                        return;
                    } else {
                        let tee_info = new UBIInfo(trustee_info_raw.data)

                        if (tee_info.getIsTrusted().valueOf()) {
                            notify({ type: 'info', message: "This account already has trust" });
                            return;
                        }
                        else if (tee_info.hasTruster(wallet.publicKey.toBytes()).valueOf()) {
                            notify({ type: 'info', message: "You can only trust someone once" });
                            return;
                        }
                        else if (info.getLastTrustGiven() + 5 * 60 > new Date().getTime() / 1000) {
                            notify({ type: 'error', message: "You trusted someone too recently. Try again in 5 minutes" });
                            return;
                        }
                    }

                    transaction.add(
                        await program.methods.trust().accounts({
                            trusteeUbiInfo: trusteePda[0],
                            trusterUbiInfo: pda[0],
                            trusterAuthority: wallet.publicKey
                        }).instruction()
                    );

                    signature = await wallet.sendTransaction(transaction, connection);

                    const latestBlockHash = await connection.getLatestBlockhash();

                    await connection.confirmTransaction({
                        blockhash: latestBlockHash.blockhash,
                        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                        signature: signature,
                    });
                    notify({ type: 'success', message: 'Transaction successful!', txid: signature });
                } catch (error) {
                    notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
                }
            } else {
                notify({ type: 'error', message: "You must be trusted in order to trust someone" })
            }
        } else {
            notify({ type: 'error', message: "Please initialize your account" })
        }

    }, [wallet.publicKey, connection, getUserSOLBalance]);

    return (
        <button
            className="px-8 m-2 btn bg-gradient-to-r from-[#c53fe9ff] to-indigo-600 hover:from-[#303030] hover:to-[#303030] max-width-200 width-20 ..."
            onClick={onClick}
        >
            <span>Trust a new user</span>
        </button>
    );
};

