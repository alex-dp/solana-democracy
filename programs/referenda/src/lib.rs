use anchor_lang::prelude::*;

declare_id!("B7smquytE2vHW6PiMdKBXvJsgdgJEBk8n87y2c2HxqXi");

#[program]
pub mod referenda {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
