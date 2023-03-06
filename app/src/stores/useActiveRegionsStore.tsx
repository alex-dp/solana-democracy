import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { ActiveRegionsLayout, RawActiveRegions, RawState, StateLayout } from 'types/types';

const programID = new PublicKey("E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8");

interface ActiveRegionsStore extends State {
    regionList: RawActiveRegions;
    regStates: RawState[];
    getRegions: (connection: Connection) => void;
    getRegStates: (connection: Connection, list: RawActiveRegions) => void;
}

const useActiveRegionsStore = create<ActiveRegionsStore>((set, _get) => ({
    regionList: null,
    regStates: null,
    getRegions: async (connection) => {
        try {
            let pda = PublicKey.findProgramAddressSync(
                [Buffer.from("r")],
                programID
            )

            let acc = await connection.getAccountInfo(pda[0])
            set((s) => {
                s.regionList = ActiveRegionsLayout.decode(acc.data)
            })
        } catch (error) { console.log(error) }
    },
    getRegStates: async (connection, list) => {
        let regbuf = Buffer.alloc(1)

        let adds = list.list.map((e) => {
            regbuf.writeUInt8(e)
            return PublicKey.findProgramAddressSync(
                [Buffer.from("d"), regbuf],
                programID
            )[0]
        })

        let accs = await connection.getMultipleAccountsInfo(adds)
        set((s) => {
            s.regStates = accs.map((e) => StateLayout.decode(e.data))
        })
    }
}));

export default useActiveRegionsStore;