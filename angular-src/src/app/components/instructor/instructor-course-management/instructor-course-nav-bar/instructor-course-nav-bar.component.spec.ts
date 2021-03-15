import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseNavBarComponent } from './instructor-course-nav-bar.component';

describe('InstructorCourseNavBarComponent', () => {
  let component: InstructorCourseNavBarComponent;
  let fixture: ComponentFixture<InstructorCourseNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
