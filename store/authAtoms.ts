import { atom } from 'jotai';

// 用户认证状态接口
export interface AuthState {
  isLoggedIn: boolean;
  email: string;
  name?: string;
  avatar?: string;
  googleId?: string;
}

// 认证状态原子
export const authStateAtom = atom<AuthState>({
  isLoggedIn: false,
  email: '',
  name: undefined,
  avatar: undefined,
  googleId: undefined,
});

// 设置用户登录状态的派生原子
export const setAuthUserAtom = atom(
  null,
  (get, set, user: { email: string; name?: string; avatar?: string; googleId?: string }) => {
    set(authStateAtom, {
      isLoggedIn: true,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      googleId: user.googleId,
    });
  }
);

// 清除用户登录状态的派生原子
export const clearAuthUserAtom = atom(null, (get, set) => {
  set(authStateAtom, {
    isLoggedIn: false,
    email: '',
    name: undefined,
    avatar: undefined,
    googleId: undefined,
  });
});
