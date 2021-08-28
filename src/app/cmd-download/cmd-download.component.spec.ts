import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdDownloadComponent } from './cmd-download.component';

describe('CmdDownloadComponent', () => {
  let component: CmdDownloadComponent;
  let fixture: ComponentFixture<CmdDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
