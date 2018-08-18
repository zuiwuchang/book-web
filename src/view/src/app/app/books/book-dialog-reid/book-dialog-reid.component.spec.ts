import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDialogReidComponent } from './book-dialog-reid.component';

describe('BookDialogReidComponent', () => {
  let component: BookDialogReidComponent;
  let fixture: ComponentFixture<BookDialogReidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDialogReidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDialogReidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
