<script lang="ts" setup>
const userStore = useUserStore();
const gameStore = useGameStore();

await useAsyncData(() => Promise.all([
  userStore.loadUser(),
  gameStore.loadGame(),
]));
</script>

<template>
  <Html lang="ru" class="h-full"  />
  <Head>
    <Title>Intelsy Лото</Title>
  </Head>
  <Body class="h-full bg-white" />

  <NuxtRouteAnnouncer />

  <Header />

  <NuxtPage />

  <Toast position="bottom-center" />
  <Toast position="bottom-center" group="bc">
    <template #message="slotProps">
      <div v-if="gameStore.fastestUser" class="flex flex-col items-start flex-auto">
        <div class="flex items-center gap-2">
          <Avatar :image="gameStore.fastestUser.avatar" shape="circle" class="aspect-square" />
          <div class="flex flex-col">
            <span class="font-bold">{{ gameStore.fastestUser.firstName }} {{ gameStore.fastestUser.lastName }}</span>
            <span class="text-slate-600">{{ gameStore.fastestUser.email }}</span>
          </div>
        </div>
        <div class="font-medium text-lg py-2">{{ slotProps.message.summary }}</div>
      </div>
    </template>
  </Toast>
  <ConfirmDialog />
</template>

<style lang="scss">
html {
  font-size: calc(100vw / 2560 * 16);

  @media screen and (max-width: 1920px) {
    font-size: calc(100vw / 1920 * 16);
  }

  @media screen and (max-width: 1366px) {
    font-size: calc(100vw / 1366 * 16);
  }

  @media screen and (max-width: 1024px) {
    font-size: calc(100vw / 1024 * 16);
  }

  @media screen and (max-width: 768px) {
    font-size: calc(100vw / 768 * 16);
  }

  @media screen and (max-width: 540px) {
    font-size: calc(100vw / 540 * 16);
  }
}
</style>
