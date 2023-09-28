import Link from "next/link";
import { Initialize } from "components/fundraisers/Initialize";
import { MakeFund } from "components/fundraisers/MakeFund";

export const FundraisersView = () => {

  return (
    <div className='md:hero mx-auto p-4'>
      <div className="md:hero-content flex flex-col">
        <Link href={`/`}>
          <button className="btn btn-square mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
              <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
            </svg>
          </button>
        </Link>

        <Initialize/>

        <MakeFund/>

        {/* 
        build MakeFund button component to call function
        
        list of funds: build useFundStore and use it to get accounts.

        build FundListItem component
        */}
      </div>
    </div>
  );
};
