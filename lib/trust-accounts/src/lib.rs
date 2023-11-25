use anchor_lang::{account, InitSpace};
use anchor_lang::prelude::Pubkey;
use anchor_lang::AnchorDeserialize;
use anchor_lang::system_program::ID;
use anchor_lang::AnchorSerialize;

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
    pub set_size: u32,
    pub next_id: u32,
}

#[account]
#[derive(InitSpace)]
pub struct Trustable {
    pub id: u32,
    #[max_len(0)]
    pub username: String,
    pub trusters: u16,
}

#[account]
#[derive(InitSpace)]
pub struct TrustLink {}

#[account]
#[derive(InitSpace)]
pub struct PKlink {
    pub pk: Pubkey
}