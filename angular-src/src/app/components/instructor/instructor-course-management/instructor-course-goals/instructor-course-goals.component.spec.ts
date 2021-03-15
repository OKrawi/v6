import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseGoalsComponent } from './instructor-course-goals.component';

describe('InstructorCourseGoalsComponent', () => {
  let component: InstructorCourseGoalsComponent;
  let fixture: ComponentFixture<InstructorCourseGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
