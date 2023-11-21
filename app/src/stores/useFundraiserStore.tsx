import { create } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { RawFund, FundLayout, FUNDRAISER_PROGRAM, FundListLayout, RawFundList, RawPartition, PartitionLayout } from 'types/types';
import { getFundAddress, getFundListAddress, getPartitionAddress } from 'utils/fundraisers';
import { Idl } from '@coral-xyz/anchor';

const programID = new PublicKey(FUNDRAISER_PROGRAM);

interface ProposalStore {
    idList: RawFundList
    liveFunds: RawFund[]
    partitions: Map<number, RawPartition[]>
    getIdList: (connection: Connection) => void
    getFunds: (connection: Connection, list: number[]) => void
    getPartitions: (connection: Connection, ids: number[], list: RawFund[]) => void

}

const useProposalStore = create<ProposalStore>((set, _get) => ({
    idList: null,
    liveFunds: [],
    partitions: new Map<number, RawPartition[]>(),
    getIdList: async (connection) => {
        let pda = getFundListAddress()

        let acc = await connection.getAccountInfo(pda)

        if (acc) {
            set({
                idList: FundListLayout.decode(acc.data)
            })
        }
    },
    getFunds: async (connection, list) => {
        let adds = list.map((e) => {
            return getFundAddress(e)
        })

        connection.getMultipleAccountsInfo(adds).then((accs) => {
            set({
                liveFunds: accs.map((e) => FundLayout.decode(e.data))
            })
        })
    },
    getPartitions: async (connection, ids, list) => {
        let structure = new Map<number, RawPartition[]>()
        let pairs: number[][] = []

        list.forEach((v, i) => {
            v.partitions.forEach((u) => {
                pairs[pairs.length] = [ids[i], u]
            })
        })

        let adds = pairs.map((pair) => getPartitionAddress(pair[0], pair[1]))

        connection.getMultipleAccountsInfo(adds).then((accs) => {

            accs.map((e) => PartitionLayout.decode(e.data)).forEach((v: RawPartition, i) => {

                let fund_id = pairs[i][0]

                if (structure.has(fund_id)) {
                    let newList = structure.get(fund_id)
                    newList.push(v)
                    structure.set(fund_id, newList)
                } else {
                    structure.set(fund_id, [v])
                }

            })

            set({
                partitions: structure
            })
        })
    },
}));

export default useProposalStore;