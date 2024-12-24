<script lang="ts" setup>
import type {EventType} from "#types";

const RESULT_MAP: Record<string, string> = {
  first_row: 'первую строку',
  second_row: 'вторую строку',
  third_row: 'третью строку',
  full_card: 'всю карточку',
};

defineProps<{
  data: EventType;
}>();
</script>

<template>
  <div
    class="!h-32 !w-64 border rounded-2xl !flex flex-col p-2 text-sm"
    :class="{
      'bg-green-200': data.name === 'faster_user',
      'bg-purple-200': (data.name !== 'faster_user' && data.name !== 'fastest_user') && !data.data.completed,
      'bg-yellow-400': data.name === 'fastest_user' || (data.name !== 'faster_user' && data.data.completed),
    }"
  >
    <div class="flex items-center gap-2 mb-auto">
      <Avatar :image="data.data.user.avatar" size="large" shape="circle" />
      <div class="flex flex-col">
        <span class="font-semibold text-ellipsis overflow-hidden">{{ data.data.user.firstName }} {{ data.data.user.lastName }}</span>
        <span class="opacity-60 text-ellipsis overflow-hidden">{{ data.data.user.email }}</span>
      </div>
    </div>
    <Divider class="before:!border-surface-300 !mb-2" />
    <span v-if="data.name === 'faster_user' || data.name === 'fastest_user'" class="block pb-1">
      {{ data.name === 'faster_user' ? 'Самый быстрый ответ' : 'Самая быстрая реакция в игре' }}
      <br />
      Всего за {{ (data.data.duration / 1000).toFixed(2) }}c
    </span>
    <template v-else>
      <span v-if="!data.data.completed" class="block pb-1">
        Почти заполнил {{ RESULT_MAP[data.name] }}
      </span>
      <span v-else class="block pb-1">
        Заполнил {{ RESULT_MAP[data.name] }}!!!
      </span>
    </template>
  </div>
</template>
