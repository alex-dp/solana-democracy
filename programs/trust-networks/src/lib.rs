use anchor_lang::prelude::*;
use trust_accounts::{PkLink, SimilarIDs, Trust, Trustable, TrustLink, TrustList};
use shared::{is_trusted, butcher};
use std::mem::size_of;

declare_id!("61htBumLAB45Sp4XxwLLUfTc3A4dUYGdj2RwWvUUmeKw");

const TRUST_LIST_SEED: &[u8] = "trust_list".as_bytes();
const TRUSTABLE_SEED: &[u8] = "trustable".as_bytes();
const TRUST_SEED: &[u8] = "trust".as_bytes();
const TRUST_LINK_SEED: &[u8] = "trust_link".as_bytes();
const PK_LINK_SEED: &[u8] = "pk_link".as_bytes();
const SIMILAR_ID_SEED: &[u8] = "sim_ids".as_bytes();

#[program]
pub mod trust_networks {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_trust(ctx: Context<MakeTrust>) -> Result<()> {
        Ok(())
    }

    pub fn make_sim_id_list(ctx: Context<MakeSimIDList>) -> Result<()> {
        Ok(())
    }

    pub fn make_trustable(ctx: Context<MakeTrustable>) -> Result<()> {
        Ok(())
    }

    pub fn make_trust_link(ctx: Context<MakeTrustLink>) -> Result<()> {
        Ok(())
    }

    pub fn break_trust_link(ctx: Context<BreakTrustLink>) -> Result<()> {
        Ok(())
    }

    pub fn break_mutual_trust_link(ctx: Context<BreakMutualTrustLink>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(init, seeds = [TRUST_LIST_SEED], payer = signer, bump, space = TrustList::INIT_SPACE)]
    pub trust_list: Account<'info, TrustList>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakeTrust<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(mut, seeds = [TRUST_LIST_SEED], bump)]
    pub trust_list: Account<'info, TrustList>,

    #[account(init, seeds = [TRUST_SEED, &trust_list.next_id.to_be_bytes()], bump, space = Trust::INIT_SPACE, payer = signer)]
    pub trust: Account<'info, Trust>,

    #[account(init, seeds = [TRUSTABLE_SEED, &signer.key().to_bytes()], bump, space = Trustable::INIT_SPACE, payer = signer)]
    pub first_participant: Account<'info, Trustable>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String, bd_timestamp: i64, trust_id: u16)]
pub struct MakeSimIDList<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    #[account(
        init, seeds = [SIMILAR_ID_SEED, &trust_id.to_be_bytes(), butcher(&name).as_bytes(), &bd_timestamp.to_be_bytes()],
        bump, space = SimilarIDs::INIT_SPACE, payer = signer,
        constraint = bd_timestamp % (24*60*60) == 0
    )]
    pub sim_id_list: Account<'info, SimilarIDs>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
#[instruction(name: String, bd_timestamp: i64, trust_id: u16)]
pub struct MakeTrustable<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    #[account(
        init, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()],
        bump, space = Trustable::INIT_SPACE, payer = signer
    )]
    pub trustable: Account<'info, Trustable>,

    #[account(
        mut, seeds = [SIMILAR_ID_SEED, &trust_id.to_be_bytes(), butcher(&name).as_bytes(), &bd_timestamp.to_be_bytes()], bump,
        realloc = sim_id_list.to_account_info().data_len() + size_of::<u32>(),
        realloc::payer = signer,
        realloc::zero = false
    )]
    pub sim_id_list: Account<'info, SimilarIDs>,

    #[account(init, seeds = [PK_LINK_SEED, &trust_id.to_be_bytes(), &trustable.username.as_bytes()], bump, payer=signer, space = PkLink::INIT_SPACE)]
    pub username_pk_link: Account<'info, PkLink>,

    #[account(init, seeds = [PK_LINK_SEED, &trust_id.to_be_bytes(), &trustable.id.to_be_bytes()], bump, payer=signer, space = PkLink::INIT_SPACE)]
    pub id_pk_link: Account<'info, PkLink>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct MakeTrustLink<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = !trustee_owner.key().eq(&signer.key()))]

    pub trustee_owner: AccountInfo<'info>,
    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]

    pub trust: Account<'info, Trust>,
    #[account(
        mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump,
        constraint = is_trusted(&trust_from, &trust)
    )]
    pub trust_from: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &trustee_owner.key().to_bytes()], bump)]
    pub trust_to: Account<'info, Trustable>,

    #[account(
        init, seeds=[TRUST_LINK_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes(), &trustee_owner.key().to_bytes()],
        bump, payer=signer,
        space = TrustLink::INIT_SPACE
    )]
    pub trust_link: Account<'info, TrustLink>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct BreakTrustLink<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = !breakee_owner.key().eq(&signer.key()))]
    pub breakee_owner: AccountInfo<'info>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump)]
    pub signer_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &breakee_owner.key().to_bytes()], bump)]
    pub breakee_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    #[account(
        mut, seeds=[TRUST_LINK_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes(), &breakee_owner.key().to_bytes()],
        bump, close=signer
    )]
    pub trust_link: Account<'info, TrustLink>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct BreakMutualTrustLink<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = !breakee_owner.key().eq(&signer.key()))]
    pub breakee_owner: AccountInfo<'info>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump)]
    pub signer_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &breakee_owner.key().to_bytes()], bump)]
    pub breakee_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    #[account(
        mut, seeds=[TRUST_LINK_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes(), &breakee_owner.key().to_bytes()],
        bump, close=signer
    )]
    pub trust_link_to: Account<'info, TrustLink>,

    #[account(
        mut, seeds=[TRUST_LINK_SEED, &trust_id.to_be_bytes(), &breakee_owner.key().to_bytes(), &signer.key().to_bytes()],
        bump, close=signer
    )]
    pub trust_link_from: Account<'info, TrustLink>,

    pub system_program: Program<'info, System>,
}