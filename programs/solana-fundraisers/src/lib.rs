use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer};
use std::mem::size_of;

declare_id!("CpJFii61AfWzCec86EGNX784hR7wbGT6KzRXGjMeK6nH");

const FUNDS: &str = "funds";
const FUND: &str = "fund";
const DIST: &str = "dist";
const PARTITION: &str = "part";
const USER_PREF: &str = "user";
const USER_PREF_LIST: &str = "upl";
const ESCROW: &str = "esc";

fn resize<'info>(
    account: &mut AccountInfo<'info>,
    size_diff: i16,
    payer: &mut AccountInfo<'info>,
    system_program: &mut AccountInfo<'info>,
) {
    if size_diff == 0 {
        return ();
    }
    let rent = Rent::get().unwrap();
    let new_size = (account.data_len() as i16 + size_diff) as usize;
    let new_minimum_balance = rent.minimum_balance(new_size.clone());

    let lamports_diff = new_minimum_balance.saturating_sub(account.lamports());
    invoke(
        &system_instruction::transfer(payer.key, account.key, lamports_diff),
        &[payer.clone(), account.clone(), system_program.clone()],
    )
    .unwrap();

    account.realloc(new_size, false).unwrap();
}

#[program]
pub mod solana_fundraisers {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_fund(
        ctx: Context<MakeFund>,
        fund_id: u16,
        equal: bool,
        private: bool,
        fp_rec_owner: Pubkey,
        fp_rec_token: Pubkey,
        ppu: u8,
        info: String,
        partition_info: String,
    ) -> Result<()> {
        let signer = &mut ctx.accounts.signer;
        let live_funds = &mut ctx.accounts.live_funds;
        let fund = &mut ctx.accounts.fund;
        let token_mint = &ctx.accounts.token_mint;
        let first_partition = &mut ctx.accounts.first_partition;
        let sp = &ctx.accounts.system_program;

        resize(
            &mut live_funds.to_account_info(),
            size_of::<u16>() as i16,
            signer,
            &mut sp.to_account_info(),
        );
        live_funds.funds.push(fund_id);
        live_funds.next_fund += 1;

        fund.creator = *signer.key;
        fund.partitions.push(0);
        fund.points.push(0);
        fund.equal = equal;
        fund.private = private;
        fund.locked = false;
        fund.mint_addr = token_mint.key();
        fund.next_partition = 1;
        fund.points_per_user = ppu;
        fund.information = info;

        first_partition.creator = *signer.key;
        first_partition.recipient_owner = fp_rec_owner;
        first_partition.recipient_token_addr = fp_rec_token;
        first_partition.information = partition_info;

        Ok(())
    }

    pub fn make_partition(ctx: Context<MakePartition>, fund_id: u16, info: String) -> Result<()> {
        let signer = &mut ctx.accounts.signer;
        let fund = &mut ctx.accounts.fund;
        let partition = &mut ctx.accounts.partition;
        let recipient_owner = &ctx.accounts.recipient_owner;
        let recipient_token_account = &ctx.accounts.recipient_token_account;
        let sp = &ctx.accounts.system_program;

        resize(
            &mut fund.to_account_info(),
            2 * size_of::<u16>() as i16,
            signer,
            &mut sp.to_account_info(),
        );

        let id = fund.next_partition.clone();
        fund.partitions.push(id);
        fund.points.push(0);
        fund.next_partition += 1;

        partition.creator = signer.key();
        partition.recipient_owner = recipient_owner.key();
        partition.recipient_token_addr = recipient_token_account.key();
        partition.information = info;

        Ok(())
    }

    pub fn mark_completed(
        ctx: Context<MarkCompleted>,
        fund_id: u16,
        partition_id: u16,
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;

        let idx = fund.partitions.binary_search(&partition_id).unwrap();
        fund.partitions.remove(idx.clone());
        fund.points.remove(idx);

        fund.completed.push(partition_id);

        Ok(())
    }

    pub fn edit_info(
        ctx: Context<EditInfo>,
        fund_id: u16,
        partition_id: u16,
        new_info: String,
    ) -> Result<()> {
        let partition = &mut ctx.accounts.partition;
        let sp = &ctx.accounts.system_program;
        let signer = &mut ctx.accounts.signer;

        resize(
            &mut partition.to_account_info(),
            (new_info.len() - partition.information.len()) as i16,
            signer,
            &mut sp.to_account_info());

        partition.information = new_info;

        Ok(())
    }

    pub fn destroy_partition(
        ctx: Context<DestroyPartition>,
        fund_id: u16,
        partition_id: u16,
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;

        //todo check contain in constraint
        let idx = fund.partitions.binary_search(&partition_id).unwrap();

        fund.partitions.remove(idx.clone());
        fund.points.remove(idx);

        Ok(())
    }

    pub fn make_pref_list(ctx: Context<MakePreferenceList>) -> Result<()> {
        Ok(())
    }

