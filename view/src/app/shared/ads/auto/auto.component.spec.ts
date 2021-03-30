import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutoComponent } from './auto.component';

describe('AutoComponent', () => {
  let component: AutoComponent;
  let fixture: ComponentFixture<AutoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
