import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketCreateComponent } from './packet-create.component';

describe('PacketCreateComponent', () => {
  let component: PacketCreateComponent;
  let fixture: ComponentFixture<PacketCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
