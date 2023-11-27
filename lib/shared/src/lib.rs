use anchor_lang::prelude::*;
use trust_accounts::{Trust, Trustable};
use anchor_lang::solana_program::*;
use diacritics::remove_diacritics;

pub mod program_ids {
    use super::{pubkey, Pubkey};

    pub const UBI: Pubkey = pubkey!("EcFTDXxknt3vRBi1pVZYN7SjZLcbHjJRAmCmjZ7Js3fd");
    pub const PETITIONS: Pubkey = pubkey!("78CbaxW47AoFLNqMPQNMUMSYhtbpGJA2pfdXHUExxz6o");
    pub const FUNDRAISERS: Pubkey = pubkey!("CpJFii61AfWzCec86EGNX784hR7wbGT6KzRXGjMeK6nH");
    pub const TRUST: Pubkey = pubkey!("61htBumLAB45Sp4XxwLLUfTc3A4dUYGdj2RwWvUUmeKw");
}

pub fn is_trusted(trustable: &Account<Trustable>, trust: &Account<Trust>) -> bool {
    match trust.trustees.gt(&(trust.req.clone() as u32)) {
        true => { trustable.trusted_by.len().ge(&(trust.req.clone() as usize)) }
        false => { trustable.trusted_by.len() == (trust.trustees.clone() - 1) as usize }
    }
}

pub fn break_trust_fn(trust_from: &mut Account<Trustable>, trust_to: &mut Account<Trustable>) {
    let mut idx = trust_from.does_trust.iter().position(|id| id == &trust_to.id).unwrap();
    trust_from.does_trust.remove(idx);

    idx = trust_to.trusted_by.iter().position(|id| id == &trust_from.id).unwrap();
    trust_to.trusted_by.remove(idx);
}

pub fn butcher(name: &String) -> String {
    let plain = &remove_diacritics(name).replace(
        |ch: char| ch.is_whitespace() || !ch.is_ascii(), "").to_lowercase()[..];

    let mut chars: Vec<char> = plain.chars().collect();
    chars.sort_by(|a, b| b.cmp(a));
    chars.iter().collect()
}