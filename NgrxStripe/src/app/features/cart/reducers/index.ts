import { ActionReducer, createReducer, on } from '@ngrx/store';
import { CartActions } from '../actions/action.type';
import { Product } from '../../products/models/product-interface';

const CART_STORAGE_KEY = 'cart';

export interface CartState {
  products: Product[];
  quantity: number;
  total: number;
  clientSecret: string | null;
  isProcessing: boolean;
  paymentSuccess: boolean;
  error: string | null;
}

const initialState: CartState = {
  products: [],
  quantity: 0,
  total: 0,
  clientSecret: null,
  isProcessing: false,
  paymentSuccess: false,
  error: null,
};

function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return initialState;
  }
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ne charger que les données du panier, pas les états transientes
      return {
        ...initialState,
        products: parsed.products ?? [],
        quantity: parsed.quantity ?? 0,
        total: parsed.total ?? 0,
      };
    }
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return initialState;
}

const _cartReducer = createReducer<CartState>(
  loadCartFromStorage(),
  on(CartActions.addToCart, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    quantity: state.quantity + 1,
    total: state.total + product.price,
  })),
  on(CartActions.removeFromCart, (state, { productId }) => ({
    ...state,
    products: state.products.filter((product) => product.id !== productId),
    quantity: state.quantity - 1,
    total: state.total - (state.products.find((p) => p.id === productId)?.price ?? 0),
  })),
  on(CartActions.clearCart, () => initialState),

  // Checkout reducers
  on(CartActions.checkout, (state) => ({
    ...state,
    isProcessing: true,
    error: null,
  })),
  on(CartActions.checkoutSuccess, (state, { clientSecret }) => ({
    ...state,
    clientSecret,
    isProcessing: false,
  })),
  on(CartActions.checkoutFailure, (state, { error }) => ({
    ...state,
    isProcessing: false,
    error,
  })),

  // Payment confirmation reducers
  on(CartActions.confirmPayment, (state) => ({
    ...state,
    isProcessing: true,
    error: null,
  })),
  on(CartActions.confirmPaymentSuccess, (state) => ({
    ...state,
    isProcessing: false,
    paymentSuccess: true,
    products: [],
    quantity: 0,
    total: 0,
    clientSecret: null,
  })),
  on(CartActions.confirmPaymentFailure, (state, { error }) => ({
    ...state,
    isProcessing: false,
    error,
  })),
  on(CartActions.resetCheckout, (state) => ({
    ...state,
    clientSecret: null,
    isProcessing: false,
    paymentSuccess: false,
    error: null,
  }))
);

export function localStorageSyncReducer(
  reducer: ActionReducer<CartState>
): ActionReducer<CartState> {
  return (state, action) => {
    const newState = reducer(state, action);
    const cartData = {
      products: newState.products,
      quantity: newState.quantity,
      total: newState.total,
    };

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch {}

    return newState;
  };
}

export const cartReducer = localStorageSyncReducer(_cartReducer);
