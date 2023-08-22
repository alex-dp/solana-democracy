import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { UBI_MINT, UBI_PROGRAM } from "types/types";

let ubiPK = new PublicKey(UBI_PROGRAM)

function findWithSeeds(seeds: (Uint8Array | Buffer)[]) {
    return PublicKey.findProgramAddressSync(seeds, ubiPK)[0]
}

export function getUbiInfoAddress(user: PublicKey) {
    let seeds = [Buffer.from("ubi_info3"), user.toBuffer()]
    return findWithSeeds(seeds)
}

export async function getUserToken(user: PublicKey) {
    return await getAssociatedTokenAddress(
        new PublicKey(UBI_MINT),
        user,
        false
    );
}