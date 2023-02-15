import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaPetition } from "../target/types/solana_petition";

describe("solana-petition", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaPetition as Program<SolanaPetition>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
