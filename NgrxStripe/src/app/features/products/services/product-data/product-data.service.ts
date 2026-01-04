import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DefaultDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { Observable, map, tap } from 'rxjs';
import { Product } from '../../models/product-interface';
import { PaginatedResponse, PaginationState } from '../../models/paginated-response';

@Injectable()
export class ProductDataService extends DefaultDataService<Product> {
  // Signal used to expose the pagination metadata

  readonly pagination = signal<PaginationState>({
    currentPage: 1,
    pageSize: 3,
    totalItems: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  });

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Product', http, httpUrlGenerator);
  }

  override getWithQuery(queryParams: QueryParams | string): Observable<Product[]> {
    let params: HttpParams;

    if (typeof queryParams === 'string') {
      params = new HttpParams({ fromString: queryParams });
    } else {
      params = new HttpParams({ fromObject: queryParams });
    }
    return this.http.get<PaginatedResponse<Product>>(`api/products`, { params }).pipe(
      tap((response) => {
        this.pagination.set({
          currentPage: response.currentPage,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          hasPrevious: response.hasPrevious,
          hasNext: response.hasNext,
        });
      }),
      map((response) => response.products)
    );
  }
}
