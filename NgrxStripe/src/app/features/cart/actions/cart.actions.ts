import { createAction, props } from '@ngrx/store';
import { Product } from '../../products/models/product-interface';

export const addToCart = createAction('[Cart] Add To Cart', props<{ product: Product }>());
export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: number }>()
);
export const clearCart = createAction('[Cart] Clear Cart');

// Checkout actions
export const checkout = createAction('[Cart] Checkout');
export const checkoutSuccess = createAction(
  '[Cart] Checkout Success',
  props<{ clientSecret: string }>()
);
export const checkoutFailure = createAction('[Cart] Checkout Failure', props<{ error: string }>());

// Payment confirmation actions
export const confirmPayment = createAction('[Cart] Confirm Payment');
export const confirmPaymentSuccess = createAction('[Cart] Confirm Payment Success');
export const confirmPaymentFailure = createAction(
  '[Cart] Confirm Payment Failure',
  props<{ error: string }>()
);
export const resetCheckout = createAction('[Cart] Reset Checkout');
