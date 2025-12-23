import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/login/selectors/login.selectors';
import { first, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectAccessToken).pipe(
    first(), // ← Prend la première valeur et complète
    switchMap((accessToken) => {
      if (accessToken) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
