import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDialogNewComponent } from './book-dialog-new.component';

describe('BookDialogNewComponent', () => {
  let component: BookDialogNewComponent;
  let fixture: ComponentFixture<BookDialogNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDialogNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDialogNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
