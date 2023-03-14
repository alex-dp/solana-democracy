import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { Expirable, getWithSeeds, PETITION_PROGRAM, Programs, PropLayout, RawProp, RawState, setWithSeeds, StateLayout } from 'types/types';

const programID = new PublicKey(PETITION_PROGRAM);

interface ProposalStore extends State {
    liveProps: RawProp[];
    closedProps: RawProp[];
    state: RawState;
    getState: (connection: Connection, region: number) => void;
    getLiveProps: (connection: Connection, state: RawState) => void;
    getClosedProps: (connection: Connection, state: RawState) => void;
    hasSigned: (connection: Connection, region: number, id: number, pk: PublicKey, sigAddress: PublicKey) => Promise<boolean>
}

const useProposalStore = create<ProposalStore>((set, _get) => ({
    liveProps: [],
    closedProps: [],
    state: null,
    getState: async (connection, region) => {

        let state: Expirable<RawState> = getWithSeeds(Programs.Petitions, ["d", region])

        if (!state) {
            let regbuf = Buffer.alloc(1)
            regbuf.writeUInt8(region)

            let pda = PublicKey.findProgramAddressSync(
                [Buffer.from("d"), regbuf],
                programID
            )

            let acc = await connection.getAccountInfo(pda[0])
            state = new Expirable(Date.now() + 1000 * 60 * 5, StateLayout.decode(acc.data))
            setWithSeeds(Programs.Petitions, ["d", region], state)
        }
        set((s) => {
            s.state = state.object
        })
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
    getClosedProps: async (connection, state) => {
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
    },
    hasSigned: async (connection, region, id, pk, sigAddress) => {
        let sig = getWithSeeds(Programs.Petitions, ["s", pk, region, id])

        if (sig) return true

        let sigAcc = await connection.getAccountInfo(sigAddress)

        if (sigAcc) {
            setWithSeeds(Programs.Petitions, ["s", pk, region, id], true)
            return true
        }

        return false
    }
}));

export default useProposalStore;