import Spline from '@splinetool/react-spline';
import { ProgramCard } from 'components/ProgramCard';
import { Ref, useEffect, useRef } from 'react';
import { FUNDRAISER_PROGRAM, PETITION_PROGRAM, UBI_PROGRAM, clearAll } from 'types/types';

export const HomeView = () => {

  clearAll()

  return (
    <div className='w-screen min-h-screen p-4 apply-gradient'>
      <link rel="me" href="https://mastodon.social/@alexdp" />
      <link rel="me" href="https://kolektiva.social/@alexdp" />

      <div className="flex flex-col" role='main'>

        <div className="mx-auto">
          <Spline style={{
            margin: -120,
            pointerEvents: "none",
          }} scene="https://prod.spline.design/4I6X2r7IWIX3Ep0R/scene.splinecode" />
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

        <div className="flex flex-wrap place-content-center lg:px-32 xl:px-40 lg:px-32 xl:px-40">

          <ProgramCard destination="/ubi" title="UBI" description="Universal Basic Income" disabled={false} pid={UBI_PROGRAM}/>
          <ProgramCard destination="/petitions" title="Petitions" description="with legacy gating" disabled={false} pid={PETITION_PROGRAM}/>
          <ProgramCard destination="/fundraisers" title="Fundraisers" description="For public goods and services" disabled={false} pid={FUNDRAISER_PROGRAM}/>
          <ProgramCard destination="/trust" title="Trust Networks" description="Argon's gating layer" disabled={true} />
          <ProgramCard destination="/referenda" title="Referenda" description="Approve or reject a proposal" disabled={true} />
          <ProgramCard destination="/elections" title="Chair Elections" description="Fill a seat by asking voters to rank candidates" disabled={true} />
          <ProgramCard destination="/census" title="Census Tools" description="Measure preference by sorting or on a scale" disabled={true} />
          <ProgramCard destination="/sampling" title="Council Sampling" description="Sample a council randomly or by preference" disabled={true} />
          <ProgramCard destination="/funds" title="Democratic Fund Management" description="Allocate salary by consensus" disabled={true} />
        </div>
      </div>
    </div>
  );
};
