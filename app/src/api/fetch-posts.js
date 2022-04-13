import { useWorkspace } from '@/composables'
import { Post } from '@/models'
import bs58 from 'bs58'


export const fetchPosts = async(filters = []) => {
    const { program } = useWorkspace()
    const post = await program.value.account.post.all(filters);
    return post.map(post => new Post(post.publicKey, post.account))
}

export const authorFilter = authorBase58PublicKey => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: authorBase58PublicKey,
    }
})

export const tagFilter = tag => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.
            8 + // Timestamp.
            4, // Tag string prefix.
        bytes: bs58.encode(Buffer.from(tag)),
    }
})