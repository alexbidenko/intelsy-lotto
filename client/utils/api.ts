import type {BoardType, EventType, UserType} from '#types';

export const CommonAPI = {
  user: StrictFetch.prepare({
    url: 'auth',
  }),
};

export const GameAPI = {
  gameState: StrictFetch.prepare({
    url: 'game/state',
  }),
  board: StrictFetch.prepare<BoardType>({
    url: 'game/board',
  }),
  values: StrictFetch.prepare<{ value: number }[]>({
    url: 'game/values',
  }),

  getChoices: StrictFetch.prepare<{ value: number }[]>({
    url: 'game/choices',
  }),
  createChoice: StrictFetch.prepare<{ value: number }>({
    url: 'game/choices',
    method: HTTPMethod.post,
  }),
};

export const AdminAPI = {
  members: StrictFetch.prepare<UserType[]>({
    url: 'admin/members',
  }),
  userBoard: StrictFetch.prepare<{ board: BoardType, choices: number[] }, null, null, { user_id: number }>({
    url: 'admin/board',
  }),
  events: StrictFetch.prepare<EventType[]>({
    url: 'admin/events',
  }),
};
