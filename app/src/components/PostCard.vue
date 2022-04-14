<script setup>
import { ref, toRefs, computed } from 'vue'
import { useWorkspace } from '@/composables'
import PostFormUpdate from './PostFormUpdate'

const props = defineProps({
    post: Object,
})

const { post } = toRefs(props)
const { wallet } = useWorkspace()
const isMyPost = computed(() => wallet.value && wallet.value.publicKey.toBase58() === post.value.author.toBase58())
const authorRoute = computed(() => {
    if (isMyPost.value) {
        return { name: 'Profile' }
    } else {
        return { name: 'Users', params: { author: post.value.author.toBase58() } }
    }
})

const isEditing = ref(false)
</script>

<template>
    <post-form-update v-if="isEditing" :post="post" @close="isEditing = false"></post-form-update>
    <div class="px-8 py-4" v-else>
        <div class="flex justify-between">
            <div class="py-1">
                <h3 class="inline font-semibold" :title="post.author">
                    <router-link :to="authorRoute" class="hover:underline">
                        {{ post.author_display }}
                    </router-link>
                </h3>
                <span class="text-gray-500"> • </span>
                <time class="text-gray-500 text-sm" :title="post.created_at">
                    <router-link :to="{ name: 'Post', params: { post: post.publicKey.toBase58() } }" class="hover:underline">
                        {{ post.created_ago }}
                    </router-link>
                </time>
            </div>
            <div class="flex" v-if="isMyPost">
                <button @click="isEditing = true" class="flex px-2 rounded-full text-gray-500 hover:text-blue-700hover:bg-gray-100" title="Update Post">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 m-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        <p class="whitespace-pre-wrap break-all" v-text="post.title"></p>
        <p class="whitespace-pre-wrap break-all" v-text="post.content"></p>
        <router-link v-if="post.tag" :to="{ name: 'Topics', params: { tag: post.tag } }" class="inline-block mt-2 text-blue-700 hover:underline">
            #{{ post.tag }}
        </router-link>
        
    </div>
</template>
