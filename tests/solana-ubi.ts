import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { SolanaUbi } from "../target/types/solana_ubi";


//auth pk
//As96uoN5tdDCJFDVvLXY4bYuMvUrEkhW9r6R5kLs1ALR
//auth token acc
//DvwFPuVY6167XR8s8Bdak1gNCDLkYbeVLFsTcMwfkYrv
//ubi info pda
//44NtGZAwJLB49mRkWTLkkUhzathzsHvQ4NXN8ry52vi5

describe("solana-ubi", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaUbi as Program<SolanaUbi>;
  
	let arr = new Uint8Array(32).fill(7);
	arr[5] = 2
	let auth = anchor.web3.Keypair.fromSeed(arr);
	let pda = anchor.utils.publicKey.findProgramAddressSync(
    	["ubi_info7", auth.publicKey.toBytes()],
    	program.programId
    )
    
  let mint_signer = anchor.utils.publicKey.findProgramAddressSync(
    	["minter"],
    	program.programId
    )

  let state_pda = anchor.utils.publicKey.findProgramAddressSync(
      ["state1"],
      program.programId
    )

    let spk = new PublicKey("9BuWVRLgPHC1UMXzxkk3R88Ci3VVr66M6fki4fFSFEMV")

    let strange = anchor.utils.publicKey.findProgramAddressSync(
      ["ubi_info7", spk.toBytes()],
      program.programId
    )

  console.log("state pda", state_pda[0].toString(), "bump", state_pda[1])
  console.log("auth", auth.publicKey.toString())
  console.log("mint signer", mint_signer[0].toString())
  console.log("ubi info pda", pda[0].toString())

  console.log("strange pda: ", strange[0].toString())

  it("Program state is initialized!", async () => {
    const tx = await program.methods.initializeMint().accounts({
      state: state_pda[0],
      userAuthority: auth.publicKey,
      systemProgram: SystemProgram.programId
    }).signers([auth]).rpc();
  });
  
  it("Account is initialized!", async () => {
    const tx = await program.methods.initializeAccount().accounts({
          ubiInfo: pda[0],
          userAuthority: auth.publicKey,
          systemProgram: SystemProgram.programId
      }).signers([auth]).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Is minted!", async () => {
     
    const tx = await program.methods.mintToken().accounts({
          mintSigner: mint_signer[0],
          ubiMint: "G8QHPZm7mUdF2QWv3zJJzABNzppvXRUfFjvvKyMAcQ1M",
          userAuthority: auth.publicKey,
          ubiTokenAccount: "DvwFPuVY6167XR8s8Bdak1gNCDLkYbeVLFsTcMwfkYrv",
          ubiInfo: pda[0],
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          state: state_pda[0]
      }).signers([auth]).rpc();
    console.log("Your transaction signature", tx);
  });
  
  it("Is deserialized!", async () => {
  	let a = await anchor.getProvider().connection.getParsedAccountInfo(pda[0])
    console.log(a.value.data)
  });
});
