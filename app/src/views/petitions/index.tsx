import { AnchorProvider, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import RegionRow from "components/petition/RegionRow";
import { FC, FormEvent, useCallback, useEffect } from "react";
import useActiveRegionsStore from "stores/useActiveRegionsStore";
import { notify } from "utils/notifications";

export const PetitionsView: FC = ({ }) => {

  const connection = new Connection("http://127.0.0.1:8899");

  const { regionList, getRegions, regStates, getRegStates } = useActiveRegionsStore()

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

  const programID = "E7QHjboLzRXGS8DzEq6CzcpHk54gHzJYvaPpzhxhHBU8"

  useEffect(() => {
    if (!regStates) {
      if (!regionList) getRegions(connection)
      else getRegStates(connection, regionList)
    }
  }, [connection, getRegions, regionList, getRegStates, regStates])

  const createRegion = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const idl = await Program.fetchIdl(programID, provider)

    const program = new Program(idl, programID, provider)

    let regbuf = Buffer.from([0])
    regbuf.writeUInt8(regionList.list.length == 0 ? 0 : regionList.list[regionList.list.length - 1] + 1)

    let desc = e.target[0].value.toString()
    let gk = new PublicKey(e.target[1].value.toString())

    let statepda = PublicKey.findProgramAddressSync([Buffer.from("d"), regbuf], new PublicKey(programID))
    let regpda = PublicKey.findProgramAddressSync([Buffer.from("r")], new PublicKey(programID))
    let gkLinkPda = PublicKey.findProgramAddressSync([gk.toBuffer()], new PublicKey(programID))

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

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    notify({ type: 'success', message: 'Transaction successful!', txid: signature });
  }, [connection, regionList])

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#c53fe9ff] to-blue-600 py-8">
          Petitions
        </h1>

        <h4 className="md:w-full text-2xl md:text-3xl text-center text-slate-300 my-2">
          Active regions
          <p className='text-slate-500 text-2xl leading-relaxed text-center'>
            You are using verifiable Free (Libre) open source software
          </p>
        </h4>

        <label htmlFor="my-modal-4" className="btn btn-active">
          Create new region
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="currentColor" viewBox="0 0 48 48"><path d="M22.5 38V25.5H10v-3h12.5V10h3v12.5H38v3H25.5V38Z" /></svg>
        </label>

        <input type="checkbox" id="my-modal-4" className="modal-toggle z-100000" />
        <label htmlFor="my-modal-4" className="modal cursor-pointer z-1000">
          <label className="modal-box" htmlFor="">
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

        {regStates?.map((v, i) => <RegionRow description={v.description} code={v.region} key={i} />)}

      </div>
    </div >
  );
};
