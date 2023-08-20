import { PublicKey } from "@solana/web3.js";
import { FUNDRAISER_PROGRAM } from "types/types";

let fundraiserPk = new PublicKey(FUNDRAISER_PROGRAM)

function findWithSeeds(seeds: (Uint8Array | Buffer)[]) {
    return PublicKey.findProgramAddressSync(seeds, fundraiserPk)[0]
}

function get2buf(n: number) {
    let buf = Buffer.alloc(2)
    buf.writeUint16BE(n)
    return buf
}

export function getFundListAddress() {
    return findWithSeeds([Buffer.from("funds")])
}

export function getFundAddress(id: number): PublicKey {
    let seeds = [Buffer.from("fund"), get2buf(id)]
    return findWithSeeds(seeds)
}

export function getPartitionAddress(fund_id: number, partition_id: number): PublicKey {
    let seeds = [Buffer.from("part"), get2buf(fund_id), get2buf(partition_id)]
    return findWithSeeds(seeds)
}

export function getPreferenceListAddress(user: PublicKey) {
    let seeds = [Buffer.from("upl"), user.toBytes()]
    return findWithSeeds(seeds)
}

export function getPreferenceAddress(user: PublicKey, fund_id: number) {
    let seeds = [Buffer.from("user"), get2buf(fund_id), user.toBytes()]
    return findWithSeeds(seeds)
}

export function getDistributionAddress(fund_id: number) {
    let seeds = [Buffer.from("dist"), get2buf(fund_id)]
    return findWithSeeds(seeds)
}

export function getEscrowAddress(fund_id: number) {
    let seeds = [Buffer.from("esc"), get2buf(fund_id)]
    return findWithSeeds(seeds)
}