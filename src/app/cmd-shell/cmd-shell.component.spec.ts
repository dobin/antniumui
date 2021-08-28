import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdShellComponent } from './cmd-shell.component';

describe('CmdShellComponent', () => {
  let component: CmdShellComponent;
  let fixture: ComponentFixture<CmdShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdShellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
