use anchor_lang::prelude::*;
use trust_accounts::*;
use shared::*;
use std::mem::size_of;

declare_id!("61htBumLAB45Sp4XxwLLUfTc3A4dUYGdj2RwWvUUmeKw");

#[program]
pub mod trust_networks {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_trust(ctx: Context<MakeTrust>, req: u8) -> Result<()> {
        let trust_list = &mut ctx.accounts.trust_list;
        let trust = &mut ctx.accounts.trust;
        let first_participant = &mut ctx.accounts.first_participant;

        let next_id = trust_list.next_id.to_owned();
        trust_list.id_list.push(next_id);

        trust.req = req;
        trust.id = trust_list.next_id.clone();
        trust.trustees = 1;

        first_participant.trusted = true;

        trust_list.next_id += 1;
        Ok(())
    }

    pub fn make_sim_id_list(ctx: Context<MakeSimIDList>) -> Result<()> {
        Ok(())
    }

    pub fn make_trustable(ctx: Context<MakeTrustable>, name: String, bd_timestamp: i64, trust_id: u16, username: String) -> Result<()> {
        let sim_id_list = &mut ctx.accounts.sim_id_list;
        let trust = &mut ctx.accounts.trust;
        let trustable = &mut ctx.accounts.trustable;

        sim_id_list.ids.push(trust.next_id.clone());

        trustable.full_name = name;
        trustable.username = username;
        trustable.birthday_timestamp = bd_timestamp;
        trustable.id = trust.next_id.clone();

        trust.next_id += 1;
        Ok(())
    }

    pub fn give_trust(ctx: Context<GiveTrust>) -> Result<()> {
        let trust_to = &mut ctx.accounts.trust_to;
        let trust_from = &mut ctx.accounts.trust_from;
        let trust = &mut ctx.accounts.trust;

        trust_to.trusted_by.push(trust_from.id.clone());
        trust_from.does_trust.push(trust_to.id.clone());

        if !trust_to.trusted.clone() && trust_to.trusted_by.len() >= cutoff(trust) {
            trust.trustees += 1;
            trust_to.trusted = true;
        }

        Ok(())
    }

    pub fn break_trust(ctx: Context<BreakTrust>) -> Result<()> {
        let breaker = &mut ctx.accounts.signer_trustable;
        let breakee = &mut ctx.accounts.breakee_trustable;
        let trust = &mut ctx.accounts.trust;

        break_trust_fn(breaker, breakee, trust);

        Ok(())
    }

    pub fn break_mutual_trust(ctx: Context<BreakMutualTrust>) -> Result<()> {
        let breaker = &mut ctx.accounts.signer_trustable;
        let breakee = &mut ctx.accounts.breakee_trustable;
        let trust = &mut ctx.accounts.trust;

        break_trust_fn(breaker, breakee, trust);
        break_trust_fn(breakee, breaker, trust);

        Ok(())
    }

    pub fn break_foreign_trust(ctx: Context<BreakForeignTrust>) -> Result<()> {
        let trust_from = &mut ctx.accounts.trust_from;
        let trust_to = &mut ctx.accounts.trust_to;
        let trust = &mut ctx.accounts.trust;

        break_trust_fn(trust_from, trust_to, trust);

        Ok(())
    }

    pub fn report(ctx: Context<Report>) -> Result<()> {
        let reportee = &mut ctx.accounts.reportee;
        let trust = &mut ctx.accounts.trust;

        reportee.reports += 1;

        if reportee.reports > report_threshold(trust) {
            reportee.trusted = false;
            reportee.locked = true;

            trust.trustees -= 1;
        }
        Ok(())
    }

