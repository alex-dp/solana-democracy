import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { getWithSeeds, PETITION_PROGRAM, Programs, PropLayout, RawProp, setWithSeeds } from 'types/types';

const programID = new PublicKey(PETITION_PROGRAM);

interface SingleProposalStore extends State {
    proposal: RawProp;
    getProposal: (connection: Connection, region: number, id: number) => void;
}

const useSingleProposalStore = create<SingleProposalStore>((set, _get) => ({
    proposal: null,
    getProposal: async (connection, region, id) => {
        let prop: RawProp = getWithSeeds(Programs.Petitions, ["p", region, id])

        if (!prop) {
            let idbuf = Buffer.alloc(4)
            let regbuf = Buffer.alloc(1)

            idbuf.writeUInt32BE(id)
            regbuf.writeUInt8(region)

            let addr = PublicKey.findProgramAddressSync([Buffer.from("p"), regbuf, idbuf], programID)[0]

            let acc = await connection.getAccountInfo(addr)
            prop = PropLayout.decode(acc.data)

            setWithSeeds(Programs.Petitions, ["p", region, id], prop)
        }

        set((s) => {
            s.proposal = prop
        })
    }
}));

export default useSingleProposalStore;