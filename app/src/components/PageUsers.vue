<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts, authorFilter } from '@/api'
import { useFromRoute } from '@/composables'
import PostList from '@/components/PostList'
import PostSearch from '@/components/PostSearch'

// Data.
const router = useRouter()
const posts = ref([])
const loading = ref(true)
const author = ref('')
const viewedAuthor = ref('')

// Actions.
const search = () => {
    router.push(`/users/${author.value}`)
}

const fetchAuthorPosts = async () => {
    if (author.value === viewedAuthor.value) return
    try {
        loading.value = true
        const fetchedPosts = await fetchPosts([authorFilter(author.value)])
        posts.value = fetchedPosts
        viewedAuthor.value = author.value
    } finally {
        loading.value = false
    }
}

// Router hooks.
useFromRoute((route) => {
    author.value = route.params.author
    if (author.value) {
        fetchAuthorPosts()
    } else {
        posts.value = []
        viewedAuthor.value = ''
    }
})
</script>

<template>
    <post-search placeholder="public key" :disabled="! author" v-model="author" @search="search">
        <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
        </template>
    </post-search>
    <div v-if="viewedAuthor">
        <post-list :posts="posts" :loading="loading"></post-list>
        <div v-if="posts.length === 0" class="p-8 text-gray-500 text-center">
            User not found...
        </div>
    </div>
</template>
