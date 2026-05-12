import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthUser {
  id: number;
  username: string;
  avatar: string;
  skill_level: string;
  xp_points: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (token, user) => {
    Cookies.set('ll_token', token, { expires: 7 });
    set({ token, user });
  },
  logout: () => {
    Cookies.remove('ll_token');
    set({ token: null, user: null });
  },
}));
