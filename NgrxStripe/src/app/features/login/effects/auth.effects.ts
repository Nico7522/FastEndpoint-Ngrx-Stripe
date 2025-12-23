import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginActions } from '../actions/login.type';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LoginService } from '../services/login-service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../../shared/services/token-service';

@Injectable()
export class AuthEffects {
  readonly #actions$ = inject(Actions);
  readonly #loginService = inject(LoginService);
  readonly #router = inject(Router);
  readonly #tokenService = inject(TokenService);
  login$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(LoginActions.login),
      switchMap(({ email, password }) =>
        this.#loginService.login(email, password).pipe(
          tap((response) => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
          }),
          map((response) => {
            const decodedToken = this.#tokenService.decodeToken(response.accessToken);
            if (!decodedToken) {
              return LoginActions.loginFailure({ error: 'Invalid token' });
            }
            return LoginActions.loginSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              user: decodedToken.userInfo,
              exp: decodedToken.exp,
            });
          }),
          catchError((error: unknown) => {
            const message = error instanceof Error ? error.message : 'Échec de la connexion';
            return of(LoginActions.loginFailure({ error: message }));
          })
        )
      )
    )
  );

  loginSuccessRedirect$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(LoginActions.loginSuccess),
        tap(() => {
          this.#router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  autoLogin$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(LoginActions.autoLogin),
      switchMap(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const decodedToken = this.#tokenService.decodeToken(token);
          if (!decodedToken) {
            return of(LoginActions.autoLoginFailure({ error: 'Invalid token' }));
          }
          return of(
            LoginActions.autoLoginSuccess({
              accessToken: token,
              refreshToken: token,
              user: decodedToken.userInfo,
              exp: decodedToken.exp,
            })
          );
        }

        return of(LoginActions.autoLoginFailure({ error: 'No token found' }));
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.#actions$.pipe(
        ofType(LoginActions.logout),
        tap(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.#router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(LoginActions.refreshToken),
      switchMap(({ userId, refreshToken }) => {
        if (!userId || !refreshToken) {
          return of(LoginActions.refreshTokenFailure({ error: 'Invalid userId or refresh token' }));
        }
        return this.#loginService.refreshToken(userId, refreshToken).pipe(
          tap((response) => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
          }),
          map((response) => {
            const decodedToken = this.#tokenService.decodeToken(response.accessToken);
            if (!decodedToken) {
              return LoginActions.refreshTokenFailure({ error: 'Invalid token' });
            }

            return LoginActions.refreshTokenSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              user: decodedToken.userInfo,
              exp: decodedToken.exp,
            });
          }),
          catchError((error: unknown) => {
            return of(
              LoginActions.refreshTokenFailure({
                error:
                  error instanceof Error ? error.message : 'Échec du rafraîchissement du token',
              })
            );
          })
        );
      })
    )
  );
}
