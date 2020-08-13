import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownViewComponent } from './markdown-view.component';

describe('MarkdownViewComponent', () => {
  let component: MarkdownViewComponent;
  let fixture: ComponentFixture<MarkdownViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
