use std::ops::Div;
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

pub fn break_trust_fn(
    trust_from: &mut Account<Trustable>,
    trust_to: &mut Account<Trustable>,
    trust: &mut Account<Trust>) {

    let mut idx = trust_from.does_trust.iter().position(|id| id == &trust_to.id).unwrap();
    trust_from.does_trust.remove(idx);

    idx = trust_to.trusted_by.iter().position(|id| id == &trust_from.id).unwrap();
    trust_to.trusted_by.remove(idx);

    if trust_to.trusted.clone() && trust_to.trusted_by.len().lt(&cutoff(trust)) {
        trust.trustees -= 1;
        trust_to.trusted = false;
    }
}

pub fn butcher(name: &String) -> String {
    let plain = &remove_diacritics(name).replace(
        |ch: char| ch.is_whitespace() || !ch.is_ascii(), "").to_lowercase()[..];

    let mut chars: Vec<char> = plain.chars().collect();
    chars.sort_by(|a, b| b.cmp(a));
    chars.iter().collect()
}

pub fn cutoff(trust: &Account<Trust>) -> usize {
    trust.trustees.clamp(0, trust.req.clone() as u32) as usize
}

pub fn report_threshold(trust: &Account<Trust>) -> u32 {
    trust.trustees.div(trust.trustees.ilog10() + 1)
}