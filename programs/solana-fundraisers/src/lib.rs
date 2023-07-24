use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

const FUNDS: &str = "funds";

#[program]
pub mod solana_fundraisers {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_fund(ctx:Context<MakeFund>) -> Result<()> {
        Ok(())
    }

    pub fn make_partition(ctx:Context<MakePartition>) -> Result<()> {
        Ok(())
    }

    pub fn set_preference(ctx:Context<SetPreference>) -> Result<()> {
        Ok(())
    }

    pub fn destroy_fund(ctx:Context<DestroyFund>) -> Result<()> {
        Ok(())
    }

    pub fn donate(ctx:Context<Donate>) -> Result<()> {
        Ok(())
    }

    pub fn distribute_donation(ctx:Context<DistributeDonation>) -> Result<()> {
        Ok(())
    }

}

#[account]
pub struct LiveFunds {
    funds: Vec<u16>
}

#[account]
pub struct LivePartitions {
    partitions: Vec<u16>
}

#[account]
pub struct Fund {
    creator: Pubkey,
    partitions: Vec<u16>,
    points: Vec<u16>,
    mint_addr: Pubkey,
    locked: bool
}

#[account]
pub struct Partition {
    recipient_owner: Pubkey,
    recipient_token_addr: Pubkey,
    goal: u128
}

#[account]
pub struct Distribution {
    mint_addr: Pubkey,
    total: u128,
    recipients: Vec<Pubkey>,
    points: Vec<u16>,
    done: Vec<bool>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    space = 8,
    seeds = [FUNDS.as_bytes()],
    bump,
    payer = signer
    )]
    pub live_funds: Account<'info, LiveFunds>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(partition_ids: Vec<u16>)]
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
    seeds = [FUND.as_bytes(), fund],
    bump,
    space = 8,
    payer = signer
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), fund, partition],
    bump,
    space = 8,
    payer = signer
    )]
    pub first_partition: Account<'info, Fund>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MakePartition<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,

}

#[derive(Accounts)]
pub struct SetPreference<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,

}

#[derive(Accounts)]
pub struct DestroyFund<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,

}

#[derive(Accounts)]
pub struct Donate<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    seeds = [FUND.as_bytes(), fund],
    bump,
    space = 8,
    payer = signer
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = true)]
    pub token_mint: Account<'info, Mint>,
    #[account(
    init,
    seeds = [DIST.as_bytes(), fund],
    bump,
    space = 8,
    payer = signer
    )]
    pub distribution: Account<'info, Distribution>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeDonation<'info> {
    ///CHECK: x
    #[account(signer, mut)]
    pub signer: AccountInfo<'info>,
    #[account(
    init,
    seeds = [FUND.as_bytes(), fund],
    bump,
    space = 8,
    payer = signer
    )]
    pub fund: Account<'info, Fund>,
    #[account(mut)]
    pub escrow: Account<'info, TokenAccount>,
    #[account(mut, constraint = true)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub partition_token_account: Account<'info, TokenAccount>,
    #[account(
    init,
    seeds = [PARTITION.as_bytes(), fund, partition],
    bump,
    space = 8,
    payer = signer
    )]
    pub partition: Account<'info, Fund>,
    #[account(
    mut,
    seeds = [DIST.as_bytes(), fund],
    bump
    )]
    pub distribution: Account<'info, Distribution>,
    pub system_program: Program<'info, System>,
}

