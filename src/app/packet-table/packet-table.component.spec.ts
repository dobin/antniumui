import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketTableComponent } from './packet-table.component';

describe('PacketTableComponent', () => {
  let component: PacketTableComponent;
  let fixture: ComponentFixture<PacketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
