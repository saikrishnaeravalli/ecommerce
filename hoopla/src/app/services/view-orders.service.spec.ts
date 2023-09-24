import { TestBed } from '@angular/core/testing';

import { ViewOrdersService } from './view-orders.service';

describe('ViewOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewOrdersService = TestBed.get(ViewOrdersService);
    expect(service).toBeTruthy();
  });
});
