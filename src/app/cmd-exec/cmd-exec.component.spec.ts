import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdExecComponent } from './cmd-exec.component';

describe('CmdExecComponent', () => {
  let component: CmdExecComponent;
  let fixture: ComponentFixture<CmdExecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdExecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
