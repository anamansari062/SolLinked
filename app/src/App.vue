<script setup>
// import { useRoute } from 'vue-router'
import TheSidebar from './components/TheSidebar'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { initWallet } from 'solana-wallets-vue'
import { initWorkspace } from '@/composables'

import { WalletMultiButton} from 'solana-wallets-vue'



// const route = useRoute()

const heading = "SolLinked"

const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
]

initWallet({ wallets, autoConnect: true })
initWorkspace()


</script>

<template>
    <div class="e-card e-card-horizontal">

        <!-- Sidebar. -->
        <the-sidebar class="py-4 md:py-8 md:pl-4 md:pr-8 fixed w-20 md:w-64"></the-sidebar>

        <!-- Main -->
        <main class="flex-1 border-r border-l ml-20 md:ml-64 min-h-screen">
            <header class="flex space-x-6 items-center justify-between px-8 py-4 border-b">
                <div class="text-xl text-blue-700 font-bold" v-text="heading"></div>
                <div class="text-xl text-blue-700 font-bold">
                    <wallet-multi-button></wallet-multi-button>
                </div>
            </header>
            <router-view></router-view>
        </main>
    </div>
</template>
