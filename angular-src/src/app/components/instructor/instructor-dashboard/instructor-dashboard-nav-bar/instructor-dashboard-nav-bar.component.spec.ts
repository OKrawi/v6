import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorDashboardNavBarComponent } from './instructor-dashboard-nav-bar.component';

describe('InstructorDashboardNavBarComponent', () => {
  let component: InstructorDashboardNavBarComponent;
  let fixture: ComponentFixture<InstructorDashboardNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorDashboardNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorDashboardNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
