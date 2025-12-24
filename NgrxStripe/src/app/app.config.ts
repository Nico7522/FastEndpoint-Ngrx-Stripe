import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideEntityData, withEffects } from '@ngrx/data';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { cartReducer } from './features/cart/reducers';
import { loginReducer } from './features/login/reducers';
import { AuthEffects } from './features/login/effects/auth.effects';
import { CartEffects } from './features/cart/effects/cart.effects';
import { LoginActions } from './features/login/actions/login.type';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { refreshTokenInterceptor } from './shared/interceptors/refresh-token-interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => {
      return inject(Store).dispatch(LoginActions.autoLogin());
    }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([refreshTokenInterceptor, authInterceptor])),
    provideStore({
      cart: cartReducer,
      login: loginReducer,
    }),
    provideEffects(AuthEffects, CartEffects),

    provideEntityData(
      {
        entityMetadata: {
          Product: {},
        },
        pluralNames: {
          Product: 'products',
        },
      },
      withEffects()
    ),
    provideNgxStripe(environment.publicKey),
  ],
};
