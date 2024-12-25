<script lang="ts" setup>
import {type BoardType, GameStateVariant} from "#types";
import { Swiper, SwiperSlide } from 'swiper/vue';
import {Mousewheel} from "swiper/modules";
import 'swiper/css';

const toast = useToast();
const confirm = useConfirm();
const gameStore = useGameStore();
const adminStore = useAdminStore();

const value = ref();
const userBoard = ref<{ board: BoardType; choices: Set<number>; visible: boolean }>();

const startGame = () => adminStore.updateState(GameStateVariant.PROCESSED);

const finishGame = () => {
  confirm.require({
    header: 'Вы уверены, что хотите перейти к результатам?',
    message: 'Это не позволит продолжать игру и покажет участникам все результаты',
    accept: () => adminStore.updateState(GameStateVariant.RESULTS),
    acceptLabel: 'Подтвердить',
    rejectLabel: 'Отменить',
  });
}

const resetGame = () => {
  confirm.require({
    header: 'Вы уверены, что хотите завершить игру?',
    message: 'Это сбросит все сгенерированные карточки и значения!',
    accept: () => adminStore.updateState(GameStateVariant.FINISHED),
    acceptLabel: 'Подтвердить',
    rejectLabel: 'Отменить',
  });
};

const sendValue = () => {
  if (!value.value || gameStore.gameState !== GameStateVariant.PROCESSED) return;

  value.value = Number.parseInt(value.value);
  if (!value.value || isNaN(value.value)) return;

  if (gameStore.values.has(value.value)) {
    toast.add({
      severity: 'error',
      summary: 'Такое значение уже использовалось',
      life: 5000,
    });
    return;
  }

  adminStore.sendValue(value.value);
  value.value = undefined;
};

const loadUserBoard = (userId: number) => {
  AdminAPI.userBoard({ query: { user_id: userId } }).then((data) => {
    userBoard.value = {
      ...data,
      choices: new Set(data.choices),
      visible: true,
    };
  }).catch(() => {
    toast.add({
      severity: 'error',
      summary: 'Карточка пользователя не найдена',
      life: 5000,
    });
  });
};

onMounted(() => {
  adminStore.loadMembers();
  adminStore.loadEvents();
});
</script>

<template>
  <main class="container mx-auto text-3xl flex flex-col gap-4 py-12 px-5 sm:px-6 md:px-8">
    <h2 class="text-2xl font-bold my-0">Управление игрой</h2>
    <div class="flex gap-6 flex-col md:flex-row">
      <div class="flex flex-col gap-6 flex-1">
        <Button v-if="gameStore.gameState === GameStateVariant.FINISHED" @click="startGame" label="Начать" />
        <Button
          v-if="gameStore.gameState === GameStateVariant.PROCESSED"
          @click="finishGame"
          label="Результаты"
        />
        <Button
          v-if="gameStore.gameState === GameStateVariant.RESULTS"
          @click="resetGame"
          label="Завершить"
        />
      </div>

      <form @submit.prevent="sendValue" class="flex-1">
        <InputGroup>
          <InputNumber v-model="value" :readonly="gameStore.gameState !== GameStateVariant.PROCESSED" placeholder="Новое значение" />
          <Button type="submit" label="Отправить" />
        </InputGroup>
      </form>
    </div>

    <Divider class="before:!border-surface-700" />

    <h2 class="text-2xl font-bold my-0">Победители</h2>
    <Swiper
      slides-per-view="auto"
      :modules="[Mousewheel]"
      mousewheel
      class="w-full"
    >
      <template v-if="adminStore.winners.length">
        <SwiperSlide
          v-for="(item, index) in adminStore.winners"
          :key="item._id"
          class="!w-fit"
          :class="{ 'mr-3': index !== adminStore.winners.length - 1 }"
        >

          <EventCard :data="item" />
        </SwiperSlide>
      </template>
      <SwiperSlide v-else class="!h-32 !w-64 border rounded-lg !flex items-center justify-center">
        <span class="opacity-50 text-sm">Список победителей пустой</span>
      </SwiperSlide>
    </Swiper>

    <Divider class="before:!border-surface-700" />

    <h2 class="text-2xl font-bold my-0">Игровые события</h2>
    <Swiper
      slides-per-view="auto"
      :modules="[Mousewheel]"
      mousewheel
      class="w-full"
    >
      <template v-if="adminStore.events.length">
        <SwiperSlide
          v-for="(item, index) in adminStore.events"
          :key="item._id"
          class="!w-fit"
          :class="{ 'mr-3': index !== adminStore.events.length - 1 }"
        >
          <EventCard :data="item" />
        </SwiperSlide>
      </template>
      <SwiperSlide v-else class="!h-32 !w-64 border rounded-lg !flex items-center justify-center">
        <span class="opacity-50 text-sm">Список событий пустой</span>
      </SwiperSlide>
    </Swiper>

    <Divider class="before:!border-surface-700" />

    <h2 class="text-2xl font-bold my-0">Использованные значения</h2>
    <div v-if="gameStore.values.size" class="flex flex-wrap gap-6">
      <Tag v-for="item in gameStore.values" :key="item" :value="item" class="!text-3xl !px-5" />
    </div>
    <p v-else class="m-0 text-lg opacity-80">Нет использованных значений</p>

    <Divider class="before:!border-surface-700" />

    <h2 class="text-2xl font-bold my-0">Участники онлайн</h2>
    <div v-if="adminStore.members.size" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
      <button
        v-for="[id, user] in adminStore.members"
        :key="id"
        @click="loadUserBoard(id)"
        class="rounded-3xl bg-surface-200 p-2 flex items-center gap-2"
      >
        <Avatar :image="user.avatar" shape="circle" size="large" />
        <div class="flex flex-col text-sm whitespace-nowrap flex-1 overflow-hidden text-left">
          <span class="font-semibold text-ellipsis overflow-hidden">{{ user.firstName }} {{ user.lastName }}</span>
          <span class="opacity-60 text-ellipsis overflow-hidden">{{ user.email }}</span>
        </div>
      </button>
    </div>
    <p v-else class="m-0 text-lg opacity-80">Нет участников онлайн</p>

    <Dialog v-if="userBoard" header="Доска участника" v-model:visible="userBoard.visible" modal class="w-full">
      <Board :board="userBoard.board" :choices="userBoard.choices" readonly class="border border-surface-300" />
    </Dialog>
  </main>
</template>
