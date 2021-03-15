import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseQuestionsListComponent } from './course-questions-list.component';

describe('CourseQuestionsListComponent', () => {
  let component: CourseQuestionsListComponent;
  let fixture: ComponentFixture<CourseQuestionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseQuestionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
