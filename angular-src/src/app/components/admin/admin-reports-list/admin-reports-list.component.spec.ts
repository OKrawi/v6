import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportsListComponent } from './admin-reports-list.component';

describe('AdminReportsListComponent', () => {
  let component: AdminReportsListComponent;
  let fixture: ComponentFixture<AdminReportsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
