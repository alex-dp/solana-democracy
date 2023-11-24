use anchor_lang::account;
use anchor_lang::prelude::Pubkey;
use anchor_lang::AnchorDeserialize;
use anchor_lang::system_program::ID;
use anchor_lang::AnchorSerialize;

#[account]
pub struct TrustList {
    id_list: Vec<u16>,
    next_id: u16
}

#[account]
pub struct Trust {
    id: u16,
    req: u8,
    set_size: u32,
    next_id: u32,
}

#[account]
pub struct Trustable {
    id: u32,
    trusters: Vec<u32>,
    username: String,
}

pub struct PKlink {
    pk: Pubkey
}