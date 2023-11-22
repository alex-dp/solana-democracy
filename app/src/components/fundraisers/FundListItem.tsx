import Link from "next/link";
import { RawFund, RawPartition } from "types/types";
import { AddPartition } from "./AddPartition";
import { Donate } from "./Donate";
import { useWallet } from "@solana/wallet-adapter-react";
import { getDistributionAddress, getFundAddress } from "utils/fundraisers";

type RowProps = {
    fund: RawFund,
    fundID: number,
    partitions: RawPartition[]
}

const FundListItem = (props: RowProps) => {

    let fund = props.fund

    const { wallet } = useWallet();

    return (
        <div className="flex flex-row gap-4 w-fit">
            {fund.locked && "locked"}
            <div className="uppercase font-bold my-auto">{fund.name}</div>

            <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="btn btn-ghost">
                    <div className="uppercase my-auto">{fund.partitions.length} recipient{fund.partitions.length != 1 && "s"}</div>
                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-360 280-560h400L480-360Z" /></svg>

                </label>
                <ul className="menu dropdown-content z-[1] bg-black rounded-lg border-2 border-purple-700 overflow-hidden">
                    {props.partitions?.map((v, i) => {
                        return (
                            <li key={i} className="">
                                <a href={v.information.toString()}>
                                    {v.name} (
                                        {v.recipient_owner.toString().substring(0, 4)}
                                        ...
                                        {v.recipient_owner.toString().substring(40, 44)}
                                        )
                                </a>
                            </li>
                        )
                    })}
                    <li>fund {getFundAddress(props.fundID).toString()}</li>
                    <li>distr {getDistributionAddress(props.fundID).toString()}</li>
                </ul>
            </div>
            {(!fund.private || (wallet.adapter.connected && wallet.adapter.publicKey == fund.creator)) && <AddPartition fundID={props.fundID} fund={fund} />}
            <Donate fundID={props.fundID} fund={fund} partitions={props.partitions} />
            <Link href={new URL(fund.information.toString())}>
                <button className="btn gap-2 btn-sm my-2 btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                    </svg>
                </button>
            </Link>

        </div>
    );
};

export default FundListItem;