    pub fn set_preference(
        ctx: Context<SetPreference>,
        fund_id: u16,
        recipients: Vec<u16>,
        points: Vec<u16>,
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let signer = &mut ctx.accounts.signer;
        let user_preference = &mut ctx.accounts.user_preference;
        let user_preferences = &mut ctx.accounts.user_preferences;
        let sp = &mut ctx.accounts.system_program;

        resize(
            &mut user_preferences.to_account_info(),
            size_of::<u16>() as i16,
            signer,
            &mut sp.to_account_info(),
        );

        user_preferences.funds.push(fund_id);

        user_preference.points = points.clone();
        user_preference.recipients = recipients;

        for (pos, e) in points.iter().enumerate() {
            fund.points[pos] += e;
        }

        Ok(())
    }

    pub fn destroy_preference(ctx: Context<DestroyPreference>, fund_id: u16) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let user_preference = &ctx.accounts.user_preference;
        let user_preferences = &mut ctx.accounts.user_preferences;

        let idx = user_preferences.funds.binary_search(&fund_id).unwrap();
        user_preferences.funds.remove(idx);

        for (pos, e) in user_preference.recipients.iter().enumerate() {
            match fund.partitions.binary_search(e) {
                Ok(idx) => {
                    fund.points[idx] -= &user_preference.points[pos];
                }
                Err(_) => {}
            }
        }

        Ok(())
    }

    pub fn destroy_fund(ctx: Context<DestroyFund>, fund_id: u16) -> Result<()> {
        let live_funds = &mut ctx.accounts.live_funds;

        let idx = live_funds.funds.binary_search(&fund_id).unwrap();
        live_funds.funds.remove(idx);

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let distribution = &mut ctx.accounts.distribution;

        distribution.mint_addr = fund.mint_addr;
        distribution.total = amount.clone();
        distribution.recipients = fund.partitions.clone();
        distribution.points = fund.points.clone();
        distribution.done = Vec::with_capacity(fund.partitions.len());

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_accounts = Transfer {
            from: ctx.accounts.donor_token_account.to_account_info().clone(),
            to: ctx.accounts.escrow.to_account_info().clone(),
            authority: ctx.accounts.signer.to_account_info().clone(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn distribute_donation(
        ctx: Context<DistributeDonation>,
        fund_id: u16,
        partition_id: u16,
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let distribution = &mut ctx.accounts.distribution;
        let recipient = &mut ctx.accounts.partition_token_account;

        let idx = fund.partitions.binary_search(&partition_id).unwrap();

        let amount = match fund.equal {
            true => distribution.total.clone() / fund.partitions.len() as u64,
            false => {
                distribution.total.clone() / fund.points.iter().sum::<u16>() as u64
                    * (fund.points.get(idx.clone()).unwrap().clone()) as u64
            }
        };

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow.to_account_info().clone(),
            to: recipient.to_account_info().clone(),
            authority: ctx.accounts.signer.to_account_info().clone(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        distribution.done[idx] = true;
        Ok(())
    }

    pub fn unlock_fund(ctx: Context<UnlockFund>) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        fund.locked = false;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    space = 8 + LiveFunds::MIN_SIZE,
    seeds = [FUNDS.as_bytes()],
    bump,
    payer = signer
    )]
    pub live_funds: Account<'info, LiveFunds>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, info: String, partition_info: String)]
pub struct MakeFund<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUNDS.as_bytes()],
    bump
    )]
    pub live_funds: Account<'info, LiveFunds>,
    #[account(
    init,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    space = 8 + Fund::MIN_SIZE + info.len(),
    payer = signer,
    constraint = fund_id == live_funds.next_fund
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &[0]],
    bump,
    space = 8 + Partition::MIN_SIZE + partition_info.len(),
    payer = signer
    )]
    pub first_partition: Account<'info, Partition>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, info: String)]
pub struct MakePartition<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked && match fund.private { true => signer.key.eq(&fund.creator), false => true }
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &fund.next_partition.to_be_bytes()],
    bump,
    space = 8 + Partition::MIN_SIZE + info.len(),
    payer = signer
    )]
    pub partition: Account<'info, Partition>,
    ///CHECK: x
    #[account(mut)]
    pub recipient_owner: AccountInfo<'info>,
    #[account(
    mut,
    token::mint = fund.mint_addr,
    token::authority = recipient_owner
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, partition_id: u16)]
pub struct MarkCompleted<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked && match fund.private { true => signer.key.eq(&fund.creator), false => true }
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &fund.next_partition.to_be_bytes()],
    bump,
    constraint = signer.key.eq(&partition.creator) || signer.key.eq(&fund.creator)
    )]
    pub partition: Account<'info, Partition>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, partition_id: u16, info: String)]
pub struct EditInfo<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked && match fund.private { true => signer.key.eq(&fund.creator), false => true }
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &fund.next_partition.to_be_bytes()],
    bump,
    constraint = signer.key.eq(&partition.creator) || signer.key.eq(&fund.creator)
    )]
    pub partition: Account<'info, Partition>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, partition_id: u16)]
pub struct DestroyPartition<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = fund.partitions.contains(&partition_id) && !fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &partition_id.to_be_bytes()],
    bump,
    close = signer,
    constraint = signer.key.eq(&partition.creator) || signer.key.eq(&fund.creator)
    )]
    pub partition: Account<'info, Partition>,
}

