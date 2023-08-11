use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer};
use solana_gateway::Gateway;
use std::mem::size_of;
use std::str::FromStr;

declare_id!("78CbaxW47AoFLNqMPQNMUMSYhtbpGJA2pfdXHUExxz6o");

const STATE: &str = "d";
const PROPOSAL: &str = "p";
const SIGNATURE: &str = "s";
const REGIONS: &str = "r";

const FEE_ADDRESS: &str = "DF9ni5SGuTy42UrfQ9X1RwcYQHZ1ZpCKUgG6fWjSLdiv";
const ISC_MINT: &str = "J9BcrQfX4p9D1bvLzRNCbMDv8f44a9LFdeqNE4Yk2WMD";
const PLATFORM_ISC: &str = "FKaxZ2sxmkQBTTqyPoWsRP6CiEHRotMppcis6zewdzoM";

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
pub mod solana_petition {
    use super::*;

    pub fn initialize_region(ctx: Context<InitializeRegion>, description: String) -> Result<()> {
        let acc = &mut ctx.accounts.state;
        let gk = &ctx.accounts.gatekeeper;
        let active_regions = &mut ctx.accounts.active_regions;
        let user_auth = &mut ctx.accounts.user_authority;
        let sp = &mut ctx.accounts.system_program;
        let gk_link = &mut ctx.accounts.gk_link;

        acc.region = match active_regions.list.last() {
            None => 0,
            Some(x) => x + 1,
        };
        acc.description = description;
        acc.live_proposals = vec![];
        acc.closed_proposals = vec![];
        acc.gatekeeper = gk.key.clone();
        acc.last_id = 0;

        resize(
            &mut active_regions.to_account_info(),
            size_of::<u8>() as i16,
            user_auth,
            &mut sp.to_account_info(),
        );

        active_regions.list.push(acc.region.clone());

        gk_link.region = acc.region.clone();
        Ok(())
    }

    pub fn initialize_reg_list(ctx: Context<IRL>) -> Result<()> {
        let acc = &mut ctx.accounts.active_regions;

        acc.list = vec![];
        Ok(())
    }

    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        region: u8,
        title: String,
        link: String,
        expiry: i64,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let state = &mut ctx.accounts.regional_state;
        let user_auth = &mut ctx.accounts.user_authority;
        let sp = &mut ctx.accounts.system_program;

        proposal.id = &state.last_id + 1;
        proposal.creator = *user_auth.key;
        proposal.title = title;
        proposal.link = link;
        proposal.region = region;
        proposal.expiry = expiry;
        proposal.closed = false;
        proposal.signatures = 0;

        resize(
            &mut state.to_account_info(),
            size_of::<u32>() as i16,
            user_auth,
            &mut sp.to_account_info(),
        );
        state.live_proposals.push(proposal.id.clone());
        state.last_id = proposal.id.clone();

        let cpi_accounts = Transfer {
            from: ctx.accounts.owner_isc.to_account_info(),
            to: ctx.accounts.platform_isc.to_account_info(),
            authority: user_auth.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, 2 * 10_u64.pow(6))?;

        Ok(())
    }

    pub fn sign_proposal(ctx: Context<SignProposal>) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let user_auth = &mut ctx.accounts.user_authority;
        let state = &mut ctx.accounts.regional_state;

        if Clock::get().unwrap().unix_timestamp.gt(&proposal.expiry) {
            return close_proposal(Context {
                program_id: ctx.program_id,
                accounts: &mut CloseProposal {
                    creator: user_auth.to_owned(),
                    proposal: proposal.clone(),
                    regional_state: state.clone(),
                },
                remaining_accounts: &[],
                bumps: ctx.bumps,
            });
        }

        let gt = &mut ctx.accounts.gateway_token;
        match Gateway::verify_gateway_token_account_info(
            &gt,
            &user_auth.key,
            &state.gatekeeper,
            None,
        )
        .is_ok()
        {
            true => {
                proposal.signatures = &proposal.signatures + 1;
                return Ok(());
            }
            false => {
                panic!("cannot verify token")
            }
        };
    }

    pub fn close_proposal(ctx: Context<CloseProposal>) -> Result<()> {
        let prop = &mut ctx.accounts.proposal;
        let state = &mut ctx.accounts.regional_state;

        prop.closed = true;

        state.live_proposals.retain(|x| x != &prop.id);
        state.closed_proposals.push(prop.id.clone());
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(description: String)]
pub struct InitializeRegion<'info> {
    #[account(
        init,
        payer = user_authority,
        space = 8 + State::MIN_SIZE + description.len(),
        seeds = [STATE.as_bytes(), &match active_regions.list.last() {None => {0} Some(x) => {x+1}}.to_be_bytes()],
        bump,
        constraint = description.len() < 25
    )]
    pub state: Account<'info, State>,
    /// CHECK: x
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [REGIONS.as_bytes()],
        bump
    )]
    pub active_regions: Account<'info, ActiveRegions>,
    /// CHECK: x
    #[account()]
    pub gatekeeper: AccountInfo<'info>,
    #[account(
        init,
        payer = user_authority,
        space = 8 + 1,
        seeds = [&gatekeeper.key.to_bytes()],
        bump
    )]
    pub gk_link: Account<'info, GKLink>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IRL<'info> {
    ///CHECK:
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    #[account(
    init,
    payer = user_authority,
    space = 8 + ActiveRegions::MIN_SIZE + 4,
    seeds = [REGIONS.as_bytes()],
    bump
    )]
    pub active_regions: Account<'info, ActiveRegions>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(region: u8, title: String, link: String, expiry: i64)]
