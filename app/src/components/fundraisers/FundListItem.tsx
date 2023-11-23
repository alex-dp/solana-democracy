import Link from "next/link";
import { RawFund, RawPartition } from "types/types";
import { AddPartition } from "./AddPartition";
import { Donate } from "./Donate";
import { useWallet } from "@solana/wallet-adapter-react";
import { DestroyFund } from "./DestroyFund";
import { DestroyPartition } from "./DestroyPartition";
import { Program } from "@coral-xyz/anchor";
import { Connection, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getMintName } from "utils";

type RowProps = {
    fund: RawFund,
    fundID: number,
    partitions: RawPartition[],
    program: Program,
    connection: Connection
}

const FundListItem = (props: RowProps) => {

    let fund = props.fund

    const wallet = useWallet();

    let [decimals, setDecimals] = useState<number>()

    useEffect(() => {

        let run = async () => {
            let mai = await props.connection.getParsedAccountInfo(props.fund.mint_addr)

            let mintInfo = (mai.value.data as ParsedAccountData).parsed.info

            setDecimals(mintInfo.decimals)
        }

        run()

    })

    return (
        <div className="flex flex-row w-full place-content-between gap-4">

            <div className="my-auto flex flex-col">
                <div className="uppercase font-bold whitespace-nowrap">{fund.name}</div>
                <div className="text-xs whitespace-nowrap">Mint: {getMintName(fund.mint_addr)}</div>
            </div>


            <div className="flex flex-row w-min gap-4">
                <div className="dropdown dropdown-hover min-w-fit">
                    <label tabIndex={0} className="btn btn-ghost">
                        <div className="uppercase my-auto">{fund.partitions.length} recipient{fund.partitions.length != 1 && "s"}</div>
                        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-360 280-560h400L480-360Z" /></svg>

                    </label>
                    <div className="flex flex-col gap-2 dropdown-content z-[1] bg-black rounded-lg border-2 border-purple-700 p-2">
                        {props.partitions?.map((v, i) => {
                            return (
                                <div key={i} className="flex flex-row place-content-between gap-6">
                                    <div>
                                        <div className="whitespace-nowrap my-auto">
                                            {v.name} (
                                            {v.recipient_owner.toString().substring(0, 4)}
                                            ...
                                            {v.recipient_owner.toString().substring(40, 44)}
                                            )
                                        </div>
                                        <div className="whitespace-nowrap text-xs uppercase">
                                            collected: {(v.amount_received * 10 ** - decimals).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <Link href={new URL(v.information.toString())} className="tooltip mr-2" data-tip="Official info">
                                            <button className="btn btn-sm my-2 btn-square">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                                                </svg>
                                            </button>
                                        </Link>

                                        {wallet.connected && (fund.creator.equals(wallet.publicKey) || v.creator.equals(wallet.publicKey))
                                            && <DestroyPartition partitionID={fund.partitions[i]} {...props} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {(!fund.private || (wallet.connected && wallet.publicKey.equals(fund.creator)))
                    && <AddPartition {...props} />}
                <Donate decimals={decimals} {...props} />
                <Link href={new URL(fund.information.toString())} className="tooltip" data-tip="Official info">
                    <button className="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 48 48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
                        </svg>
                    </button>
                </Link>

                {(wallet.connected && props.fund.creator.equals(wallet.publicKey)) && <DestroyFund {...props} />}
            </div>

        </div>
    );
};

export default FundListItem;

