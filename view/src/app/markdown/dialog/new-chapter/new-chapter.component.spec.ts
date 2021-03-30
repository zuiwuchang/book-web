import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewChapterComponent } from './new-chapter.component';

describe('NewChapterComponent', () => {
  let component: NewChapterComponent;
  let fixture: ComponentFixture<NewChapterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
