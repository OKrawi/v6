import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCommentComponent } from './courses-comment.component';

describe('CoursesCommentComponent', () => {
  let component: CoursesCommentComponent;
  let fixture: ComponentFixture<CoursesCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
