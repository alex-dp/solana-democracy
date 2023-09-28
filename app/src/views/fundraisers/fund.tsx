import { PublicKey } from "@solana/web3.js";

type ViewProps = {
    creator: PublicKey,
    mint_addr: PublicKey,
    locked: boolean,
    private: boolean,
    equal: boolean,
    next_partition: number,
    points_per_user: number,
    partitions: number[],
    points: number[],
    completed: number[],
    information: String,
}

export const FundView = ({}: ViewProps) => {

    return (
      <div className='md:hero mx-auto p-4'>
        <div className="md:hero-content flex flex-col">
  
          {/* 
          AddUserPref, DestroyFund, Donate, MintInfo, AddPartition


          list: PartitionListItem + completed

          markup for info
          */}
        </div>
      </div>
    );
  };
  