import type {UserType, EventType} from "#types";

const EVENT_TYPES = ['first_row', 'second_row', 'third_row', 'full_card'];

export const useAdminStore = defineStore('admin', () => {
  const ws = useWsStore();

  const adminSocket = ws.admin();

  const members = reactive(new Map<number, UserType>());
  const events = ref<EventType[]>([]);

  const winners = computed(() => (
    events.value.reduceRight<EventType[]>((acc, el) => {
      if (
        (
          (EVENT_TYPES.includes(el.name) && el.data.completed) ||
          el.name === 'fastest_user'
        ) &&
        !acc.some((e) => e.name === el.name || e.data.user.id === el.data.user.id)
      ) acc.unshift(el);

      return acc;
    }, [])
  ));

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
    winners,

    updateState,
    sendValue,
    loadMembers,
    loadEvents,
  };
});
