<script setup>
import { ref, watchEffect } from 'vue'
import { fetchPosts, authorFilter } from '@/api'
// import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'
import { useWorkspace } from '@/composables'


const posts = ref([])
const loading = ref(true)
const { wallet } = useWorkspace()


watchEffect(() => {
    if (! wallet.value) return
    fetchPosts([authorFilter(wallet.value.publicKey.toBase58())])
        .then(fetchedPosts => posts.value = fetchedPosts)
        .finally(() => loading.value = false)
})

// const addPost = post => posts.value.push(post)
</script>

<template>
    <!-- TODO: Check connected wallet -->
    <div v-if="wallet" class="border-b px-8 py-4 bg-green">
        {{ wallet.publicKey.toBase58() }}
    </div>
    <!-- <post-form @added="addPost"></post-form> -->
    <post-list :posts="posts" :loading="loading"></post-list>
</template>
