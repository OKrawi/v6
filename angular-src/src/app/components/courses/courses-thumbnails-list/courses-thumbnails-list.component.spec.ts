import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesThumbnailsListComponent } from './courses-thumbnails-list.component';

describe('CoursesThumbnailsListComponent', () => {
  let component: CoursesThumbnailsListComponent;
  let fixture: ComponentFixture<CoursesThumbnailsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesThumbnailsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesThumbnailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
