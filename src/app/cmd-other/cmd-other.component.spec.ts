import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdOtherComponent } from './cmd-other.component';

describe('CmdOtherComponent', () => {
  let component: CmdOtherComponent;
  let fixture: ComponentFixture<CmdOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdOtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
