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
      <div className='w-screen min-h-screen apply-gradient'>
        <div className="flex flex-col">
  
          {/* 
          AddUserPref, DestroyFund, Donate, MintInfo, AddPartition


          list: PartitionListItem + completed

          markup for info
          */}
        </div>
      </div>
    );
  };
  