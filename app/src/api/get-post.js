import { useWorkspace } from '@/composables'
import { Post } from '@/models'

export const getPost = async(publicKey) => {
    const { program } = useWorkspace()
    const account = await program.value.account.post.fetch(publicKey);
    return new Post(publicKey, account)
}