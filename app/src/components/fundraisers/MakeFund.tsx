import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js';
import { FormEvent, useCallback } from 'react';

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

    let addFund = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let i = 0

        while(e.target[i]){
            console.log(e.target[i].value)
            i++
        }

    }, [])

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

        <div>
            <label htmlFor="my-modal-4" className="btn btn-active mx-auto border-2 border-purple-700 m-2">
                Start a new fund
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48">
                    <path d="M22.5 36.3h3v-6.45H32v-3h-6.5v-6.5h-3v6.5H16v3h6.5ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
                </svg>
            </label>

            <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" />

            <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
                <label className="modal-box text-center rounded-xl w-2xl h-fit border-2 border-purple-600" htmlFor="">
                    <h3 className="text-lg font-bold text-center mb-4">Make a fund</h3>

                    <form onSubmit={addFund} className="flex flex-col gap-4">
                        <input type="text" placeholder="Name of the fund" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input type="text" placeholder="Receivable mint address" className="input input-bordered w-full max-w-xs mx-auto" />

                        <div className="form-control">
                            <label className="label cursor-pointer input input-bordered w-full max-w-xs mx-auto">
                                <span className="label-text">Allow others to make partitions</span>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </div>

                        <div className='flex flex-row w-full gap-4 place-content-center place-items-center'>
                            <div className='h-[1px] w-20 bg-white'/>
                            <h3>First partition</h3>
                            <div className='h-[1px] w-20 bg-white'/>
                        </div>

                        <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input type="text" placeholder="Info URL" className="input input-bordered w-full max-w-xs mx-auto" />
                        <input type="text" placeholder="Recipient's public key" className="input input-bordered w-full max-w-xs mx-auto" />

                        <button type="submit" className="btn btn-active btn-primary mx-auto gap-2">
                            submit
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                        </button>
                    </form>
                </label>
            </label>
        </div>
    );
};

