import { useEffect } from 'react';

import { InitializeAccount } from 'components/ubi/InitializeAccount';
import { Mint } from 'components/ubi/Mint';
import { Swap } from 'components/ubi/Swap';
import useUBIInfoStore from 'stores/useUBIInfoStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';
import Link from 'next/link';
import { OSS } from 'components/OSS';

export const UBIView = () => {

  const { info, infoAddress, initialized, getInfo } = useUBIInfoStore();

  const wallet = useWallet();

  const connection = new Connection("***REMOVED***")

  useEffect(() => {
    if (!info && initialized) getInfo(connection, wallet.publicKey)
  }, [connection])

  return (

    <div className='md:hero mx-auto p-4'>
      <div className="hero-content flex flex-col place-content-center">

        <img src='cooler-light.svg' className='w-24' />

        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#c53fe9ff] to-blue-600 pb-4">
          Nuclear UBI
        </h1>


        <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
          Global Universal Basic Income secured by Civic
          <div className="tooltip tooltip-bottom" data-tip="Start by initializing your account, then mint some NUBI every day using your Civic pass">
            <button className="btn btn-sm btn-circle btn-outline ml-6">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor" viewBox="0 0 48 48"><path d="M21.2 31.4q.05-4.05.95-5.95.9-1.9 3.1-3.7 2.05-1.7 3.05-3.25t1-3.4q0-2.05-1.375-3.425T24.15 10.3q-2.45 0-3.875 1.375Q18.85 13.05 18.2 14.9l-5.25-2.3q1.25-3.35 4.1-5.575Q19.9 4.8 24.15 4.8q5.25 0 8.1 2.975 2.85 2.975 2.85 7.175 0 2.75-1.05 4.875T30.75 24q-2.4 2.15-2.925 3.425Q27.3 28.7 27.3 31.4Zm2.95 13.4q-1.75 0-2.95-1.225Q20 42.35 20 40.65q0-1.7 1.2-2.925 1.2-1.225 2.95-1.225 1.75 0 2.95 1.225 1.2 1.225 1.2 2.925 0 1.7-1.225 2.925Q25.85 44.8 24.15 44.8Z" /></svg>
            </button>
          </div>
          <OSS />
        </h4>

        <div className="flex flex-wrap place-content-center">

          <Link href={`/`}>
            <button className="btn btn-square m-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
                <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
              </svg>
            </button>
          </Link>

          {
            wallet.connected &&
            <GatewayProvider
              wallet={wallet}
              gatekeeperNetwork={new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")}
              connection={connection}
              options={{ autoShowModal: false }}>

              {!initialized && !info ? <InitializeAccount /> : <Mint info={info} infoAddress={infoAddress} />}

            </GatewayProvider>
          }
          <Swap />

        </div>
      </div>
    </div >

  );
};