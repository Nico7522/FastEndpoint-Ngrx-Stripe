import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, switchMap } from 'rxjs';
import {
  selectIsRefreshing,
  selectLoginState,
} from '../../features/login/selectors/login.selectors';
import { LoginActions } from '../../features/login/actions/login.type';

const EXCLUDED_URLS = ['/api/refresh-token', '/api/users/login'];

const isTokenExpiringSoon = (exp: number | null): boolean => {
  if (!exp) return false;
  return exp * 1000 <= Date.now() + 2 * 60 * 1000;
};

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  if (EXCLUDED_URLS.some((url) => req.url.includes(url))) {
    return next(req);
  }

  return store.select(selectLoginState).pipe(
    first(),
    switchMap((state) => {
      const needsRefresh = isTokenExpiringSoon(state.exp);

      if (state.isRefreshing) {
        return store.select(selectIsRefreshing).pipe(
          filter((isRefreshing) => !isRefreshing),
          first(),
          switchMap(() => next(req))
        );
      }

      if (needsRefresh && state.user && state.refreshToken) {
        store.dispatch(
          LoginActions.refreshToken({
            userId: state.user.id.toString(),
            refreshToken: state.refreshToken,
          })
        );

        return store.select(selectIsRefreshing).pipe(
          filter((isRefreshing) => !isRefreshing),
          first(),
          switchMap(() => next(req))
        );
      }

      return next(req);
    })
  );
};
