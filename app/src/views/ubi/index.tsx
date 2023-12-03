import { useEffect, useState } from 'react';

import { InitializeAccount } from 'components/ubi/InitializeAccount';
import { Mint } from 'components/ubi/Mint';
import { Swap } from 'components/ubi/Swap';
import useUBIInfoStore from 'stores/useUBIInfoStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';
import Link from 'next/link';
import { InfoCard } from 'components/ubi/InfoCard';
import { findIssuance } from 'utils/ubi';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { UBI_PROGRAM, useIDL } from 'types/types';
import { getProvider } from 'utils';

export const UBIView = () => {

    const { info, initialized, getInfo, state, getState, supply, getSupply } = useUBIInfoStore();

    const wallet = useWallet();

    const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT)

    const programID = new PublicKey(UBI_PROGRAM)

    let provider: AnchorProvider = null

    try {
        provider = getProvider(connection, wallet)
    } catch (error) { console.log(error) }

    let [program, setProgram] = useState<Program>()
    
    let run = async () => {
        await useIDL(programID, provider).then((idl) => {
            setProgram(new Program(idl, programID, provider))
        })
    }

    useEffect(()=>{run()}, [])

    useEffect(() => {wallet.connected && !info && initialized && getInfo(connection, wallet.publicKey)}, [wallet.connected])
    useEffect(() => {!state && getState(connection)})
    useEffect(() => {!supply && getSupply(connection)})

    return (

        <div className='apply-gradient min-h-screen w-screen place-content-evenly'>
            <div className="flex flex-col mx-auto">

                <p className="pt-8 pb-4 mx-auto">
                    <img src='argonubi.svg' className='h-16' />
                </p>


                <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
                    Global unconditional income secured by Civic
                </h4>

                <div className="flex flex-row place-content-center">

                    <Link href={`/`}>
                        <button className="btn btn-square m-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
                                <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
                            </svg>
                        </button>
                    </Link>

                    <GatewayProvider
                        wallet={wallet}
                        gatekeeperNetwork={new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")}
                        connection={connection}
                        options={{ autoShowModal: false }}>

                        {!initialized && !info ? <InitializeAccount /> : <Mint ubiInfo={info} connection={connection} program={program} />}

                    </GatewayProvider>

                    <Swap />

                </div>

                <div className='mx-auto mt-4'>
                    <InfoCard supply={supply ? supply : 0} issuance={state ? findIssuance(state.capLeft) : 0} />
                </div>
            </div>
        </div >

    );
};