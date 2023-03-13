import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { RawUBIInfo, UBIInfoLayout, UBI_PROGRAM } from 'types/types';

const programID = new PublicKey(UBI_PROGRAM);

interface UBIInfoStore extends State {
    info: RawUBIInfo;
    initialized: boolean;
    infoAddress: PublicKey;
    getInfo: (connection: Connection, pk: PublicKey) => void;
}

const useUBIInfoStore = create<UBIInfoStore>((set, _get) => ({
    info: null,
    infoAddress: null,
    initialized: true,
    getInfo: async (connection, pk) => {
        let pda = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info3"), pk.toBuffer()],
            programID
        )

        let acc = await connection.getAccountInfo(pda[0])
        set((s) => {
            if (acc) {
                s.info = UBIInfoLayout.decode(acc.data)
                s.infoAddress = pda[0]
                s.initialized = true
            }
            else s.initialized = false
        })
    },
}));

export default useUBIInfoStore;