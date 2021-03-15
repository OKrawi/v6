import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAnnouncementsListComponent } from './course-announcements-list.component';

describe('CourseAnnouncementsListComponent', () => {
  let component: CourseAnnouncementsListComponent;
  let fixture: ComponentFixture<CourseAnnouncementsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAnnouncementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAnnouncementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
