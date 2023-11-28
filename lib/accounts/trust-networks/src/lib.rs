use anchor_lang::{account, InitSpace};
use anchor_lang::prelude::{Pubkey};
use anchor_lang::AnchorDeserialize;
use anchor_lang::system_program::ID;
use anchor_lang::AnchorSerialize;

pub const TRUST_LIST_SEED: &[u8] = "trust_list".as_bytes();
pub const TRUSTABLE_SEED: &[u8] = "trustable".as_bytes();
pub const TRUST_SEED: &[u8] = "trust".as_bytes();
pub const PK_LINK_SEED: &[u8] = "pk_link".as_bytes();
pub const SIMILAR_ID_SEED: &[u8] = "sim_ids".as_bytes();

#[account]
#[derive(InitSpace)]
pub struct TrustList {
    #[max_len(0)]
    pub id_list: Vec<u16>,
    pub next_id: u16
}

#[account]
#[derive(InitSpace)]
pub struct Trust {
    pub id: u16,
    pub req: u8,
    pub trustees: u32,
    pub next_id: u32,
}

#[account]
#[derive(InitSpace)]
pub struct Trustable {
    pub id: u32,
    #[max_len(0)]
    pub username: String,
    #[max_len(0)]
    pub full_name: String,
    pub birthday_timestamp: i64,
    #[max_len(0)]
    pub trusted_by: Vec<u32>,
    #[max_len(0)]
    pub does_trust: Vec<u32>,
    pub reports: u32,
    pub trusted: bool,
    pub locked: bool
}

#[account]
#[derive(InitSpace)]
pub struct PkLink {
    pub pk: Pubkey
}

#[account]
#[derive(InitSpace)]
pub struct SimilarIDs {
    #[max_len(0)]
    pub ids: Vec<u32>
}