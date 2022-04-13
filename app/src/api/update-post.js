import { useWorkspace } from '@/composables'

export const updatePost = async(post, tag, title, content) => {
    const { wallet, program } = useWorkspace()
    await program.value.rpc.updatePost(tag, title, content, {
        accounts: {
            author: wallet.value.publicKey,
            post: post.publicKey,
        },
    })

    post.tag = tag
    post.title = title
    post.content = content
}