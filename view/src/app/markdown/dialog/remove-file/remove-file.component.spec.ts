import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFileComponent } from './remove-file.component';

describe('RemoveFileComponent', () => {
  let component: RemoveFileComponent;
  let fixture: ComponentFixture<RemoveFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
