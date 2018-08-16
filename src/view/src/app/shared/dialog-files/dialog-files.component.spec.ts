import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFilesComponent } from './dialog-files.component';

describe('DialogFilesComponent', () => {
  let component: DialogFilesComponent;
  let fixture: ComponentFixture<DialogFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
