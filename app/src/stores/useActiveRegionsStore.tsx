import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { ActiveRegionsLayout, Expirable, expired, getWithSeeds, PETITION_PROGRAM, Programs, RawActiveRegions, RawState, setWithSeeds, StateLayout } from 'types/types';

const programID = new PublicKey(PETITION_PROGRAM);

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
        let regionList: Expirable<RawActiveRegions> = getWithSeeds(Programs.Petitions, ["r"])

        if (!regionList || expired(regionList)) {
            let pda = PublicKey.findProgramAddressSync(
                [Buffer.from("r")],
                programID
            )

            let acc = await connection.getAccountInfo(pda[0])
            regionList = new Expirable<RawActiveRegions>(Date.now() + 30 * 60 * 1000, ActiveRegionsLayout.decode(acc.data))

            setWithSeeds(Programs.Petitions, ["r"], regionList)
        }

        set((s) => {
            s.regionList = regionList.object
        })
    },
    getRegStates: async (connection, list) => {

        let regStates: RawState[] = getWithSeeds(Programs.Petitions, ["regstates"])

        if (!regStates || regStates.length != list.list.length) {
            let regbuf = Buffer.alloc(1)

            let adds = list.list.map((e) => {
                regbuf.writeUInt8(e)
                return PublicKey.findProgramAddressSync(
                    [Buffer.from("d"), regbuf],
                    programID
                )[0]
            })

            let accs = await connection.getMultipleAccountsInfo(adds)
            regStates = accs.map((e) => StateLayout.decode(e.data))

            setWithSeeds(Programs.Petitions, ["regstates"], regStates)
        }
        set((s) => {
            s.regStates = regStates
        })
    }
}));

export default useActiveRegionsStore;