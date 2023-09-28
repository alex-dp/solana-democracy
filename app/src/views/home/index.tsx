import { ProgramCard } from 'components/ProgramCard';
import { clearAll } from 'types/types';

export const HomeView = () => {

  clearAll()

  return (
    <div className='md:hero mx-auto p-4'>
      <div className="md:hero-content flex flex-col">

        {/* <p className="mx-auto">
          <img src="token.svg" className='h-16' />
        </p> */}

        <p className="py-4 mx-auto">
          <img src="argontype.svg" className='h-8' />
        </p>
        <h4 className="md:w-full text-2xl md:text-4xl text-center text-slate-300 mb-2">
          <p>Community-funded open source tools for direct democracy on Solana</p>
        </h4>

        <div className="flex flex-wrap place-content-center">

          <ProgramCard destination="/ubi" title="UBI" description="Universal Basic Income" button="Launch" disabled={false} />
          <ProgramCard destination="/petitions" title="Petitions" description="Global petitions now available" button="Explore" disabled={false} />
          <ProgramCard destination="/referenda" title="Referenda" description="Approve or reject a proposal" button="Coming Soon" disabled={true} />
          <ProgramCard destination="/fundraisers" title="Fundraisers" description="For public goods and services" button="Raise + Donate" disabled={false} />
          <ProgramCard destination="/elections" title="Elections" description="Community-funded verifiable elections" button="Coming Soon" disabled={true} />
        </div>
      </div>
    </div>
  );
};
