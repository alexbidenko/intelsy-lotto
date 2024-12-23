<script lang="ts" setup>
import {type BoardType, GameStateVariant} from "#types";

const props = defineProps<{
  board: BoardType;
  choices: Set<number>;
  readonly?: boolean;
}>();

const gameStore = useGameStore();

const failedList = ref<[number, number][]>([]);

const onSelect = (value: number | null, i: number, j: number) => {
  if (!value || props.readonly) return;

  if (gameStore.gameState !== GameStateVariant.PROCESSED) return;

  if (gameStore.choices.has(value)) return;

  GameAPI.createChoice({ body: { value } }).then(() => {
    gameStore.values.add(value);
    gameStore.choices.add(value);
  }).catch(() => {
    failedList.value.push([i, j]);

    setTimeout(() => {
      failedList.value = failedList.value.filter(([x, y]) => x !== i || y !== j);
    }, 2000);
  });
};
</script>

<template>
  <div class="bg-surface-0 w-full relative rounded-2xl p-3 sm:p-6 md:p-8 flex flex-col gap-1 sm:gap-3 md:gap-4">
    <div v-for="(row, i) in board" :key="i" class="flex gap-1 sm:gap-3 md:gap-4 w-full">
      <component
        v-for="(item, j) in row"
        :key="j"
        :is="item && !readonly ? 'button' : 'div'"
        @click="onSelect(item, i, j)"
        class="text-surface-100 bg-current w-1/9 aspect-square text-lg sm:text-2xl md:text-3xl rounded-lg font-bold transition-all duration-300 flex items-center justify-center"
        :class="{
          'hover:text-surface-200': item && !choices.has(item),
          '!text-green-400 !rounded-1/2': choices.has(item),
          '!text-purple-400 !rounded-1/2': (readonly || gameStore.gameState === 'results') && gameStore.values.has(item) && !choices.has(item),
          'animate-wrong-clicked': failedList.some(([x, y]) => x === i && y === j),
        }"
      >
        <span
          class="text-black transition"
          :class="{ 'opacity-70': choices.has(item) }"
        >
          {{ item }}
        </span>
      </component>
    </div>
  </div>
</template>
