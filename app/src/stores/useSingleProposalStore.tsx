import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { PropLayout, RawProp, RawState, StateLayout } from 'types/types';

const programID = new PublicKey("E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8");

interface SingleProposalStore extends State {
    proposal: RawProp;
    getProposal: (connection: Connection, region: number, id: number) => void;
}

const useSingleProposalStore = create<SingleProposalStore>((set, _get) => ({
    proposal: null,
    getProposal: async (connection, region, id) => {
        let idbuf = Buffer.alloc(4)
        let regbuf = Buffer.alloc(1)

        idbuf.writeUInt32BE(id)
        regbuf.writeUInt8(region)

        let addr = PublicKey.findProgramAddressSync([Buffer.from("p"), regbuf, idbuf], programID)[0]

        let acc = await connection.getAccountInfo(addr)
        set((s) => {
            s.proposal = PropLayout.decode(acc.data)
        })
    }
}));

export default useSingleProposalStore;