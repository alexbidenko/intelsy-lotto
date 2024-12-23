import {type BoardType, GameStateVariant, type UserType} from '#types';

export const useGameStore = defineStore('game', () => {
  const ws = useWsStore();

  const userSocket = ws.user();

  const board = ref<BoardType>();
  const gameState = ref(GameStateVariant.UNKNOWN);
  const values = reactive(new Set<number>());
  const choices = reactive(new Set<number>());
  const fastestUser = ref<UserType>();

  const loadBoard = async () => {
    if (board.value?.length) return board.value;

    return GameAPI.board().then((data) => {
      board.value = data;
      return data;
    });
  };

  const loadValues = async () => {
    if (values.size) return [...values];

    return GameAPI.values().then((data) => {
      data.forEach((el) => values.add(el.value));
      return data;
    });
  };

  const loadChoices = async () => {
    if (choices.size) return [...choices];

    return GameAPI.getChoices().then((data) => {
      data.forEach((el) => choices.add(el.value));
      return data;
    });
  };

  const loadGame = async () => {
    if (gameState.value !== GameStateVariant.UNKNOWN) return gameState.value;

    return GameAPI.gameState().then(async (data) => {
      gameState.value = data.value;

      if (gameState.value !== GameStateVariant.FINISHED) {
        await Promise.all([
          loadBoard(),
          loadValues(),
          loadChoices(),
        ]);
      }

      return data;
    });
  };

  userSocket.on('state', (data) => {
    gameState.value = data.value;

    if (gameState.value === GameStateVariant.FINISHED) {
      values.clear();
      choices.clear();
      board.value = undefined;
    } else if (gameState.value === GameStateVariant.PROCESSED) {
      loadBoard();
      loadValues();
      loadChoices();
    }
  });

  userSocket.on('value', (data) => {
    values.add(data.value);
  });

  userSocket.on('faster_user', (data) => {
    fastestUser.value = data.value;
  });

  return {
    gameState,
    board,
    values,
    choices,
    fastestUser,

    loadGame,
  };
});
