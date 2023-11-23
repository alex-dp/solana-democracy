use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer};
use std::mem::size_of;

declare_id!("CpJFii61AfWzCec86EGNX784hR7wbGT6KzRXGjMeK6nH");

const FUNDS: &str = "funds";
const FUND: &str = "fund";
const DIST: &str = "dist";
const PARTITION: &str = "part";
const ESCROW: &str = "esc";

const HTTPS: &str = "https://";

#[program]
#[allow(unused_variables)]
pub mod solana_fundraisers {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_fund(
        ctx: Context<MakeFund>,
        fund_id: u16,
        private: bool,
        info: String,
        partition_info: String,
        name: String,
        partition_name: String
    ) -> Result<()> {
        let signer = &mut ctx.accounts.signer;
        let live_funds = &mut ctx.accounts.live_funds;
        let fund = &mut ctx.accounts.fund;
        let token_mint = &ctx.accounts.token_mint;
        let first_partition = &mut ctx.accounts.first_partition;

        live_funds.funds.push(fund_id);
        live_funds.next_fund += 1;

        fund.creator = signer.key();
        fund.partitions.push(0);
        fund.private = private;
        fund.locked = false;
        fund.mint_addr = token_mint.key();
        fund.next_partition = 1;
        fund.information = info;
        fund.name = name;

        first_partition.creator = signer.key();
        first_partition.recipient_owner = ctx.accounts.fp_rec_owner.key();
        first_partition.information = partition_info;
        first_partition.name = partition_name;

        Ok(())
    }

    pub fn make_partition(ctx: Context<MakePartition>, fund_id: u16, info: String, name: String) -> Result<()> {
        let signer = &mut ctx.accounts.signer;
        let fund = &mut ctx.accounts.fund;
        let partition = &mut ctx.accounts.partition;
        let recipient_owner = &ctx.accounts.recipient_owner;

        let id = fund.next_partition.clone();
        fund.partitions.push(id);
        fund.next_partition += 1;

        partition.creator = signer.key();
        partition.recipient_owner = recipient_owner.key();
        partition.information = info;
        partition.name = name;

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

        fund.completed.push(partition_id);

        Ok(())
    }

    pub fn destroy_partition(
        ctx: Context<DestroyPartition>,
        fund_id: u16,
        partition_id: u16,
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;

        let idx = fund.partitions.binary_search(&partition_id).unwrap();

        fund.partitions.remove(idx.clone());

        Ok(())
    }

    pub fn destroy_fund(ctx: Context<DestroyFund>, fund_id: u16) -> Result<()> {
        let live_funds = &mut ctx.accounts.live_funds;

        let idx = live_funds.funds.binary_search(&fund_id).unwrap();
        live_funds.funds.remove(idx);

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, fund_id: u16, amount: u64) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let distribution = &mut ctx.accounts.distribution;

