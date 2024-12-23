<script lang="ts" setup>
import background from '~/assets/images/background.png';
import loader from '~/assets/loader.lottie?url';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const FASTEST_USER_REPLICAS = [
  "Реакция быстрее света — ты точно из будущего!",
  "Ловкость рук, да не мошенничество — это про тебя!",
  "Ты словно молния, только круче!",
  "Киберпанковый рефлекс, никаких апгрейдов не нужно!",
  "Ты бы переплюнул любого гепарда на старте!",
  "Руки быстрее, чем интернет у провайдера!",
  "Твоя скорость заставила мое воображение перегреться!",
  "Ты двигаешься так быстро, что даже флеш позавидует!",
  "Секунды? Какие секунды? Ты мгновение воплоти!",
  "Ты — воплощение максимального FPS!",
  "Космические скорости — и это всё без ракеты!",
  "Кажется, ты взломал пространство и время ради скорости!",
  "Реакция уровня: сверхинтеллектуальный ИИ.",
  "Твои пальцы быстрее, чем курсор на экране!",
  "Скорость такая, что даже звуки отстают!",
  "Ты управляешь временем, иначе я объяснить не могу.",
  "Твоя реакция: уровень — джедай!",
  "Говорят, быстрее тебя только нейроны в мозге!",
  "Твои руки — настоящее искусство скорости!",
  "Ты движешься так быстро, что мир за тобой не успевает!",
];

const toast = useToast();
const gameStore = useGameStore();

watch(() => gameStore.fastestUser, () => {
  toast.add({
    severity: 'success',
    summary: FASTEST_USER_REPLICAS[Math.floor(Math.random() * FASTEST_USER_REPLICAS.length)],
    group: 'bc',
    life: 8000,
  });
});
</script>

<template>
  <main v-auto-animate class="flex items-center justify-center flex-1 p-3 sm:p-6 md:p-8">
    <div v-if="gameStore.board" class="relative flex items-center justify-center h-full w-full p-3 sm:p-6 md:p-8">
      <NuxtImg :src="background" format="webp" class="absolute h-full w-full rounded-2xl object-cover" />
      <Board :board="gameStore.board" :choices="gameStore.choices" class="shadow-2xl container" />
    </div>
    <div v-else class="h-full w-full bg-surface-100 flex flex-col items-center justify-center rounded-2xl">
      <DotLottieVue
        :src="loader"
        autoplay
        loop
        class="mb-6 w-80 max-w-full max-h-full"
      />
      <span class="text-xl text-slate-600 text-center">
        Ждите, магия скоро начнётся.
        <br />
        Её не надо торопить
      </span>
    </div>
  </main>
</template>
