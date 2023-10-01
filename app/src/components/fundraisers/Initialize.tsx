import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";

import { useIDL, FUNDRAISER_PROGRAM } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useNotificationStore from 'stores/useNotificationStore';
import { getFundListAddress } from 'utils/fundraisers';


const programID = new PublicKey(FUNDRAISER_PROGRAM);


export const Initialize = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const wallet = useWallet();

    const { setVisible } = useWalletModal();

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

        let idl = await useIDL(programID, getProvider())

        let provider: AnchorProvider = null

        try {
            provider = getProvider()
        } catch (error) { console.log(error) }

        const program = new Program(idl, programID, provider)

        let transaction = new Transaction().add(
            await program.methods.initialize().accounts({
                signer: wallet.publicKey,
                liveFunds: getFundListAddress(),
                systemProgram: web3.SystemProgram.programId
            }).instruction()
        );

        let signature = await wallet.sendTransaction(transaction, connection);

        notify({ type: 'info', message: 'initializing', txid: signature });

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        notify({ type: 'success', message: 'initialized', txid: signature });

    }, [wallet, connection]);

    return (

        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>Initialize</span>
        </button>
    );
};

