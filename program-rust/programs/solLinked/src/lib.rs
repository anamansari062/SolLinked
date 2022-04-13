use anchor_lang::prelude::*;

declare_id!("2YC5MHSsjY6G5nY2Ckmwso8C8Gr7SMYe1SUvyu1FrNzJ");

// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
// const MAX_USERNAME_LENGTH: usize = 15 * 4; //15 chars max. 
const MAX_TITLE_LENGTH: usize = 50 * 4; // 50 chars max.
const MAX_CONTENT_LENGTH: usize = 300 * 4; // 280 chars max.
const MAX_TAG_LENGTH: usize = 20 * 4; // 20 chars max.

impl Post {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        // + STRING_LENGTH_PREFIX + MAX_USERNAME_LENGTH //Username.
        + STRING_LENGTH_PREFIX + MAX_TAG_LENGTH // tag.
        + STRING_LENGTH_PREFIX + MAX_TITLE_LENGTH // Title.
        + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH; // Content.
        
}

#[program]
pub mod sol_linked {
    use super::*;

    pub fn send_post(ctx: Context<SendPost>, tag: String, title: String, content: String) -> Result<()> {
    let post: &mut Account<Post> = &mut ctx.accounts.post;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if title.chars().count() < 1 {
            return Err(error!(ErrorCode::TitleEmpty))
        }

        if title.chars().count() > 50 {
            return Err(error!(ErrorCode::TitleTooLong))
        }

        if content.chars().count() < 1 {
            return Err(error!(ErrorCode::ContentEmpty))
        }

        if content.chars().count() > 300 {
            return Err(error!(ErrorCode::ContentTooLong))
        }

        if tag.chars().count() > 20 {
            return Err(error!(ErrorCode::TagTooLong))
        }

        post.author = *author.key;
        post.timestamp = clock.unix_timestamp;
        post.title = title;
        post.content = content;
        post.tag = tag;

        Ok(())
    }

    pub fn update_post(ctx: Context<UpdatePost>, tag: String, title: String, content: String) -> Result<()> {
        let post: &mut Account<Post> = &mut ctx.accounts.post;

        if title.chars().count() < 1 {
            return Err(error!(ErrorCode::TitleEmpty))
        }

        if title.chars().count() > 50 {
            return Err(error!(ErrorCode::TitleTooLong))
        }

        if content.chars().count() < 1 {
            return Err(error!(ErrorCode::ContentEmpty))
        }

        if content.chars().count() > 300 {
            return Err(error!(ErrorCode::ContentTooLong))
        }

        if tag.chars().count() > 20 {
            return Err(error!(ErrorCode::TagTooLong))
        }
        
        post.title = title;
        post.content = content;
        post.tag = tag;

        Ok(())
    }
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub timestamp: i64,
    // pub username: String,
    pub tag: String,
    pub title: String,
    pub content: String,
    
}

#[derive(Accounts)]
pub struct UpdatePost<'info> {
    #[account(mut, has_one = author)]
    pub post: Account<'info, Post>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct SendPost<'info> {
    #[account(init, payer = author, space = Post::LEN)]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The provided title should be 50 characters long maximum.")]
    TitleTooLong,
    #[msg("The provided content should be 300 characters long maximum.")]
    ContentTooLong,
    #[msg("The provided tag should be 20 characters long maximum.")]
    TagTooLong,
    #[msg("Title cannot not be empty.")]
    TitleEmpty,
    #[msg("Content cannot be empty.")]
    ContentEmpty,
}