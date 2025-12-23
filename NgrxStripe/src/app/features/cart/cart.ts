import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  selectCartItems,
  selectCartQuantity,
  selectCartTotal,
  selectClientSecret,
  selectIsProcessing,
  selectPaymentSuccess,
  selectCheckoutError,
} from './selectors/cart.selectors';
import { CartActions } from './actions/action.type';
import { RouterModule } from '@angular/router';
import { StripePaymentElementComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    RouterModule,
    StripePaymentElementComponent,
    StripeElementsDirective,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  readonly #store = inject(Store);
  readonly #destroyRef = inject(DestroyRef);

  // Selectors
  cartItems$ = this.#store.select(selectCartItems);
  cartQuantity$ = this.#store.select(selectCartQuantity);
  cartTotal$ = this.#store.select(selectCartTotal);
  clientSecret$ = this.#store.select(selectClientSecret);
  isProcessing$ = this.#store.select(selectIsProcessing);
  paymentSuccess$ = this.#store.select(selectPaymentSuccess);
  error$ = this.#store.select(selectCheckoutError);

  // Stripe
  stripe = injectStripe(environment.publicKey);
  clientSecret = toSignal(this.clientSecret$);

  // Stripe Payment Element reference
  paymentElement = viewChild(StripePaymentElementComponent);

  // Stripe Elements options - computed pour réagir au changement de clientSecret
  elementsOptions = computed<StripeElementsOptions>(() => ({
    locale: 'fr',
    clientSecret: this.clientSecret() ?? '',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#171717',
      },
    },
  }));

  removeFromCart(productId: number): void {
    this.#store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart(): void {
    this.#store.dispatch(CartActions.clearCart());
  }

  checkout(): void {
    this.#store.dispatch(CartActions.checkout());
  }

  cancelCheckout(): void {
    this.#store.dispatch(CartActions.resetCheckout());
  }

  confirmPayment(): void {
    const paymentElement = this.paymentElement();
    if (!paymentElement) return;

    this.#store.dispatch(CartActions.confirmPayment());

    this.stripe
      .confirmPayment({
        elements: paymentElement.elements,
        confirmParams: {
          return_url: window.location.origin + '/cart',
        },
        redirect: 'if_required',
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result) => {
        if (result.error) {
          this.#store.dispatch(
            CartActions.confirmPaymentFailure({
              error: result.error.message ?? 'Erreur de paiement',
            })
          );
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.#store.dispatch(CartActions.confirmPaymentSuccess());
        }
      });
  }
}
