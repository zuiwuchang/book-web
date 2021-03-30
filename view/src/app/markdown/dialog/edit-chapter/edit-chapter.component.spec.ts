import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditChapterComponent } from './edit-chapter.component';

describe('EditChapterComponent', () => {
  let component: EditChapterComponent;
  let fixture: ComponentFixture<EditChapterComponent>;

  beforeEach(waitForAsync(() => {
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
