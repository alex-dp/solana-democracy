import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React from "react";
import NavElement from './nav-element';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: FC = () => {

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-20 flex-row shadow-lg bg-black text-neutral-content border-b border-zinc-600 bg-opacity-66">
        <div className="navbar-start">
          <div className="hidden md:inline md:p-2 my-auto ml-4">
            <Link href="/">
              <img src="/argontype.svg" className='h-6' />
            </Link>
          </div>
          <div className='md:hidden'>
            <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex text-lg" />
          </div>
        </div>

        {/* Nav Links */}
        {/* Wallet & Settings */}
        <div className="navbar-center">
          <div className="hidden md:inline-flex place-items-center justify-items gap-6 max-w-full">
            <div className='flex flex-row gap-6 my-auto bg-black p-4 max-w-2/3 rounded-full overflow-auto'>
              <NavElement
                label="Home"
                href="/"
              />

              <NavElement
                label="UBI"
                href="/ubi"
              />

              <NavElement
                label="Mirrors"
                href="/mirrors"
              />
            </div>
          </div>
        </div>

        <div className='navbar-end'>
          <div className='hidden md:inline'>
            <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6" />
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
