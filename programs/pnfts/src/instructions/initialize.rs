use anchor_lang::prelude::*;
use crate::state::GlobalPool;
use crate::constant::GLOBAL_AUTHORITY_SEED;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        seeds = [GLOBAL_AUTHORITY_SEED],
        bump,
        space = GlobalPool::DATA_SIZE
    )]
    pub global_pool: Account<'info, GlobalPool>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let global_pool = &mut ctx.accounts.global_pool;
    global_pool.admin = ctx.accounts.admin.key();
    global_pool.total_pnft_staked_count = 0;
    global_pool.extra = 0;
    Ok(())
}

