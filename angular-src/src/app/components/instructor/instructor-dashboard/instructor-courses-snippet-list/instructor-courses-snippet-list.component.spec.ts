import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCoursesSnippetListComponent } from './instructor-courses-snippet-list.component';

describe('InstructorCoursesSnippetListComponent', () => {
  let component: InstructorCoursesSnippetListComponent;
  let fixture: ComponentFixture<InstructorCoursesSnippetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCoursesSnippetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCoursesSnippetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
