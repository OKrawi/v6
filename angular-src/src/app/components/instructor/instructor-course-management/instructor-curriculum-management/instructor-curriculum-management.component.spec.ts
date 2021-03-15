import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorCurriculumManagementComponent } from './instructor-curriculum-management.component';

describe('InstructorCurriculumManagementComponent', () => {
  let component: InstructorCurriculumManagementComponent;
  let fixture: ComponentFixture<InstructorCurriculumManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorCurriculumManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorCurriculumManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
