import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CachedComponent } from './cached.component';

describe('CachedComponent', () => {
  let component: CachedComponent;
  let fixture: ComponentFixture<CachedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CachedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CachedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
