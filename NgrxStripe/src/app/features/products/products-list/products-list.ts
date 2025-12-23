import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { CartActions } from '../../cart/actions/action.type';
import { ProductEntityService } from '../services/product-entity/product-entity.service';
import { Product } from '../models/product-interface';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-products-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, RouterModule, NgOptimizedImage],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  readonly #productEntityService = inject(ProductEntityService);
  readonly #store = inject(Store);
  readonly products$ = this.#productEntityService.entities$;
  readonly loading$ = this.#productEntityService.loading$;
  readonly errors$ = this.#productEntityService.errors$;

  ngOnInit() {
    this.#productEntityService.getAll();
  }

  addToCart(product: Product): void {
    this.#store.dispatch(CartActions.addToCart({ product }));
  }

  reload() {
    this.#productEntityService.getAll();
  }
}
