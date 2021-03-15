import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseOverViewComponent } from './course-over-view.component';

describe('CourseOverViewComponent', () => {
  let component: CourseOverViewComponent;
  let fixture: ComponentFixture<CourseOverViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseOverViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
