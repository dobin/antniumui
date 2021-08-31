import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdDownstreamsComponent } from './cmd-downstreams.component';

describe('CmdDownstreamsComponent', () => {
  let component: CmdDownstreamsComponent;
  let fixture: ComponentFixture<CmdDownstreamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmdDownstreamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdDownstreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
