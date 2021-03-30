import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemoveChapterComponent } from './remove-chapter.component';

describe('RemoveChapterComponent', () => {
  let component: RemoveChapterComponent;
  let fixture: ComponentFixture<RemoveChapterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
