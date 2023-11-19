import Link from "next/link";
import { Initialize } from "components/fundraisers/Initialize";
import { MakeFund } from "components/fundraisers/MakeFund";
import useFundraiserStore from "stores/useFundraiserStore";
import { useEffect } from "react";
import { Connection } from "@solana/web3.js";
import FundListItem from "components/fundraisers/FundListItem";

export const FundraisersView = () => {

  const connection = new Connection("https://api.devnet.solana.com")

  const { getFunds, liveFunds, getIdList, idList } = useFundraiserStore();

  useEffect(() => {
    if (!idList) getIdList(connection)
    if (idList && idList.funds.length != liveFunds.length) {
      getFunds(connection, idList.funds)
    }
  }, [idList, liveFunds])

  return (
    <div className='w-screen min-h-screen apply-gradient'>
      <div className="flex flex-row gap-4 w-fit mx-auto my-4">
        <Link href={`/`}>
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
              <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
            </svg>
          </button>
        </Link>

        <MakeFund />
      </div>

      <div className="flex flex-col gap-4 w-fit mx-auto">
        {
          liveFunds?.map((v, i) => <FundListItem fund={v} key={i} fundID={idList.funds[i]} />)
        }
      </div>

      <Initialize />
    </div>
  );
};
