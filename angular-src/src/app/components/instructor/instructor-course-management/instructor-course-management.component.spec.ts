import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseManagementComponent } from './instructor-course-management.component';

describe('InstructorCourseManagementComponent', () => {
  let component: InstructorCourseManagementComponent;
  let fixture: ComponentFixture<InstructorCourseManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
