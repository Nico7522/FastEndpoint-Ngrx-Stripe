import { createReducer, on } from '@ngrx/store';
import { LoginActions } from '../actions/login.type';
import { User } from '../models/user-interface';

export interface LoginState {
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  exp: number | null;
}

export const initialState: LoginState = {
  accessToken: null,
  refreshToken: null,
  error: null,
  user: null,
  isLoading: false,
  isRefreshing: false,
  exp: null,
};

export const loginReducer = createReducer(
  initialState,
  on(LoginActions.login, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(LoginActions.loginSuccess, (state, { accessToken, refreshToken, user, exp }) => ({
    ...state,
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: user,
    isLoading: false,
    exp: exp,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
  })),
  on(LoginActions.autoLoginSuccess, (state, { accessToken, refreshToken, user, exp }) => ({
    ...state,
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: user,
    isLoading: false,
    exp: exp,
  })),
  on(LoginActions.autoLoginFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
  })),
  on(LoginActions.logout, () => initialState),
  on(LoginActions.refreshToken, (state) => ({
    ...state,
    isRefreshing: true,
  })),
  on(LoginActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    error,
    isRefreshing: false,
  })),
  on(LoginActions.refreshTokenSuccess, (state, { accessToken, refreshToken, user, exp }) => ({
    ...state,
    accessToken,
    refreshToken,
    user,
    isRefreshing: false,
    exp,
  }))
);
