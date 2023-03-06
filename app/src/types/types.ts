import { PublicKey } from "@solana/web3.js";
import * as borsh from "@project-serum/borsh"

export type EndpointTypes = 'mainnet' | 'devnet' | 'localnet'
export function getMint(network) {
    switch (network) {
        case "mainnet":
        case "mainnet-beta":
            return "4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6";
        case "devnet":
            return "2LkCYPkW7zJu8w7Wa12ABgxcbzp8cH8siskPCjPLwV67";
    }
}

export interface RawUBIInfo {
    buffer: number;
    lastIssuance: number;
}

export const UBIInfoLayout = borsh.struct<RawUBIInfo>([
    borsh.i64('buffer'),
    borsh.i64('lastIssuance')
])

export interface RawProp {
    buffer: number;
    id: number;
    creator: PublicKey;
    title: String;
    link: String;
    region: number;
    expiry: number;
    closed: boolean;
    signatures: number;
}

export const PropLayout = borsh.struct<RawProp>([
    borsh.i64('buffer'),
    borsh.u32('id'),
    borsh.publicKey('creator'),
    borsh.str('title'),
    borsh.str('link'),
    borsh.u8('region'),
    borsh.i64('expiry'),
    borsh.bool('closed'),
    borsh.u32('signatures'),
]);

export interface RawState {
    buffer: number;
    liveProps: number[];
    closedProps: number[];
    region: number;
    description: String;
    gatekeeper: PublicKey;
    lastId: number;
}

export const StateLayout = borsh.struct<RawState>([
    borsh.i64('buffer'),
    borsh.vec<number>(borsh.u32(), 'liveProps'),
    borsh.vec<number>(borsh.u32(), 'closedProps'),
    borsh.u8('region'),
    borsh.str('description'),
    borsh.publicKey('gatekeeper'),
    borsh.u32('lastId'),
])

export interface RawActiveRegions {
    buffer: number,
    list: number[]
}

export const ActiveRegionsLayout = borsh.struct<RawActiveRegions>([
    borsh.i64('buffer'),
    borsh.vec<number>(borsh.u8(), 'list')
])