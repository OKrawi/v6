import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseMediaComponent } from './instructor-course-media.component';

describe('InstructorCourseMediaComponent', () => {
  let component: InstructorCourseMediaComponent;
  let fixture: ComponentFixture<InstructorCourseMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
