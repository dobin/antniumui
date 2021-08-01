import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketCreatePageComponent } from './packet-create-page.component';

describe('PacketCreatePageComponent', () => {
  let component: PacketCreatePageComponent;
  let fixture: ComponentFixture<PacketCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PacketCreatePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PacketCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
