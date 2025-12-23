import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interface used for generate the request body for the checkout endpoint
interface CheckoutRequest {
  items: { productId: number; quantity: number }[];
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly #http = inject(HttpClient);

  checkout(request: CheckoutRequest): Observable<{ clientSecret: string }> {
    return this.#http.post<{ clientSecret: string }>('/api/payments/create-intent', {
      ...request,
    });
  }
}
