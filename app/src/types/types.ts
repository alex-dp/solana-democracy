import { PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh"
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";

//TODO move utils to utils

export type EndpointTypes = 'mainnet' | 'devnet' | 'localnet'

export enum Programs {
    UBI,
    Petitions
}

export const
    UBI_MINT = "4HgYp2eiokKcqe5AVAxpwCsfUE5pwCNTiPXvpSxYnDi6",
    UBI_PROGRAM = "EcFTDXxknt3vRBi1pVZYN7SjZLcbHjJRAmCmjZ7Js3fd",
    PETITION_PROGRAM = "78CbaxW47AoFLNqMPQNMUMSYhtbpGJA2pfdXHUExxz6o",
    FUNDRAISER_PROGRAM = "CpJFii61AfWzCec86EGNX784hR7wbGT6KzRXGjMeK6nH",
    ISC_MINT = "J9BcrQfX4p9D1bvLzRNCbMDv8f44a9LFdeqNE4Yk2WMD"

export class Expirable<T> {
    expiration: number
    object: T

    constructor(expiration: number, object: T) {
        this.expiration = expiration
        this.object = object
    }
}

export function expired(o: Expirable<any>) {
    return Date.now() > o.expiration
}

export function getWithSeeds(program: Programs, seeds: any[]) {
    seeds.splice(0, 0, program)
    return JSON.parse(localStorage.getItem(JSON.stringify(seeds)))
}

export function setWithSeeds(program: Programs, seeds: any[], value) {
    seeds.splice(0, 0, program)
    localStorage.setItem(JSON.stringify(seeds), JSON.stringify(value, (k, v) => {
        //TODO big number big hack. please fix me. big numbers get parsed as hex strings
        if (k == "lastIssuance" || k == "expiry") {
            if (typeof v == "string")
                return Number("0x" + v)
            else return Number(v)
        }
        return v
    }))
}

export function clearWithSeeds(program: Programs, seeds: any[]) {
    seeds.splice(0, 0, program)
    localStorage.removeItem(JSON.stringify(seeds))
}

export function clearAll() {
    let cleared = localStorage.getItem("cleared")

    if (!cleared) {
        localStorage.clear()
        localStorage.setItem("cleared", "true")
    }
}

export async function useIDL(id: PublicKey, provider: AnchorProvider): Promise<Idl> {

    localStorage.removeItem("idl" + id.toString())
    let idl: Expirable<Idl> = JSON.parse(localStorage.getItem("idl" + id.toString()))


    if (idl && !expired(idl)) return idl.object
    else {
        let fetchedIdl = await Program.fetchIdl(id, provider)
        localStorage.setItem("idl" + id.toString(), JSON.stringify(new Expirable(Date.now() + 1000 * 60 * 10, fetchedIdl)))
        return fetchedIdl
    }
}

export interface RawUBIInfo {
    buffer: number;
    lastIssuance: number;
}

export interface RawUBIState {
    buffer: number;
    capLeft: number;
}

export const UBIInfoLayout = borsh.struct<RawUBIInfo>([
    borsh.i64('buffer'),
    borsh.i64('lastIssuance')
])

export const UBIStateLayout = borsh.struct<RawUBIState>([
    borsh.i64('buffer'),
    borsh.u128('capLeft')
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

export interface RawFundList {
    buffer:number,
    next_fund: number,
    funds: number[],
}

export const FundListLayout = borsh.struct<RawFundList>([
    borsh.i64("buffer"),
    borsh.u16("next_fund"),
    borsh.vec<number>(borsh.u16(), "funds")
])

export interface RawFund {
    buffer: number;
    name: String;
    creator: PublicKey;
    mintAddr: PublicKey;
    locked: boolean;
    private: boolean;
    nextPartition: number;
    partitions: number[];
    completed: number[];
    information: String;
}

export const FundLayout = borsh.struct<RawFund>([
    borsh.i64("buffer"),
    borsh.str("name"),
    borsh.publicKey("creator"),
    borsh.publicKey("mint_addr"),
    borsh.bool("locked"),
    borsh.bool("private"),
    borsh.u16("next_partition"),
    borsh.vec<number>(borsh.u16(), "partitions"),
    borsh.vec<number>(borsh.u16(), "completed"),
    borsh.str("information")
])