import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdUploadComponent } from './cmd-upload.component';

describe('CmdUploadComponent', () => {
  let component: CmdUploadComponent;
  let fixture: ComponentFixture<CmdUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
