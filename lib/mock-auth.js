// Este é um arquivo de substituição temporária para NextAuth
export const useSession = () => {
  return {
    data: null,
    status: "unauthenticated",
    update: () => Promise.resolve(null)
  };
};

export const getSession = () => {
  return Promise.resolve(null);
};

export const signIn = () => {
  return Promise.resolve({ error: null, status: 200, ok: true });
};

export const signOut = () => {
  return Promise.resolve(true);
};

export default {
  useSession,
  getSession,
  signIn,
  signOut
};
