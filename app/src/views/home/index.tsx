import Spline from '@splinetool/react-spline';
import { ProgramCard } from 'components/ProgramCard';
import { Ref, useEffect, useRef } from 'react';
import { clearAll } from 'types/types';

export const HomeView = () => {

  clearAll()

  return (
    <div className='md:hero mx-auto p-4'>
      <link rel="me" href="https://mastodon.social/@alexdp" />
      <link rel="me" href="https://kolektiva.social/@alexdp" />

      <div className="md:hero-content flex flex-col" role='main'>

        <div className="mx-auto">
          <Spline style={{ margin: -120 }} scene="https://prod.spline.design/4I6X2r7IWIX3Ep0R/scene.splinecode" />
        </div>

        <h1 className='hidden'>argon</h1>
        <h2 className='hidden'>libre tools for direct democracy on solana</h2>
        <h3 className='hidden'>see what programs are available below or connect your wallet from the top right corner</h3>

        <p className="py-4 mx-auto">
          <img src="argontype.svg" className='h-8' />
        </p>

        <h4 className="md:w-full text-2xl md:text-4xl text-center text-slate-300 mb-2">
          <p>Libre tools for direct democracy on Solana</p>
        </h4>

        <div className="flex flex-wrap place-content-center">

          <ProgramCard destination="/ubi" title="UBI" description="Universal Basic Income" button="Launch" disabled={false} />
          <ProgramCard destination="/petitions" title="Petitions" description="Global petitions now available" button="Explore" disabled={false} />
          <ProgramCard destination="/referenda" title="Referenda" description="Approve or reject a proposal" button="Coming Soon" disabled={true} />
          <ProgramCard destination="/fundraisers" title="Fundraisers" description="For public goods and services" button="Coming Soon" disabled={true} />
          <ProgramCard destination="/elections" title="Chair Elections" description="Fill a seat by asking voters to rank candidates" button="Coming Soon" disabled={true} />
          <ProgramCard destination="/census" title="Census Tools" description="Measure preference by sorting or on a scale" button="Coming Soon" disabled={true} />
          <ProgramCard destination="/selections" title="Council Selections" description="Randomly sample a council" button="Coming Soon" disabled={true} />
        </div>
      </div>
    </div>
  );
};