        distribution.mint_addr = fund.mint_addr;
        distribution.total = amount.clone();
        distribution.recipients = fund.partitions.clone();
        distribution.done = vec![false; fund.partitions.len()];

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_accounts = Transfer {
            from: ctx.accounts.donor_token_account.to_account_info().clone(),
            to: ctx.accounts.escrow_vault.to_account_info().clone(),
            authority: ctx.accounts.signer.to_account_info().clone(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        fund.locked = true;
        Ok(())
    }

    pub fn distribute_donation(
        ctx: Context<DistributeDonation>,
        fund_id: u16,
        partition_id: u16,
        bump: u8
    ) -> Result<()> {
        let fund = &mut ctx.accounts.fund;
        let distribution = &mut ctx.accounts.distribution;
        let recipient = &mut ctx.accounts.partition_token_account;
        let partition = &mut ctx.accounts.partition;

        let amount = distribution.total.clone() / fund.partitions.len() as u64;

        let seeds = &[ESCROW.as_bytes(), &fund_id.to_be_bytes(), &[bump]];
        let signer = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info().clone();
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_vault.to_account_info().clone(),
            to: recipient.to_account_info().clone(),
            authority: ctx.accounts.escrow_signer.clone(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        partition.amount_received += amount as u128;
        distribution.done[fund.partitions.binary_search(&partition_id).unwrap()] = true;
        Ok(())
    }

    pub fn unlock_fund(ctx: Context<UnlockFund>, fund_id: u16) -> Result<()> {
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
    space = 8 + LiveFunds::INIT_SPACE,
    seeds = [FUNDS.as_bytes()],
    bump,
    payer = signer
    )]
    pub live_funds: Account<'info, LiveFunds>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16,
private: bool,
info: String,
partition_info: String,
name: String,
partition_name: String)]
pub struct MakeFund<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUNDS.as_bytes()],
    bump,
    realloc = live_funds.to_account_info().data_len() + size_of::<u16>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
    pub live_funds: Account<'info, LiveFunds>,
    #[account(
    init,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    space = 8 + Fund::INIT_SPACE + size_of::<u16>() + info.len() + name.len(),
    payer = signer,
    constraint = fund_id == live_funds.next_fund && info.starts_with(HTTPS)
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &[0, 0]],
    bump,
    space = 8 + Partition::INIT_SPACE + partition_info.len() + partition_name.len(),
    payer = signer,
    constraint = partition_info.starts_with(HTTPS)
    )]
    pub first_partition: Account<'info, Partition>,
    ///CHECK: x
    #[account(mut)]
    pub fp_rec_owner: AccountInfo<'info>,
    #[account(
    mut,
    token::mint = token_mint,
    token::authority = fp_rec_owner
    )]
    pub fp_rec_token: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = escrow_signer
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    /// CHECK: x
    #[account(
        init,
        seeds = [ESCROW.as_bytes(), &fund_id.to_be_bytes()],
        bump,
        payer=signer,
        space=8,
    )]
    pub escrow_signer: AccountInfo<'info>,
    /// CHECK: x
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(fund_id: u16, info: String, name: String)]
pub struct MakePartition<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [FUND.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    constraint = !fund.locked && match fund.private { true => signer.key.eq(&fund.creator), false => true },
    realloc = fund.to_account_info().data_len() + size_of::<u16>(),
    realloc::payer = signer,
    realloc::zero = false
    )]
    pub fund: Account<'info, Fund>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), &fund_id.to_be_bytes(), &fund.next_partition.to_be_bytes()],
    bump,
    space = 8 + Partition::INIT_SPACE + info.len() + name.len(),
    payer = signer,
    constraint = info.starts_with(HTTPS)
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
#[instruction(fund_id: u16, amount: u64)]
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
        mut,
        token::mint = token_mint,
        token::authority = escrow_signer
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    /// CHECK: x
    #[account(
        seeds = [ESCROW.as_bytes(), &fund_id.to_be_bytes()],
        bump,
    )]
    pub escrow_signer: AccountInfo<'info>,
    #[account(mut, address = fund.mint_addr)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [DIST.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    space = 8 + Distribution::INIT_SPACE + Distribution::ELEM_SIZE * fund.partitions.len(),
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
        token::mint = token_mint,
        token::authority = escrow_signer
    )]
    pub escrow_vault: Account<'info, TokenAccount>,
    /// CHECK: x
    #[account(
        seeds = [ESCROW.as_bytes(), &fund_id.to_be_bytes()],
        bump,
    )]
    pub escrow_signer: AccountInfo<'info>,
    #[account(mut, address = fund.mint_addr)]
    pub token_mint: Account<'info, Mint>,
    #[account(
        mut,
        token::mint = token_mint,
        token::authority = partition.recipient_owner
    )]
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
    seeds = [DIST.as_bytes(), &fund_id.to_be_bytes()],
    bump,
    close = signer,
    constraint = distribution.done.iter().all(|&x| x)
    )]
    pub distribution: Account<'info, Distribution>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct LiveFunds {
    next_fund: u16,
    #[max_len(0)]
    funds: Vec<u16>,
}

#[account]
#[derive(InitSpace)]
pub struct Fund {
    #[max_len(0)]
    name: String,
    creator: Pubkey,
    mint_addr: Pubkey,
    locked: bool,
    private: bool,
    next_partition: u16,
    #[max_len(0)]
    partitions: Vec<u16>,
    #[max_len(0)]
    completed: Vec<u16>,
    #[max_len(0)]
    information: String,
}

#[account]
#[derive(InitSpace)]
pub struct Partition {
    #[max_len(0)]
    name: String,
    creator: Pubkey,
    recipient_owner: Pubkey,
    #[max_len(0)]
    information: String,
    amount_received: u128
}

#[account]
#[derive(InitSpace)]
pub struct Distribution {
    mint_addr: Pubkey,
    total: u64,
    #[max_len(0)]
    recipients: Vec<u16>,
    #[max_len(0)]
    done: Vec<bool>,
}

impl Distribution {
    pub const ELEM_SIZE: usize = 2 + 1;
}