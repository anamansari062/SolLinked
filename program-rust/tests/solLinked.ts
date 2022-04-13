import { Program } from "@project-serum/anchor";
import { SolLinked } from "../target/types/sol_linked";
import * as bs58 from "bs58";

const anchor = require("@project-serum/anchor");
const assert = require("assert");

describe("solLinked", () => {
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SolLinked as Program<SolLinked>

  it('can send a new post', async () => {
      const post = anchor.web3.Keypair.generate();
      await program.rpc.sendPost('Test Tag', 'Test title', 'Test Content', {
          accounts: {
              post: post.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [post],
      });
      const postAccount = await program.account.post.fetch(post.publicKey);
  	  console.log(postAccount);

      assert.equal(postAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
      assert.equal(postAccount.title, 'Test title');
      assert.equal(postAccount.content, 'Test Content');
      assert.equal(postAccount.tag, 'Test Tag');
      assert.ok(postAccount.timestamp);
  });

  it('can send a new post without tag', async () => {
      const post = anchor.web3.Keypair.generate();
      await program.rpc.sendPost('', 'Test title', 'Test Content',  {
          accounts: {
              post: post.publicKey,
              author: program.provider.wallet.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
          },
          signers: [post],
      });
      const postAccount = await program.account.post.fetch(post.publicKey);
  	  console.log(postAccount);

      assert.equal(postAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
      assert.equal(postAccount.title, 'Test title');
      assert.equal(postAccount.content, 'Test Content');
      assert.equal(postAccount.tag, '');
      assert.ok(postAccount.timestamp);
  });

  it('can send a new post from a different author', async () => {
    // Generate another user and airdrop them some SOL.
    const otherUser = anchor.web3.Keypair.generate();

    // Call the "Sendpost" instruction on behalf of this other user.
    const post = anchor.web3.Keypair.generate();
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    await program.provider.connection.confirmTransaction(signature);
    
    await program.rpc.sendPost('Test Tag', 'Test title', 'Test Content',  {
        accounts: {
            post: post.publicKey,
            author: otherUser.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [otherUser, post],
    });

    // Fetch the account details of the created post.
    const postAccount = await program.account.post.fetch(post.publicKey);

    // Ensure it has the right data.
    assert.equal(postAccount.author.toBase58(), otherUser.publicKey.toBase58());
    assert.equal(postAccount.title, 'Test title');
    assert.equal(postAccount.content, 'Test Content');
    assert.equal(postAccount.tag, 'Test Tag');

    assert.ok(postAccount.timestamp);
  });

  it('cannot provide a title with more than 50 characters', async () => {
    try {
        const post = anchor.web3.Keypair.generate();
        const titleWith51Chars = 'x'.repeat(51);
        await program.rpc.sendPost('Test tag', titleWith51Chars, 'Test Content',  {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [post],
        });
    } catch (error) {
        assert.equal(error.msg, 'The provided title should be 50 characters long maximum.');
        return;
    }

    assert.fail('The instruction should have failed with a 51-character topic.');
  });

  it('cannot provide a content with more than 300 characters', async () => {
    try {
        const post = anchor.web3.Keypair.generate();
        const contentWith301Chars = 'x'.repeat(301);
        await program.rpc.sendPost('Test tag', 'Test title', contentWith301Chars,  {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [post],
        });
    } catch (error) {
        assert.equal(error.msg, 'The provided content should be 300 characters long maximum.');
        return;
    }

    assert.fail('The instruction should have failed with a 301-character content.');
  });

  it('cannot provide a tag with more than 20 characters', async () => {
    try {
        const post = anchor.web3.Keypair.generate();
        const tagWith20Chars = 'x'.repeat(21);
        await program.rpc.sendPost(tagWith20Chars, 'Test title', 'Test Content',  {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [post],
        });
    } catch (error) {
        assert.equal(error.msg, 'The provided tag should be 20 characters long maximum.');
        return;
    }

    assert.fail('The instruction should have failed with a 21-character tag.');
  });


it('cannot provide an epmty title', async () => {
    try {
        const post = anchor.web3.Keypair.generate();
        await program.rpc.sendPost('Test tag', '', 'Test Content', {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [post],
        });
    } catch (error) {
        assert.equal(error.msg, 'Title cannot not be empty.');
        return;
    }

    assert.fail('The instruction should have failed with an epmty content.');
  });


it('cannot provide an empty content', async () => {
    try {
        const post = anchor.web3.Keypair.generate();
        await program.rpc.sendPost('Test tag', 'Test title', '', {
            accounts: {
                post: post.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [post],
        });
    } catch (error) {
        assert.equal(error.msg, 'Content cannot be empty.');
        return;
    }

    assert.fail('The instruction should have failed with an empty content.');
  });

  it('can fetch all posts', async () => {
    const postAccounts = await program.account.post.all();
    assert.equal(postAccounts.length, 3);
  });

  it('can filter posts by author', async () => {
    const authorPublicKey = program.provider.wallet.publicKey
    const postAccounts = await program.account.post.all([
        {
            memcmp: {
                offset: 8, // Discriminator.
                bytes: authorPublicKey.toBase58(),
            }
        }
    ]);

    assert.equal(postAccounts.length, 2);
    assert.ok(postAccounts.every(postAccount => {
        return postAccount.account.author.toBase58() === authorPublicKey.toBase58()
    }))
  });

  it('can filter posts by tags', async () => {
    const postAccounts = await program.account.post.all([
        {
            memcmp: {
                offset: 8 + // Discriminator.
                    32 + // Author public key.
                    8 + // Timestamp.
                    4, // tag string prefix.
                bytes: bs58.encode(Buffer.from('Test Tag')),
            }
        }
    ]);

    assert.equal(postAccounts.length, 1);
    assert.ok(postAccounts.every(postAccount => {
        return postAccount.account.tag === 'Test Tag'
    }))
  });

});
