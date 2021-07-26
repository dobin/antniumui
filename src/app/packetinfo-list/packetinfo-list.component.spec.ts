import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketInfoListComponent } from './packetinfo-list.component';

describe('PacketInfoListComponent', () => {
  let component: PacketInfoListComponent;
  let fixture: ComponentFixture<PacketInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
