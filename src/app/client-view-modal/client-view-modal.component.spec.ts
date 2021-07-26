import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewModalComponent } from './client-view-modal.component';

describe('ClientViewModalComponent', () => {
  let component: ClientViewModalComponent;
  let fixture: ComponentFixture<ClientViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
