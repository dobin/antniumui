import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandCreateModalComponent } from './command-create-modal.component';

describe('CommandCreateModalComponent', () => {
  let component: CommandCreateModalComponent;
  let fixture: ComponentFixture<CommandCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
