<script setup>
import { computed, toRefs } from 'vue'
import PostCard from '@/components/PostCard'


const props = defineProps({
    posts: Array,
    loading: Boolean,
})

const { posts, loading } = toRefs(props)
const orderedPosts = computed(() => {
    return posts.value.slice().sort((a, b) => b.timestamp - a.timestamp)
})
</script>

<template>
    <div v-if="loading" class="p-8 text-gray-500 text-center">
        Loading...
    </div>
    <div v-else class="divide-y">
        <post-card v-for="post in orderedPosts" :key="post.key" :post="post"></post-card>
    </div>
</template>
