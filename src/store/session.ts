import { create } from 'zustand';

interface Session {
  isLoggedIn: boolean;
  token: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;

  login: (token: string, user: Session['user']) => void;
  logout: () => void;
}

export const useSessionStore = create<Session>((set) => ({
  isLoggedIn: false,
  token: null,
  user: null,

  login: (token, user) =>
    set({
      isLoggedIn: true,
      token,
      user,
    }),

  logout: () =>
    set({
      isLoggedIn: false,
      token: null,
      user: null,
    }),
}));
