import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorEditCourseComponent } from './instructor-edit-course.component';

describe('InstructorEditCourseComponent', () => {
  let component: InstructorEditCourseComponent;
  let fixture: ComponentFixture<InstructorEditCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorEditCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorEditCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
