import { createAction, props } from '@ngrx/store';
import { User } from '../models/user-interface';

export const login = createAction('[Login] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ accessToken: string; refreshToken: string; user: User; exp: number }>()
);
export const loginFailure = createAction('[Login] Login Failure', props<{ error: string }>());

export const autoLogin = createAction('[Login] Auto Login');
export const autoLoginSuccess = createAction(
  '[Login] Auto Login Success',
  props<{ accessToken: string; refreshToken: string; user: User; exp: number }>()
);
export const autoLoginFailure = createAction(
  '[Login] Auto Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Login] Logout');

export const refreshToken = createAction(
  '[Login] Refresh Token',
  props<{ userId: string; refreshToken: string }>()
);
export const refreshTokenSuccess = createAction(
  '[Login] Refresh Token Success',
  props<{ accessToken: string; refreshToken: string; user: User; exp: number }>()
);
export const refreshTokenFailure = createAction(
  '[Login] Refresh Token Failure',
  props<{ error: string }>()
);
