import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChapterComponent } from './dialog-chapter.component';

describe('DialogChapterComponent', () => {
  let component: DialogChapterComponent;
  let fixture: ComponentFixture<DialogChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
