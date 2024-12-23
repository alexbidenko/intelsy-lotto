<script lang="ts" setup>
import logo from '~/assets/images/logo.svg';

const gameStore = useGameStore();
const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <header class="h-20 flex items-center justify-between px-3 sm:px-6 md:px-8">
    <div class="flex items-center gap-3">
      <NuxtImg :src="logo" class="h-12" />
      <Tag v-if="route.path === '/admin'" :value="gameStore.gameState" class="uppercase" />
    </div>

    <div v-if="userStore.user" class="flex items-center gap-3">
      <div class="flex flex-col text-sm text-right">
        <span class="font-semibold">{{ userStore.user.firstName }} {{ userStore.user.lastName }}</span>
        <span class="text-slate-400">{{ userStore.user.email }}</span>
      </div>
      <Avatar :image="userStore.user.avatar" size="large" shape="circle" />
    </div>
  </header>
</template>
