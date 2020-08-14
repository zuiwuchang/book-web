import { TestBed } from '@angular/core/testing';

import { SavedGuard } from './saved.guard';

describe('SavedGuard', () => {
  let guard: SavedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SavedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
