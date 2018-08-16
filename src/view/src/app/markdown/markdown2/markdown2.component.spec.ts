import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Markdown2Component } from './markdown2.component';

describe('Markdown2Component', () => {
  let component: Markdown2Component;
  let fixture: ComponentFixture<Markdown2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Markdown2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Markdown2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
