import { create } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { ActiveRegionsLayout, clearWithSeeds, Expirable, expired, getWithSeeds, PETITION_PROGRAM, Programs, RawActiveRegions, RawState, setWithSeeds, StateLayout } from 'types/types';
import { getRegListAddress, getStateAddress } from 'utils/petitions';

const programID = new PublicKey(PETITION_PROGRAM);

interface ActiveRegionsStore {
    regionList: RawActiveRegions;
    regStates: RawState[];
    getRegions: (connection: Connection) => void;
    getRegStates: (connection: Connection, list: RawActiveRegions) => void;
    clearRegions: () => void;
}

const useActiveRegionsStore = create<ActiveRegionsStore>((set, _get) => ({
    regionList: null,
    regStates: null,
    getRegions: async (connection) => {
        let regionList: Expirable<RawActiveRegions> = getWithSeeds(Programs.Petitions, ["r"])

        if (!regionList || expired(regionList)) {
            let pda = getRegListAddress()

            let acc = await connection.getAccountInfo(pda)

            if (acc) {
                regionList = new Expirable<RawActiveRegions>(Date.now() + 30 * 60 * 1000, ActiveRegionsLayout.decode(acc.data))
                setWithSeeds(Programs.Petitions, ["r"], regionList)
            }
        }

        if (regionList) {
            set({
                regionList: regionList.object
            })
        }
    },
    getRegStates: async (connection, list) => {

        let regStates: RawState[] = getWithSeeds(Programs.Petitions, ["regstates"])

        if (!regStates || regStates.length != list.list.length) {

            let adds = list.list.map((e) => {
                return getStateAddress(e)
            })

            let accs = await connection.getMultipleAccountsInfo(adds)
            regStates = accs.map((e) => StateLayout.decode(e.data))

            setWithSeeds(Programs.Petitions, ["regstates"], regStates)
        }

        if (regStates) {
            set({
                regStates: regStates
            })
        }
    },
    clearRegions: () => {
        clearWithSeeds(Programs.Petitions, ["r"])
        clearWithSeeds(Programs.Petitions, ["regstates"])
    }
}));

export default useActiveRegionsStore;