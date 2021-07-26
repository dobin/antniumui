import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketCreateModalComponent } from './packet-create-modal.component';

describe('PacketCreateModalComponent', () => {
  let component: PacketCreateModalComponent;
  let fixture: ComponentFixture<PacketCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
