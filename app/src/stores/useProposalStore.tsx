import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { PropLayout, RawProp, RawState, StateLayout } from 'types/types';

const programID = new PublicKey("E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8");

interface ProposalStore extends State {
    liveProps: RawProp[];
    closedProps: RawProp[];
    state: RawState;
    getState: (connection: Connection, region: number) => void;
    getLiveProps: (connection: Connection, state: RawState) => void;
    getClosedProps: (connection: Connection, state: RawState) => void;
}

const useProposalStore = create<ProposalStore>((set, _get) => ({
    liveProps: [],
    closedProps: [],
    state: null,
    getState: async (connection, region) => {
        try {
            let regbuf = Buffer.alloc(1)
            regbuf.writeUInt8(region)

            let pda = PublicKey.findProgramAddressSync(
                [Buffer.from("d"), regbuf],
                programID
            )

            let acc = await connection.getAccountInfo(pda[0])
            set((s) => {
                s.state = StateLayout.decode(acc.data)
            })
        } catch (error) { console.log(error) }
    },
    //TODO paging!!!!!!!!!!!!!
    getLiveProps: async (connection, state) => {
        let idbuf = Buffer.alloc(4)
        let regbuf = Buffer.alloc(1)

        let adds = state.liveProps.reverse().map((e) => {   //reverse: most recent first
            idbuf.writeUInt32BE(e)
            regbuf.writeUInt8(state.region)
            return PublicKey.findProgramAddressSync(
                [Buffer.from("p"), regbuf, idbuf],
                programID
            )[0]
        })

        let accs = await connection.getMultipleAccountsInfo(adds)
        set((s) => {
            s.liveProps = accs.map((e) => PropLayout.decode(e.data))
        })
    },
    getClosedProps: async (connection, state) => {      //reverse: most recent first
        let idbuf = Buffer.alloc(4)
        let regbuf = Buffer.alloc(1)

        let adds = state.closedProps.reverse().map((e) => {
            idbuf.writeInt32BE(e)
            regbuf.writeUInt8(state.region)
            return PublicKey.findProgramAddressSync(
                [Buffer.from("p"), regbuf, idbuf],
                programID
            )[0]
        })

        let accs = await connection.getMultipleAccountsInfo(adds)
        set((s) => {
            s.closedProps = accs.map((e) => PropLayout.decode(e.data))
        })
    }
}));

export default useProposalStore;