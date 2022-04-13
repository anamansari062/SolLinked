import { web3 } from '@project-serum/anchor'
import { useWorkspace } from '@/composables'
import { Post } from '@/models'

export const sendPost = async(tag, title, content) => {
    const { wallet, program } = useWorkspace()
    const post = web3.Keypair.generate()

    await program.value.rpc.sendPost(tag, title, content, {
        accounts: {
            author: wallet.value.publicKey,
            post: post.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [post]
    })

    const postAccount = await program.value.account.post.fetch(post.publicKey)
    console.log(postAccount)
    console.log(new Post(post.publicKey, postAccount))
    return new Post(post.publicKey, postAccount)
}