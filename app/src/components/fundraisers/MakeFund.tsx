import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { useCallback } from 'react';

import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";

import { useIDL, FUNDRAISER_PROGRAM } from '../../types/types';

import { useWalletModal } from '@solana/wallet-adapter-react-ui';


const programID = new PublicKey(FUNDRAISER_PROGRAM);


export const MakeFund = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const wallet = useWallet();


    const { setVisible } = useWalletModal();


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

    }, [wallet, connection]);

    return (

        <button
            className="px-8 m-2 btn btn-active btn-primary"
            onClick={onClick}
        >
            <span>Start a fund</span>
        </button>
    );
};

