use std::iter::Map;
use anchor_lang::*;

pub enum CouncilStatus {
    CAMPAIGN,
    TALLY,
    ACTIVE
}

pub struct Opinion {
    bonuses: u32,
    maluses: u32
}

#[account]
#[derive(InitSpace)]
pub struct TrustMirrorList {
    pub ids: Vec<u16>
}

#[account]
#[derive(InitSpace)]
pub struct CouncilList {
    pub ids: Vec<u8>,
}

#[account]
#[derive(InitSpace)]
pub struct Council {
    pub period: u16,
    pub period_start: i64,
    pub campaign_days: u8,
    pub period_days: u16,
    pub status: CouncilStatus,
    #[max_len(0)]
    pub composition: Vec<u32>,
    pub size: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PreferencePool {
    pub period: u16,
    #[max_len(0)]
    pub opinions: Map<u32, Opinion>,
}

#[account]
#[derive(InitSpace)]
pub struct PreferenceLink {

}
