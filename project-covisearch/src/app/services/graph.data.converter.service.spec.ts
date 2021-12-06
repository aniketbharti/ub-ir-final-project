import { TestBed } from '@angular/core/testing';

import { GraphDataConverterService } from './graph.data.converter.service';

describe('GraphDataConverterService', () => {
  let service: GraphDataConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphDataConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
