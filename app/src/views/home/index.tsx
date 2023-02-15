// Next, React
import { FC, useEffect } from 'react';

import Link from 'next/link';

export const HomeView: FC = ({ }) => {

  return (

    // <div className="md:hero mx-auto p-4">
    <div className='md:hero mx-auto p-4'>
      <div className="md:hero-content flex flex-col">

        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600 py-8">
          Solana Democracy Suite
        </h1>
        <h4 className="md:w-full text-2xl md:text-4xl text-center text-slate-300 my-2">
          <p>Community-funded tools for sociopolitical purposes</p>
          <p className='text-slate-500 text-2xl leading-relaxed'>You are using verifiable Free (Libre) open source software</p>
        </h4>

        <div className="flex flex-wrap place-content-center">


          <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">UBI</h2>
              <p>Universal Basic Income</p>
              <Link href="/ubi">
                <div className="card-actions justify-end">
                  <button className="btn gap-2">

                    Launch
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>

                  </button>
                </div>
              </Link>
            </div>
          </div>

          <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Petitions</h2>
              <p>Global petitions now available</p>
              <Link href="/petitions">
                <div className="card-actions justify-end">
                  <button className="btn gap-2">
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                  </button>
                </div>
              </Link>
            </div>
          </div>

          <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Referenda</h2>
              <p>Approve or reject a proposal</p>
              <div className="card-actions justify-end">
                <button className="btn gap-2">
                  Coming soon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Fundraisers</h2>
              <p>For public goods and services</p>
              <div className="card-actions justify-end">
                <button className="btn gap-2">
                  Coming soon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card rounded-2xl border-2 border-purple-500 w-72 m-6 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Elections</h2>
              <p>Community-funded verifiable elections</p>
              <div className="card-actions justify-end">
                <button className="btn gap-2">
                  Coming soon
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
