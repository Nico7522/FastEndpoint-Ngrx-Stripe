import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { CartActions } from '../../cart/actions/action.type';
import { ProductEntityService } from '../services/product-entity/product-entity.service';
import { Product } from '../models/product-interface';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Pagination } from './pagination/pagination';

@Component({
  selector: 'app-products-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CurrencyPipe, RouterModule, NgOptimizedImage, Pagination],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  readonly #productEntityService = inject(ProductEntityService);
  readonly #store = inject(Store);

  readonly products$ = this.#productEntityService.entities$;
  readonly loading$ = this.#productEntityService.loading$;
  readonly errors$ = this.#productEntityService.errors$;

  // Pagination metadata
  readonly pagination = this.#productEntityService.pagination;

  // Computed signal used to create an array containing the number of pages
  readonly totalPagesArray = computed(() =>
    Array.from({ length: this.pagination().totalPages }, (_, index) => index + 1)
  );

  ngOnInit() {
    this.#productEntityService.loadPage(1);
  }

  addToCart(product: Product): void {
    this.#store.dispatch(CartActions.addToCart({ product }));
  }

  onNextPage(): void {
    this.#productEntityService.nextPage();
  }

  onPreviousPage(): void {
    this.#productEntityService.previousPage();
  }

  onGoToPage(page: number): void {
    this.#productEntityService.loadPage(page);
  }
}
