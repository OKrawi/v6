import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorNewCourseComponent } from './instructor-new-course.component';

describe('InstructorNewCourseComponent', () => {
  let component: InstructorNewCourseComponent;
  let fixture: ComponentFixture<InstructorNewCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorNewCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorNewCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
