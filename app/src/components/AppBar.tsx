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

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-20 flex-row md:mb-2 bg-transparent text-neutral-content">
        <div className="navbar-start align-items-center">
          <div className="hidden sm:inline w-22 h-22 md:p-2 ml-4">
            <Link href="https://argonsuite.org">
              <div className='flex flex-row place-content-center'>
                {/* <img src="/token.svg" className='h-12' /> */}
                <div className="mx-auto">
                  <Spline style={{ margin: -120 }} scene="https://prod.spline.design/4I6X2r7IWIX3Ep0R/scene.splinecode" />
                </div>
                <img src="/argontype.svg" className='h-6 mx-8 my-auto' />
              </div>
            </Link>
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
                navigationStarts={() => setIsNavOpen(false)}
              />
              <NavElement
                label="UBI"
                href="/ubi"
                navigationStarts={() => setIsNavOpen(false)}
              />
              <NavElement
                label="Petitions"
                href="/petitions"
                navigationStarts={() => setIsNavOpen(false)}
              />
            </div>
            <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6 " />
          </div>
          <label
            htmlFor="my-drawer"
            className="btn-gh items-center justify-between md:hidden mr-5"
            onClick={() => setIsNavOpen(!isNavOpen)}>
            <div className="HAMBURGER-ICON space-y-2.5 ml-5">
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
              <div className={`h-0.5 w-8 bg-purple-600 ${isNavOpen ? 'hidden' : ''}`} />
            </div>
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`}
              style={{ transform: "rotate(45deg)" }}>
            </div>
            <div className={`absolute block h-0.5 w-8 animate-pulse bg-purple-600 ${isNavOpen ? "" : "hidden"}`}
              style={{ transform: "rotate(135deg)" }}>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
