import create, { State } from 'zustand'
import { Connection, PublicKey } from '@solana/web3.js'
import { clearWithSeeds, Expirable, expired, getWithSeeds, PETITION_PROGRAM, Programs, PropLayout, RawProp, RawState, setWithSeeds, StateLayout } from 'types/types';

const programID = new PublicKey(PETITION_PROGRAM);

interface ProposalStore extends State {
    liveProps: RawProp[];
    closedProps: RawProp[];
    state: RawState;
    getState: (connection: Connection, region: number) => void;
    getLiveProps: (connection: Connection, state: RawState) => void;
    getClosedProps: (connection: Connection, state: RawState) => void;
    clearLiveProps: (region: number) => void;
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
            if (acc) {
                state = new Expirable(Date.now() + 1000 * 60 * 5, StateLayout.decode(acc.data))
                setWithSeeds(Programs.Petitions, ["d", region], state)
            }
        }

        if (state) {
            set((s) => {
                s.state = state.object
            })
        }
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

        if (lp) {
            set((s) => {
                s.liveProps = lp.object
            })
        }
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
    clearLiveProps: (region) => {
        clearWithSeeds(Programs.Petitions, ["d", region])
        clearWithSeeds(Programs.Petitions, ["liveprops", region])
    }
}));

export default useProposalStore;