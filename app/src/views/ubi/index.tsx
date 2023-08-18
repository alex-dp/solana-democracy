import { useEffect } from 'react';

import { InitializeAccount } from 'components/ubi/InitializeAccount';
import { Mint } from 'components/ubi/Mint';
import { Swap } from 'components/ubi/Swap';
import useUBIInfoStore from 'stores/useUBIInfoStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { GatewayProvider } from '@civic/solana-gateway-react';
import Link from 'next/link';

export const UBIView = () => {

  const { info, initialized, getInfo } = useUBIInfoStore();

  const wallet = useWallet();

  const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT)

  useEffect(() => {
    if (wallet.publicKey && !info && initialized) getInfo(connection, wallet.publicKey)
  }, [connection, wallet.connected])

  return (

    <div className='md:hero mx-auto p-4'>
      <div className="hero-content flex flex-col place-content-center">

        <p className="pt-8 pb-4 mx-auto">
          <img src='argonubi.svg' className='h-16' />
        </p>


        <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
          Global unconditional income secured by Civic
        </h4>

        <div className="flex flex-wrap place-content-center">

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

            {!initialized && !info ? <InitializeAccount /> : <Mint info={info} />}

          </GatewayProvider>

          <Swap />

        </div>
      </div>
    </div >

  );
};