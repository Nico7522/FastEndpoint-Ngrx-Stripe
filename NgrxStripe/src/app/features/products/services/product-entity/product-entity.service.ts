import { Injectable, inject } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Product } from '../../models/product-interface';
import { ProductDataService } from '../product-data/product-data.service';

@Injectable({
  providedIn: 'root',
})
export class ProductEntityService extends EntityCollectionServiceBase<Product> {
  readonly #productDataService = inject(ProductDataService);

  // Expose les métadonnées de pagination
  readonly pagination = this.#productDataService.pagination;

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Product', serviceElementsFactory);
  }

  // Méthode helper pour charger une page spécifique
  loadPage(page: number, pageSize = 3) {
    return this.getWithQuery({ page, pageSize });
  }

  nextPage() {
    const current = this.pagination();
    if (current.hasNext) {
      this.loadPage(current.currentPage + 1, current.pageSize);
    }
  }

  previousPage() {
    const current = this.pagination();
    if (current.hasPrevious) {
      this.loadPage(current.currentPage - 1, current.pageSize);
    }
  }
}
