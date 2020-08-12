import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeIdComponent } from './change-id.component';

describe('ChangeIdComponent', () => {
  let component: ChangeIdComponent;
  let fixture: ComponentFixture<ChangeIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
