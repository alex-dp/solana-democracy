import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import RegionRow from "components/petition/RegionRow";
import Link from "next/link";
import { FC, FormEvent, useCallback, useEffect } from "react";
import useActiveRegionsStore from "stores/useActiveRegionsStore";
import useNotificationStore from "stores/useNotificationStore";
import { PETITION_PROGRAM, useIDL } from "types/types";

export const PetitionsView: FC = ({ }) => {

  const connection = new Connection(process.env.NEXT_PUBLIC_ENDPOINT);

  const { regionList, getRegions, clearRegions, regStates, getRegStates } = useActiveRegionsStore()

  const { notify } = useNotificationStore();

  const wallet = useWallet();

  const getProvider = () => {
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    return provider;
  };

  const provider = getProvider()

  const { setVisible } = useWalletModal();

  const programID = new PublicKey(PETITION_PROGRAM)

  useEffect(() => {
    if (!regStates) {
      if (!regionList) getRegions(connection)
      else getRegStates(connection, regionList)
    }
  }, [connection, regionList, regStates])

  const createRegion = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!wallet.connected) {
      setVisible(true)
      return
    }

    const idl = await Program.fetchIdl(programID, provider)

    const program = new Program(idl, programID, provider)

    let regpda = PublicKey.findProgramAddressSync([Buffer.from("r")], programID)

    let regs = await connection.getAccountInfo(regpda[0])

    if (!regs) {
      let tx = new Transaction();
      tx.add(
        await program.methods.initializeRegList().accounts({
          userAuthority: wallet.publicKey,
          activeRegions: regpda[0],
          systemProgram: SystemProgram.programId
        }).instruction()
      );

      let signature = await wallet.sendTransaction(tx, connection);

      notify({ type: 'info', message: `Initializing program state...`, txid: signature });

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });
      notify({ type: 'success', message: `Region list created`, txid: signature });
    }

    let regbuf = Buffer.from([0])
    regbuf.writeUInt8(!regionList || regionList.list.length == 0 ? 0 : regionList.list[regionList.list.length - 1] + 1)

    let desc = e.target[0].value.toString()
    let gk = new PublicKey(e.target[1].value.toString())

    let statepda = PublicKey.findProgramAddressSync([Buffer.from("d"), regbuf], programID)
    let gkLinkPda = PublicKey.findProgramAddressSync([gk.toBuffer()], programID)

    let tx = new Transaction();
    tx.add(
      await program.methods.initializeRegion(desc).accounts({
        state: statepda[0],
        userAuthority: wallet.publicKey,
        activeRegions: regpda[0],
        gatekeeper: gk,
        gkLink: gkLinkPda[0],
        systemProgram: SystemProgram.programId
      }).instruction()
    );

    let signature = await wallet.sendTransaction(tx, connection);

    notify({ type: 'info', message: `Region ${desc} has been submitted`, txid: signature });

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    notify({ type: 'success', message: `Region ${desc} has been listed!`, txid: signature });
    clearRegions()
    getRegions(connection)
  }, [connection, regionList, wallet])

  return (
    <div className="apply-gradient w-screen min-h-screen">
      <div className="flex flex-col mx-auto">
        <p className="pt-8 pb-4 mx-auto">
          <img src='/argonpetitions.svg' className='h-16' />
        </p>

        <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
          <Link href={`/`}>
            <button className="btn btn-square mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 96 960 960" fill="currentColor">
                <path d="M480 902.218 153.782 576 480 249.782l56.131 55.566-230.477 231.043h500.564v79.218H305.654l230.477 230.478L480 902.218Z" />
              </svg>
            </button>
          </Link>
          Active regions
        </h4>

        <Link href="https://www.civic.com/pricing/" target="_blank" className="mx-auto my-1">
          <button className="btn btn-xs">
          inquire with civic regarding gatekeeper networks
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.25 42.7q-1.6 0-2.775-1.175Q5.3 40.35 5.3 38.75V9.25q0-1.65 1.175-2.825Q7.65 5.25 9.25 5.25h13.7v4H9.25v29.5h29.5v-13.7h4v13.7q0 1.6-1.175 2.775Q40.4 42.7 38.75 42.7Zm10.5-11.65L17 28.25l19-19H25.95v-4h16.8v16.8h-4v-10Z" />
            </svg>
          </button>
        </Link>

        <label htmlFor="my-modal-4" className="btn btn-active border-2 border-purple-700 w-fit mx-auto my-2">
          Create new region
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48">
            <path d="M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z" />
          </svg>
        </label>

        <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
          <label className="modal-box rounded-xl max-w-2xl w-fit h-fit border-2 border-purple-600" htmlFor="">
            <h3 className="text-lg font-bold my-6 text-center">Create a new region</h3>
            <form onSubmit={createRegion} className="flex flex-col">
              <input type="text" placeholder="Description" className="input input-bordered w-full max-w-xs mt-6 mb-4 mx-auto" />
              <input type="text" placeholder="Gatekeeper network address" className="input input-bordered w-full max-w-xs my-4 mx-auto" />
              <button type="submit" className="btn btn-active btn-primary mx-auto my-4">
                submit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48"><path d="m24 40-2.1-2.15L34.25 25.5H8v-3h26.25L21.9 10.15 24 8l16 16Z" /></svg>
              </button>
            </form>
          </label>
        </label>

        {regStates?.map((v, i) => <div className="mx-auto my-2"><RegionRow description={v.description} code={v.region} key={i} /></div>)}

      </div>
    </div >
  );
};