pub struct CreateProposal<'info> {
    #[account(
        init,
        payer = user_authority,
        space = 8 + Proposal::MIN_SIZE + title.len() + link.len() + 4,
        seeds = [PROPOSAL.as_bytes(), &region.to_be_bytes(), &(&regional_state.last_id+1).to_be_bytes()],
        bump,
        constraint = Clock::get().unwrap().unix_timestamp.lt(&(expiry + 24*3600))
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(
        mut,
        seeds = [STATE.as_bytes(), &region.to_be_bytes()],
        bump
    )]
    pub regional_state: Account<'info, State>,
    /// CHECK:
    #[account(
        constraint = Gateway::verify_gateway_token_account_info(
            &gateway_token,
            &user_authority.key,
            &regional_state.gatekeeper,
            None
        ).is_ok()
    )]
    pub gateway_token: AccountInfo<'info>,
    /// CHECK: x
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    /// CHECK: x
    #[account(mut, address = Pubkey::from_str(FEE_ADDRESS).ok().unwrap())]
    pub platform_fee_account: AccountInfo<'info>,

    #[account(
        mut,
        token::mint = isc_mint,
        token::authority = user_authority,
    )]
    pub owner_isc: Account<'info, TokenAccount>,

    #[account(
        mut,
        address = Pubkey::from_str(PLATFORM_ISC).ok().unwrap()
    )]
    pub platform_isc: Account<'info, TokenAccount>,

    #[account(
        mut,
        address = Pubkey::from_str(ISC_MINT).ok().unwrap()
    )]
    pub isc_mint: Account<'info, Mint>,

    /// CHECK: x
    #[account(constraint = token_program.key == &token::ID)]
    pub token_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SignProposal<'info> {
    #[account(
        mut,
        seeds = [PROPOSAL.as_bytes(), &proposal.region.to_be_bytes(), &proposal.id.to_be_bytes()],
        bump,
        constraint = !proposal.closed
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(
        init,
        payer = user_authority,
        space = 8,
        seeds = [SIGNATURE.as_bytes(), &user_authority.key().to_bytes(), &proposal.region.to_be_bytes(), &proposal.id.to_be_bytes()],
        bump
    )]
    pub signature: Account<'info, Signature>,
    /// CHECK:
    #[account()]
    pub gateway_token: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [STATE.as_bytes(), &proposal.region.to_be_bytes()],
        bump
    )]
    pub regional_state: Account<'info, State>,
    /// CHECK: x
    #[account(signer, mut)]
    pub user_authority: AccountInfo<'info>,
    /// CHECK: x
    #[account(mut, address = Pubkey::from_str(FEE_ADDRESS).ok().unwrap())]
    pub platform_fee_account: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseProposal<'info> {
    /// CHECK: x
    #[account(signer, mut)]
    pub creator: AccountInfo<'info>,
    #[account(
    mut,
    seeds = [PROPOSAL.as_bytes(), &proposal.region.to_be_bytes(), &proposal.id.to_be_bytes()],
    bump,
    has_one = creator,
    constraint =
        !proposal.closed &&
        Clock::get().unwrap().unix_timestamp.gt(&proposal.expiry)
    )]
    pub proposal: Account<'info, Proposal>,
    #[account(
    mut,
    seeds = [STATE.as_bytes(), &proposal.region.to_be_bytes()],
    bump
    )]
    pub regional_state: Account<'info, State>,
}

//proposal IDs. dynamic size
#[account]
pub struct State {
    live_proposals: Vec<u32>,
    closed_proposals: Vec<u32>,
    region: u8,
    description: String,
    gatekeeper: Pubkey,
    last_id: u32,
}

impl State {
    pub const MIN_SIZE: usize = 4 + 4 + 1 + 4 + 32 + 4;
}

//empty. valid if exists
#[account]
pub struct Signature {}

//size is variable, not dynamic
#[account]
pub struct Proposal {
    id: u32,
    creator: Pubkey,
    title: String,
    link: String,
    region: u8,
    expiry: i64,
    closed: bool,
    signatures: u32,
}

impl Proposal {
    pub const MIN_SIZE: usize = 4 + 32 + 4 + 4 + 1 + 8 + 1 + 4;
}

#[account]
pub struct ActiveRegions {
    list: Vec<u8>,
}

impl ActiveRegions {
    pub const MIN_SIZE: usize = 1;
}

#[account]
pub struct GKLink {
    region: u8,
}
