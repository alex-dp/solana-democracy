import { create } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { RawFund, FundLayout, FUNDRAISER_PROGRAM, FundListLayout, RawFundList } from 'types/types';
import { getFundAddress, getFundListAddress } from 'utils/fundraisers';

const programID = new PublicKey(FUNDRAISER_PROGRAM);

interface ProposalStore {
    idList: RawFundList
    liveFunds: RawFund[];
    getIdList: (connection: Connection) => void;
    getFunds: (connection: Connection, list: number[]) => void;
}

const useProposalStore = create<ProposalStore>((set, _get) => ({
    idList: null,
    liveFunds: [],
    getIdList: async (connection) => {
        let pda = getFundListAddress()

        let acc = await connection.getAccountInfo(pda)

        if(acc) {
            set({
                idList: FundListLayout.decode(acc.data)
            })
        }
    },
    getFunds: async (connection, list) => {
        let adds = list.reverse().map((e) => {   //reverse: most recent first
            return getFundAddress(e)
        })

        connection.getMultipleAccountsInfo(adds).then((accs) => {
            set({
                liveFunds: accs.map((e) => FundLayout.decode(e.data))
            })
        })
    },
}));

export default useProposalStore;