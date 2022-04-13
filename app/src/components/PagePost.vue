<script setup>
import { ref, watchEffect } from 'vue'
import { PublicKey } from '@solana/web3.js'
import { getPost } from '@/api'
import { useFromRoute } from '@/composables'
import PostCard from '@/components/PostCard'

const postAddress = ref(null)
useFromRoute((route) => postAddress.value = route.params.post)

const loading = ref(false)
const post = ref(null)
watchEffect(async () => {
    try {
        loading.value = true
        post.value = await getPost(new PublicKey(postAddress.value))
    } catch (e) {
        post.value = null
    } finally {
        loading.value = false
    }
})

</script>

<template>
    <div v-if="loading" class="p-8 text-gray-500 text-center">
        Loading...
    </div>
    <div v-else-if="! post" class="p-8 text-gray-500 text-center">
        Post not found
    </div>
    <post-card v-else :post="post"></post-card>
</template>
