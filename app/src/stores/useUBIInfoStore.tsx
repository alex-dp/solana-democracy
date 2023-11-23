import { create } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { getWithSeeds, Programs, RawUBIInfo, setWithSeeds, UBIInfoLayout, clearWithSeeds, RawUBIState, UBIStateLayout, UBI_MINT } from 'types/types';
import { getUbiInfoAddress, getUbiStateAddress } from 'utils/ubi';

interface UBIInfoStore {
    info: RawUBIInfo;
    state: RawUBIState;
    supply: number;
    initialized: boolean;
    getInfo: (connection: Connection, pk: PublicKey) => void;
    getState: (connection: Connection) => void;
    getSupply: (connection: Connection) => void;
    clearInfo: (pk: PublicKey) => void;
}

const useUBIInfoStore = create<UBIInfoStore>((set, _get) => ({
    info: null,
    state: null,
    supply: null,
    initialized: true,
    getInfo: async (connection, pk) => {

        let pda = getUbiInfoAddress(pk)

        let info: RawUBIInfo = getWithSeeds(Programs.UBI, ["ubi_info3", pk.toString()])

        if (!info || Date.now() / 1000 > info?.lastIssuance + 24 * 60 * 60) {
            let acc = await connection.getAccountInfo(pda)
            if (acc) info = UBIInfoLayout.decode(acc.data)
        } else if (info) {
            setWithSeeds(Programs.UBI, ["ubi_info3", pk.toString()], info)
        }

        let data = info ? {
            info: info,
            initialized: true
        } : { initialized: false }

        set(data)
    },
    getState: async (connection) => {
        let pda = getUbiStateAddress()

        let acc = await connection.getAccountInfo(pda)
        if (acc) {
            let state = UBIStateLayout.decode(acc.data)
            set({
                state: state
            })
        }
    },
    getSupply: async (connection) => {
        let supp = await connection.getTokenSupply(new PublicKey(UBI_MINT))
        set({
            supply: Math.round(supp.value.uiAmount)
        })
    },
    clearInfo: (pk) => {
        clearWithSeeds(Programs.UBI, ["ubi_info3", pk.toString()])
    }
}));

export default useUBIInfoStore;