#[derive(Accounts)]
pub struct MakePreferenceList<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    seeds = [USER_PREF_LIST.as_bytes(), &signer.key.to_bytes()],
    bump,
    payer = signer,
    space = UserPreferences::MIN_SIZE
    )]
    pub user_preferences: Account<'info, UserPreferences>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, recipients: Vec<u16>, points: Vec<u16>)]
pub struct SetPreference<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = fund.partitions == recipients && points.iter().sum::<u16>() == fund.points_per_user as u16 && !fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    init,
    seeds = [USER_PREF.as_bytes(), &fund_id.to_be_bytes(), &signer.key.to_bytes()],
    bump,
    payer = signer,
    space = UserPreference::MIN_SIZE + fund.partitions.len() * UserPreference::ELEMENT_SIZE
    )]
    pub user_preference: Account<'info, UserPreference>,
    #[account(
    mut,
    seeds = [USER_PREF_LIST.as_bytes(), &signer.key.to_bytes()],
    bump,
    )]
    pub user_preferences: Account<'info, UserPreferences>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16)]
pub struct DestroyPreference<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [USER_PREF.as_bytes(), &fund_id.to_be_bytes(), &signer.key.to_bytes()],
    bump,
    close = signer
    )]
    pub user_preference: Account<'info, UserPreference>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [USER_PREF_LIST.as_bytes(), &signer.key.to_bytes()],
    bump,
    )]
    pub user_preferences: Account<'info, UserPreferences>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16)]
pub struct DestroyFund<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUNDS.as_bytes()],
    bump
    )]
    pub live_funds: Account<'info, LiveFunds>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    close = signer,
    constraint = fund.partitions.is_empty() && signer.key.eq(&fund.creator) && !fund.locked
    )]
    pub fund: Account<'info, Fund>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16)]
pub struct Donate<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    init,
    seeds = [ESCROW.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    payer = signer,
    token::mint = token_mint,
    token::authority = distribution
    )]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, address = fund.mint_addr)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [DIST.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    space = 8 + Distribution::MIN_SIZE + Distribution::ELEMENT_SIZE * fund.partitions.len(),
    payer = signer
    )]
    pub distribution: Account<'info, Distribution>,
    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,
    /// CHECK: x
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, partition_id: u16)]
pub struct DistributeDonation<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [ESCROW.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    token::mint = token_mint
    )]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, address = fund.mint_addr)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut, address = partition.recipient_token_addr)]
    pub partition_token_account: Account<'info, TokenAccount>,
    #[account(
    mut,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &partition_id.to_be_bytes()],
    bump,
    constraint = distribution.recipients.contains(&partition_id)
    )]
    pub partition: Account<'info, Partition>,
    #[account(
    mut,
    seeds = [DIST.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !distribution.done.get(distribution.recipients.binary_search(&partition_id).unwrap()).unwrap()
    )]
    pub distribution: Account<'info, Distribution>,
    /// CHECK: x
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16)]
pub struct UnlockFund<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = fund.locked
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [],
    bump,
    close = signer
    )]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = true)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    mut,
    seeds = [DIST.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    close = signer,
    constraint = distribution.done.iter().all(|&x| x)
    )]
    pub distribution: Account<'info, Distribution>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct LiveFunds {
    next_fund: u16,
    funds: Vec<u16>,
}

impl LiveFunds {
    pub const MIN_SIZE: usize = 2 + 4;
}

#[account]
pub struct Fund {
    creator: Pubkey,
    mint_addr: Pubkey,
    locked: bool,
    private: bool,
    equal: bool,
    next_partition: u16,
    points_per_user: u8,
    partitions: Vec<u16>,
    points: Vec<u16>,
    completed: Vec<u16>,
    information: String,
}

impl Fund {
    pub const MIN_SIZE: usize = 32 + 32 + 1 + 1 + 1 + 2 + 1 + (4 + 2) + (4 + 2) + (4) + 4;
}

#[account]
pub struct Partition {
    creator: Pubkey,
    recipient_owner: Pubkey,
    recipient_token_addr: Pubkey,
    information: String,
}

impl Partition {
    pub const MIN_SIZE: usize = 32 + 32 + 32 + 4;
}

#[account]
pub struct Distribution {
    mint_addr: Pubkey,
    total: u64,
    recipients: Vec<u16>,
    points: Vec<u16>,
    done: Vec<bool>,
}

impl Distribution {
    pub const MIN_SIZE: usize = 32 + 8 + 4 + 4 + 4;
    pub const ELEMENT_SIZE: usize = 2 + 2 + 1;
}

#[account]
pub struct UserPreference {
    fund_id: u16,
    points: Vec<u16>,
    recipients: Vec<u16>,
}

impl UserPreference {
    pub const MIN_SIZE: usize = 2 + 4 + 4;
    pub const ELEMENT_SIZE: usize = 2 + 2;
}

#[account]
pub struct UserPreferences {
    funds: Vec<u16>,
}

impl UserPreferences {
    pub const MIN_SIZE: usize = 4;
}
