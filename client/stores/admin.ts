import type {UserType, EventType} from "#types";

export const useAdminStore = defineStore('admin', () => {
  const ws = useWsStore();

  const adminSocket = ws.admin();

  const members = reactive(new Map<number, UserType>());
  const events = ref<EventType[]>([]);

  const loadMembers = () => {
    AdminAPI.members().then((data) => {
      data.forEach((user) => members.set(user.id, user));
    });
  };

  const loadEvents = () => {
    AdminAPI.events().then((data) => {
      events.value = data;
    });
  };

  const updateState = (value: string) => adminSocket.emit('state', { value });

  const sendValue = (value: number) => adminSocket.emit('value', { value });

  adminSocket.on('member', (data) => {
    if (data.value.event === 'connected') members.set(data.value.user.id, data.value.user);
    else if (data.value.event === 'disconnected') members.delete(data.value.user.id);
  });

  adminSocket.on('events', (data) => {
    events.value.unshift(data.value);
  });

  return {
    members,
    events,

    updateState,
    sendValue,
    loadMembers,
    loadEvents,
  };
});
