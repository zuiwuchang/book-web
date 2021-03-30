import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileManagementComponent } from './file-management.component';

describe('FileManagementComponent', () => {
  let component: FileManagementComponent;
  let fixture: ComponentFixture<FileManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
