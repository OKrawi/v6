import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAnnouncementComponent } from './instructor-announcement.component';

describe('InstructorAnnouncementComponent', () => {
  let component: InstructorAnnouncementComponent;
  let fixture: ComponentFixture<InstructorAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorAnnouncementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
