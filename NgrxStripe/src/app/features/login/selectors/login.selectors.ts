import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from '../reducers';

export const selectLoginState = createFeatureSelector<LoginState>('login');

export const selectAccessToken = createSelector(selectLoginState, (state) => state.accessToken);
export const selectRefreshToken = createSelector(selectLoginState, (state) => state.refreshToken);
export const selectIsLoggedIn = createSelector(selectAccessToken, (accessToken) => !!accessToken);
export const selectUser = createSelector(selectLoginState, (state) => state.user);
export const selectIsLoading = createSelector(selectLoginState, (state) => state.isLoading);
export const selectError = createSelector(selectLoginState, (state) => state.error);
export const selectExp = createSelector(selectLoginState, (state) => state.exp);
export const selectIsRefreshing = createSelector(selectLoginState, (state) => state.isRefreshing);
