use anchor_lang::prelude::*;

declare_id!("Ht1487w1ipPZJ92wsmiqNXaZ3KjjuSRzd77hWATwpkFm");

#[program]
pub mod sampling {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
