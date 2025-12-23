import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../features/login/selectors/login.selectors';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    take(1),
    map((accessToken) => {
      if (accessToken) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
