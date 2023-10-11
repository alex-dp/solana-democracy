import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { PETITION_PROGRAM, UBI_MINT, UBI_PROGRAM } from "types/types";
import { getnbuf } from "utils";

let petitionsPK = new PublicKey(PETITION_PROGRAM)

function findWithSeeds(seeds: (Uint8Array | Buffer)[]) {
    return PublicKey.findProgramAddressSync(seeds, petitionsPK)[0]
}

export function getSigAddress(user: PublicKey, reg, id) {
    let seeds = [Buffer.from("s"), user.toBuffer(), getnbuf(1, reg), getnbuf(4, id)]
    return findWithSeeds(seeds)
}

export function getPropAddress(reg, id) {
    let seeds = [Buffer.from("p"), getnbuf(1, reg), getnbuf(4, id)]
    return findWithSeeds(seeds)
}

export function getStateAddress(reg) {
    let seeds = [Buffer.from("d"), getnbuf(1, reg)]
    return findWithSeeds(seeds)
}

export function getRegListAddress() {
    let seeds = [Buffer.from("r")]
    return findWithSeeds(seeds)
}

export function getGKLinkAddress(gk: PublicKey) {
    let seeds = [gk.toBuffer()]
    return findWithSeeds(seeds)
}