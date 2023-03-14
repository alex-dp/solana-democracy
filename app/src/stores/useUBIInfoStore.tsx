import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { getWithSeeds, Programs, RawUBIInfo, setWithSeeds, UBIInfoLayout, UBI_PROGRAM } from 'types/types';

const programID = new PublicKey(UBI_PROGRAM);

interface UBIInfoStore extends State {
    info: RawUBIInfo;
    initialized: boolean;
    getInfo: (connection: Connection, pk: PublicKey) => void;
}

const useUBIInfoStore = create<UBIInfoStore>((set, _get) => ({
    info: null,
    initialized: true,
    getInfo: async (connection, pk) => {

        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info3"), pk.toBuffer()],
            programID
        )

        let info: RawUBIInfo = getWithSeeds(Programs.UBI, ["ubi_info3", pk.toString()])

        if (!info || Date.now() / 1000 > info?.lastIssuance + 24 * 60 * 60) {
            let acc = await connection.getAccountInfo(pda[0])
            if (acc) info = UBIInfoLayout.decode(acc.data)
        }

        set((s) => {
            if (info) {
                setWithSeeds(Programs.UBI, ["ubi_info3", pk.toString()], info)
                s.info = info
                s.initialized = true
            }
            else s.initialized = false
        })
    },
}));

export default useUBIInfoStore;