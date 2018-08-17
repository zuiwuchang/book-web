import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSureComponent } from './dialog-sure.component';

describe('DialogSureComponent', () => {
  let component: DialogSureComponent;
  let fixture: ComponentFixture<DialogSureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
