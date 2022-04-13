<script setup>
import { ref } from 'vue'
import { fetchPosts } from '@/api'
import PostForm from '@/components/PostForm'
import PostList from '@/components/PostList'

const posts = ref([])
const loading = ref(true)
fetchPosts()
    .then(fetchedPosts => posts.value = fetchedPosts)
    .finally(() => loading.value = false)

const addPost = post => posts.value.push(post)
</script>

<template>
    <post-form @added="addPost"></post-form>
    <post-list :posts="posts" :loading="loading"></post-list>
</template>
