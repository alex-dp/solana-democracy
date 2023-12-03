use anchor_lang::prelude::*;

declare_id!("4oxsfZUZH6SJV4vEmGkJHNP5AcXdEYgXegfwpUPgnANx");

#[program]
pub mod census {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
