import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { Expirable, expired, getWithSeeds, PETITION_PROGRAM, Programs, PropLayout, RawProp, RawState, setWithSeeds, StateLayout } from 'types/types';

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

        if (!state || expired(state)) {
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
        let lp: Expirable<RawProp[]> = getWithSeeds(Programs.Petitions, ["liveprops", state.region])

        if (!lp || expired(lp) || lp.object.length != state.liveProps.length) {
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
            lp = new Expirable(Date.now() + 1000 * 60 * 30, accs.map((e) => PropLayout.decode(e.data)))

            setWithSeeds(Programs.Petitions, ["liveprops", state.region], lp)
        }

        set((s) => {
            s.liveProps = lp.object
        })
    },
    getClosedProps: async (connection, state) => {
        let cp: Expirable<RawProp[]> = getWithSeeds(Programs.Petitions, ["closedprops", state.region])

        if (!cp || expired(cp) || cp.object.length != state.closedProps.length) {
            let idbuf = Buffer.alloc(4)
            let regbuf = Buffer.alloc(1)

            let adds = state.closedProps.reverse().map((e) => {   //reverse: most recent first
                idbuf.writeUInt32BE(e)
                regbuf.writeUInt8(state.region)
                return PublicKey.findProgramAddressSync(
                    [Buffer.from("p"), regbuf, idbuf],
                    programID
                )[0]
            })

            let accs = await connection.getMultipleAccountsInfo(adds)
            cp = new Expirable(Date.now() + 1000 * 60 * 30, accs.map((e) => PropLayout.decode(e.data)))

            setWithSeeds(Programs.Petitions, ["closedprops", state.region], cp)
        }

        set((s) => {
            s.liveProps = cp.object
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