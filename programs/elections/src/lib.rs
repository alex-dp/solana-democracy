use anchor_lang::prelude::*;
use election_accounts::*;

declare_id!("4EnL8KhUvhEVBsRCeAxdtzVgiSphXqDPJqUFnwszEJji");

#[program]
pub mod elections {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn make_trust_mirror(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn create_council(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn destroy_old_preference(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn destroy_old_pool(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    /// should be shielded
    pub fn cast_preference(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn pool_to_composition(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
