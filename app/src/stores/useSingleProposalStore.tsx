import { create } from 'zustand'
import { Connection } from '@solana/web3.js'
import { getWithSeeds, Programs, PropLayout, RawProp, setWithSeeds } from 'types/types';
import { getPropAddress } from 'utils/petitions';

interface SingleProposalStore {
    proposal: RawProp;
    getProposal: (connection: Connection, region: number, id: number) => void;
}

const useSingleProposalStore = create<SingleProposalStore>((set, _get) => ({
    proposal: null,
    getProposal: async (connection, region, id) => {
        let prop: RawProp = getWithSeeds(Programs.Petitions, ["p", region, id])

        if (!prop) {
            let addr = getPropAddress(region, id)

            let acc = await connection.getAccountInfo(addr)
            prop = PropLayout.decode(acc.data)

            setWithSeeds(Programs.Petitions, ["p", region, id], prop)
        }

        set({
            proposal: prop
        })
    }
}));

export default useSingleProposalStore;