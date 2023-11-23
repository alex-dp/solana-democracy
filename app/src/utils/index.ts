import { AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';

// Concatenates classes into a single className string
const cn = (...args: string[]) => args.join(' ');

const formatDate = (date: string) => format(new Date(date), 'MM/dd/yyyy h:mm:ss');

/**
 * Formats number as currency string.
 *
 * @param number Number to format.
 */
const numberToCurrencyString = (number: number) =>
    number.toLocaleString('en-US');

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
const clamp = (current, min, max) => Math.min(Math.max(current, min), max);

export {
    cn,
    formatDate,
    numberToCurrencyString,
    clamp,
};

export function getnbuf(s: number, n: number) {
    let buf = Buffer.alloc(s)
    buf.writeIntBE(n, 0, s)
    return buf
}

export function get2buf(n: number) {
    return getnbuf(2, n)
}

export const getProvider = (connection, wallet) => {
    const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
    );
    return provider;
};

export const mints = [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "So11111111111111111111111111111111111111112",
    "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
    "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    "6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU",
    "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y",
    "4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6"
]

export const names = [
"USDC", "WSOL", "jitoSOL", "mSOL",
"USDT", "RAY", "bSOL", "UXD",
"stSOL", "Bonk", "ORCA", "PYTH",
"WETH", "tBTC", "SHDW", "ARGON"
]

export function getMintName(mint: PublicKey) {
    let idx = mints.indexOf(mint.toString())
    return idx > -1 ? names[idx] : mint.toString()
}