import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { CartService } from '../services/cart-service';
import { CartActions } from '../actions/action.type';
import { selectCartItems } from '../selectors/cart.selectors';
import { selectUser } from '../../login/selectors/login.selectors';

@Injectable()
export class CartEffects {
  readonly #actions$ = inject(Actions);
  readonly #store = inject(Store);
  readonly #cartService = inject(CartService);

  checkout$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(CartActions.checkout),
      withLatestFrom(this.#store.select(selectCartItems), this.#store.select(selectUser)),
      switchMap(([_, cartItems, user]) => {
        if (!user) {
          return of(CartActions.checkoutFailure({ error: 'User not authenticated' }));
        }

        const request = {
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          userId: user.id,
        };

        return this.#cartService.checkout(request).pipe(
          map((response) => CartActions.checkoutSuccess({ clientSecret: response.clientSecret })),
          catchError((error: unknown) => {
            const message =
              error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement';
            return of(CartActions.checkoutFailure({ error: message }));
          })
        );
      })
    )
  );
}