    pub fn close_trustable(ctx: Context<CloseTrustable>) -> Result<()> {
        let sim_id_list = &mut ctx.accounts.sim_id_list;
        let closee = &mut ctx.accounts.closee;

        let idx = sim_id_list.ids.iter().position(|id| id.eq(&closee.id)).unwrap();
        sim_id_list.ids.remove(idx);

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

    #[account(
    mut, seeds = [TRUST_LIST_SEED], bump,
    realloc = trust_list.to_account_info().data_len() + size_of::<u16>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
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
#[instruction(name: String, bd_timestamp: i64, trust_id: u16, username: String)]
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
pub struct GiveTrust<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = trustee_owner.key().ne(&signer.key()))]

    pub trustee_owner: AccountInfo<'info>,
    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]

    pub trust: Account<'info, Trust>,
    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump,
    constraint = &trust_from.trusted,
    realloc = &trust_from.to_account_info().data_len() + size_of::<u32>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
    pub trust_from: Account<'info, Trustable>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &trustee_owner.key().to_bytes()], bump,
    realloc = &trust_to.to_account_info().data_len() + size_of::<u32>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
    pub trust_to: Account<'info, Trustable>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct BreakTrust<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = breakee_owner.key().ne(&signer.key()))]
    pub breakee_owner: AccountInfo<'info>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump,
    constraint = signer_trustable.does_trust.contains(&breakee_trustable.id)
    )]
    pub signer_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &breakee_owner.key().to_bytes()], bump)]
    pub breakee_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct BreakMutualTrust<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = breakee_owner.key().ne(&signer.key()))]
    pub breakee_owner: AccountInfo<'info>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump,
    constraint = breakee_trustable.does_trust.contains(&signer_trustable.id)
    )]
    pub signer_trustable: Account<'info, Trustable>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &breakee_owner.key().to_bytes()], bump,
    constraint = signer_trustable.does_trust.contains(&breakee_trustable.id)
    )]
    pub breakee_trustable: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct BreakForeignTrust<'info> {
    ///CHECK: x
    #[account(
    mut, signer,
    constraint = trust_from_owner.key().ne(&trust_to_owner.key())
    )]
    pub signer: AccountInfo<'info>,

    ///CHECK: x
    #[account(constraint = trust_from_owner.key().ne(&signer.key()))]
    pub trust_from_owner: AccountInfo<'info>,
    ///CHECK: x
    #[account(constraint = trust_to_owner.key().ne(&signer.key()))]
    pub trust_to_owner: AccountInfo<'info>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &trust_from_owner.key().to_bytes()], bump,
    constraint = trust_from.does_trust.contains(&trust_to.id)
    )]
    pub trust_from: Account<'info, Trustable>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &trust_to_owner.key().to_bytes()], bump,
    constraint = trust_from.locked || trust_to.locked
    )]
    pub trust_to: Account<'info, Trustable>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct Report<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &signer.key().to_bytes()], bump,
    constraint = &signer_trustable.trusted
    )]
    pub signer_trustable: Account<'info, Trustable>,

    ///CHECK: x
    #[account(constraint = reportee_owner.key().ne(&signer.key()))]
    pub reportee_owner: AccountInfo<'info>,

    #[account(mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &reportee_owner.key().to_bytes()], bump)]
    pub reportee: Account<'info, Trustable>,
}

#[derive(Accounts)]
#[instruction(trust_id: u16)]
pub struct CloseTrustable<'info> {
    ///CHECK: x
    #[account(mut, signer)]
    pub signer: AccountInfo<'info>,

    #[account(mut, seeds = [TRUST_SEED, &trust_id.to_be_bytes()], bump)]
    pub trust: Account<'info, Trust>,

    ///CHECK: x
    #[account(constraint = closee_owner.key().ne(&signer.key()))]
    pub closee_owner: AccountInfo<'info>,

    #[account(
    mut, seeds = [TRUSTABLE_SEED, &trust_id.to_be_bytes(), &closee_owner.key().to_bytes()], bump,
    close = signer,
    constraint =
        closee.locked &&
        closee.trusted_by.len() == 0 &&
        closee.does_trust.len() == 0
    )]
    pub closee: Account<'info, Trustable>,

    #[account(
    mut, seeds = [SIMILAR_ID_SEED, &trust_id.to_be_bytes(), butcher(&closee.full_name).as_bytes(), &closee.birthday_timestamp.to_be_bytes()], bump,
    realloc = sim_id_list.to_account_info().data_len() - size_of::<u32>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
    pub sim_id_list: Account<'info, SimilarIDs>,

    #[account(mut, close=signer, seeds = [PK_LINK_SEED, &trust_id.to_be_bytes(), &closee.username.as_bytes()], bump)]
    pub username_pk_link: Account<'info, PkLink>,

    #[account(mut, close=signer, seeds = [PK_LINK_SEED, &trust_id.to_be_bytes(), &closee.id.to_be_bytes()], bump)]
    pub id_pk_link: Account<'info, PkLink>,

    pub system_program: Program<'info, System>,
}