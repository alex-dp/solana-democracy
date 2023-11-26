use anchor_lang::prelude::*;
use trust_accounts::{Trust, Trustable};
use anchor_lang::solana_program::*;

pub mod program_ids {
    use super::{pubkey, Pubkey};

    pub const UBI: Pubkey = pubkey!("EcFTDXxknt3vRBi1pVZYN7SjZLcbHjJRAmCmjZ7Js3fd");
    pub const PETITIONS: Pubkey = pubkey!("78CbaxW47AoFLNqMPQNMUMSYhtbpGJA2pfdXHUExxz6o");
    pub const FUNDRAISERS: Pubkey = pubkey!("CpJFii61AfWzCec86EGNX784hR7wbGT6KzRXGjMeK6nH");
    pub const TRUST: Pubkey = pubkey!("61htBumLAB45Sp4XxwLLUfTc3A4dUYGdj2RwWvUUmeKw");
}

pub fn is_trusted(trustable: &Account<Trustable>, trust: &Account<Trust>) -> bool {
    return match trust.trustees.gt(&(trust.req.clone() as u32)) {
        true => { trustable.trusters.ge(&(trust.req.clone() as u16)) }
        false => { trustable.trusters == (trust.trustees.clone() - 1) as u16 }
    }
}

pub fn butcher(name: &String) -> String {
    name.replace(|ch: char| ch.is_whitespace(), "").to_lowercase()
}