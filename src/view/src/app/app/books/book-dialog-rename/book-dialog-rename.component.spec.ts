import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDialogRenameComponent } from './book-dialog-rename.component';

describe('BookDialogRenameComponent', () => {
  let component: BookDialogRenameComponent;
  let fixture: ComponentFixture<BookDialogRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDialogRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDialogRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
