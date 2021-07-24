import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandTableComponent } from './command-table.component';

describe('CommandTableComponent', () => {
  let component: CommandTableComponent;
  let fixture: ComponentFixture<CommandTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
