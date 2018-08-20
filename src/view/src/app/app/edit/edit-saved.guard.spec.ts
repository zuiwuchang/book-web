import { TestBed, async, inject } from '@angular/core/testing';

import { EditSavedGuard } from './edit-saved.guard';

describe('EditSavedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditSavedGuard]
    });
  });

  it('should ...', inject([EditSavedGuard], (guard: EditSavedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
