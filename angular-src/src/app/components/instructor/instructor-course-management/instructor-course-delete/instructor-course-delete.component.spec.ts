import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseDeleteComponent } from './instructor-course-delete.component';

describe('InstructorCourseDeleteComponent', () => {
  let component: InstructorCourseDeleteComponent;
  let fixture: ComponentFixture<InstructorCourseDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
