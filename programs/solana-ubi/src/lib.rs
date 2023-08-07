use anchor_lang::prelude::*;
use anchor_lang::solana_program::program_option::COption;
use anchor_spl::token::{self, Mint, MintTo, TokenAccount};
use solana_gateway::Gateway;

const MINTER: &str = "minter";
const UBI_INFO: &str = "ubi_info3";
const STATE: &str = "state1";
const INITIAL_CAP: u128 = 20__000_000_000__000_000_000;

declare_id!("EcFTDXxknt3vRBi1pVZYN7SjZLcbHjJRAmCmjZ7Js3fd");

pub fn rate(cap_left: &u128) -> u64 {
    if *cap_left == 0 {
        return 20_000_000_000;
    }
    // 1B    + 19B        e^ (c_left/c_i)
    // 10**9 + 19*10**9 * e**(fraction_cap_left)
    1_000_000_000_u64
        + ((19_000_000_000_f64) * (2.73_f64.powf((cap_left.clone() as f64 / INITIAL_CAP as f64) as f64)))
            as u64
}

#[program]
pub mod solana_ubi {
    use super::*;
    use std::ops::Div;
    use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

    pub fn mint_token(ctx: Context<MintUBI>, _gatekeeper: Pubkey) -> Result<u8> {
        let now_ts = Clock::get().unwrap().unix_timestamp;

        let state = &mut ctx.accounts.state;
        let ubi_info = &mut ctx.accounts.ubi_info;

        // variable rate starts at ~50 tok per day (9 decimal places)
        // daily rate * secs elapsed / secs in a day
        let amount = rate(&state.cap_left) * (&now_ts - &ubi_info.last_issuance).div(86400) as u64;

        let seeds = &[MINTER.as_bytes(), &[255]];
        let signer = &[&seeds[..]];
        let cpi_accounts = MintTo {
            mint: ctx.accounts.ubi_mint.to_account_info(),
            to: ctx.accounts.ubi_token_account.to_account_info(),
            authority: ctx.accounts.mint_signer.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount.clone())?;

        ubi_info.last_issuance = now_ts;
        state.cap_left = state.cap_left.saturating_sub(amount as u128);

        Ok(0)
    }

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<u8> {
        let now_ts: i64 = Clock::get().unwrap().unix_timestamp;
        let acc = &mut ctx.accounts.ubi_info;

        acc.last_issuance = now_ts - 24 * 60 * 60;

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user_authority.key(),
            &ctx.accounts.platform_fee_account.key(),
            (0.001 * LAMPORTS_PER_SOL as f32) as u64,
        );

        match anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user_authority.to_account_info(),
                ctx.accounts.platform_fee_account.to_account_info(),
            ],
        ).is_ok() {
            true => {return Ok(0)}
            false => {panic!("not enough SOL")}
        };
    }
}

#[derive(Accounts)]
#[instruction(_gatekeeper: Pubkey)]
pub struct MintUBI<'info> {
    /// CHECK: x
    #[account(seeds = [MINTER.as_bytes()], bump)]
    mint_signer: AccountInfo<'info>,
    #[account(mut, constraint = ubi_mint.mint_authority == COption::Some(* mint_signer.key))]
    pub ubi_mint: Account<'info, Mint>,
    /// CHECK: x
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    #[account(
        mut,
        token::mint = ubi_mint,
        token::authority = user_authority
    )]
    pub ubi_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = Clock::get().unwrap().unix_timestamp.gt(&(ubi_info.last_issuance + 23*3600)),
        seeds = [UBI_INFO.as_bytes(), &user_authority.key.to_bytes()],
        bump
    )]
    pub ubi_info: Account<'info, UBIInfo>,
    #[account(mut, seeds = [STATE.as_bytes()], bump)]
    pub state: Account<'info, State>,
    ///CHECK: x
    #[account(
        constraint =
            _gatekeeper.key().to_string() == "uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv" &&
            Gateway::verify_gateway_token_account_info(
                &gateway_token,
                &user_authority.key,
                &_gatekeeper,
                None,
            ).is_ok()
    )]
    pub gateway_token: AccountInfo<'info>,
    /// CHECK: x
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(
        init,
        payer = user_authority,
        space = 8 + UBIInfo::MAX_SIZE,
        seeds = [UBI_INFO.as_bytes(), &user_authority.key.to_bytes()],
        bump
    )]
    pub ubi_info: Account<'info, UBIInfo>,
    /// CHECK: x
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    /// CHECK: x
    #[account(mut, constraint=platform_fee_account.key.to_string() == "DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv")]
    pub platform_fee_account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct UBIInfo {
    last_issuance: i64,
}

impl UBIInfo {
    pub const MAX_SIZE: usize = 8;
}

#[account]
pub struct State {
    cap_left: u128,
}

impl State {
    pub const MAX_SIZE: usize = 16;
}
