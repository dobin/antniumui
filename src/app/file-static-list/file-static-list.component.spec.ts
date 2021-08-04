import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStaticListComponent } from './file-static-list.component';

describe('FileStaticListComponent', () => {
  let component: FileStaticListComponent;
  let fixture: ComponentFixture<FileStaticListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStaticListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileStaticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
