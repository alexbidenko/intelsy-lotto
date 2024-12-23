import { Manager } from "socket.io-client";

export const useWsStore = defineStore('ws', () => {
  const manager = new Manager();
  const userSocket = () => manager.socket('/user');
  const adminSocket = () => manager.socket('/admin');

  return { manager, user: userSocket, admin: adminSocket };
});
