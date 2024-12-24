use anchor_lang::prelude::*;
use anchor_lang::AnchorDeserialize;

pub mod constant;
pub mod error;
pub mod instructions;
pub mod state;
use constant::*;
use error::*;
use instructions::*;
use state::*;


declare_id!("EZaFUADP5cfNr7ThU3NFSzCvKwx8g5Hk7BKyayAHmDrB");

#[program]
pub mod pnfts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::initialize(ctx)
    }

    pub fn lock_pnft(ctx: Context<LockPNFT>) -> Result<()> {
        lock_pnft::lock_pnft_handler(ctx)
    }

    pub fn unlock_pnft(ctx: Context<UnlockPNFT>) -> Result<()> {
        unlock_pnft::unlock_pnft_handler(ctx)
    }
}

