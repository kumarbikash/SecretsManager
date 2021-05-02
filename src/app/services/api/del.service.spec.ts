import { TestBed } from '@angular/core/testing';

import { DelService } from './del.service';

describe('DelService', () => {
  let service: DelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
