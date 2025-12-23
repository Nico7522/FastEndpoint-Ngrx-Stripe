import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from '../reducers';
import { Product } from '../../products/models/product-interface';

// Interface used for manage UI state only
interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartProducts = createSelector(selectCartState, (state) => state.products);
export const selectCartQuantity = createSelector(selectCartState, (state) => state.quantity);
export const selectCartTotal = createSelector(selectCartState, (state) => state.total);
export const selectClientSecret = createSelector(selectCartState, (state) => state.clientSecret);
export const selectIsProcessing = createSelector(selectCartState, (state) => state.isProcessing);
export const selectPaymentSuccess = createSelector(
  selectCartState,
  (state) => state.paymentSuccess
);
export const selectCheckoutError = createSelector(selectCartState, (state) => state.error);

export const selectCartItems = createSelector(selectCartProducts, (products): CartItem[] => {
  const groupedProducts = new Map<number, CartItem>();

  products.forEach((product) => {
    const existing = groupedProducts.get(product.id);
    if (existing) {
      existing.quantity += 1;
      existing.subtotal += product.price;
    } else {
      groupedProducts.set(product.id, {
        product,
        quantity: 1,
        subtotal: product.price,
      });
    }
  });

  return Array.from(groupedProducts.values());
});
