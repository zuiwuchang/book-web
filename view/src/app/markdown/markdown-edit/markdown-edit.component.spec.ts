import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarkdownEditComponent } from './markdown-edit.component';

describe('MarkdownEditComponent', () => {
  let component: MarkdownEditComponent;
  let fixture: ComponentFixture<MarkdownEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
