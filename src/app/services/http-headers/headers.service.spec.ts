import { TestBed, inject } from '@angular/core/testing';

import { HeadersService } from './headers.service';

describe('HeadersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeadersService]
    });
  });

  it('should be created', inject([HeadersService], (service: HeadersService) => {
    expect(service).toBeTruthy();
  }));
});
