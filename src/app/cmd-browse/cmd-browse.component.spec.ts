import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdBrowseComponent } from './cmd-browse.component';

describe('CmdBrowseComponent', () => {
  let component: CmdBrowseComponent;
  let fixture: ComponentFixture<CmdBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
