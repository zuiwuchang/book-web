import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChapterComponent } from './edit-chapter.component';

describe('EditChapterComponent', () => {
  let component: EditChapterComponent;
  let fixture: ComponentFixture<EditChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
