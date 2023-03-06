import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { RawUBIInfo, UBIInfoLayout } from 'types/types';

const programID = new PublicKey("EcFTDXxknt3vRBi1pVZYN7SjZLcbHjJRAmCmjZ7Js3fd");

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
        try {
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
        } catch (error) { console.log(error) }
    },
}));

export default useUBIInfoStore;