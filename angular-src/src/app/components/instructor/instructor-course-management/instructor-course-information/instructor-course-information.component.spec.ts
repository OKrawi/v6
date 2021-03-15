import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCourseInformationComponent } from './instructor-course-information.component';

describe('InstructorCourseInformationComponent', () => {
  let component: InstructorCourseInformationComponent;
  let fixture: ComponentFixture<InstructorCourseInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCourseInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCourseInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
