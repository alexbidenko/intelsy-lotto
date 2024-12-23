export const useUserStore = defineStore('user', () => {
  const user = ref();

  const loadUser = () => {
    if (user.value) return user.value;

    CommonAPI.user().then((data) => {
      user.value = data;
      return data;
    });
  };

  return {
    user,

    loadUser,
  }
});
