import { TestBed } from '@angular/core/testing';

import { ProductEntityService } from './product-entity.service';

describe('ProductEntityService', () => {
  let service: ProductEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
