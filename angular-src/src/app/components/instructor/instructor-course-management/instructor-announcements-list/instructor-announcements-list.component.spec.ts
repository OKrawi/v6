import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorAnnouncementsListComponent } from './instructor-announcements-list.component';

describe('InstructorAnnouncementsListComponent', () => {
  let component: InstructorAnnouncementsListComponent;
  let fixture: ComponentFixture<InstructorAnnouncementsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorAnnouncementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorAnnouncementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
