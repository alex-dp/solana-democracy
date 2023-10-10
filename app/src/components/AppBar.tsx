import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NavElement from './nav-element';
import Spline from '@splinetool/react-spline';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {
  const { setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);

  setAutoConnect(true)

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-20 flex-row md:mb-2 shadow-lg bg-black text-neutral-content border-b border-zinc-600 bg-opacity-66">
        <div className="navbar-start align-items-center">
          <div className="hidden md:inline w-22 h-22 md:p-2 ml-10">
            <Link href="https://argonsuite.org">
              <div className='flex flex-row place-content-center'>
                <div className="mx-auto">
                  <Spline style={{ margin: -120 }} scene="https://prod.spline.design/4I6X2r7IWIX3Ep0R/scene.splinecode" />
                </div>
                <img src="/argontype.svg" className='h-6 mx-8 my-auto' />
              </div>
            </Link>
          </div>
          <div className='w-fit h-fit md:hidden'>
            <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex text-lg " />
          </div>
        </div>

        {/* Nav Links */}
        {/* Wallet & Settings */}
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
            <div className='flex flex-row gap-6 w-fit my-auto'>
              <NavElement
                label="Home"
                href="/"
              />
              <NavElement
                label="UBI"
                href="/ubi"
              />
              <NavElement
                label="Petitions"
                href="/petitions"
              />

              <NavElement
                label="Mirrors"
                href="/mirrors"
              />
            </div>
            <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
          </div>
          <label
            htmlFor="my-drawer"
            className="btn btn-square p-4 border-0 btn-lg bg-transparent mx-4 md:hidden">


            <div className="space-y-2.5">
              <div className={`h-0.5 w-8 bg-white`} />
              <div className={`h-0.5 w-8 bg-white`} />
              <div className={`h-0.5 w-8 bg-white`} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
