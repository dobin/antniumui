import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrvcmdListComponent } from './srvcmd-list.component';

describe('SrvcmdListComponent', () => {
  let component: SrvcmdListComponent;
  let fixture: ComponentFixture<SrvcmdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrvcmdListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrvcmdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
