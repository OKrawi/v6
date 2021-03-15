import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyCoursesComponent } from './user-my-courses.component';

describe('UserMyCoursesComponent', () => {
  let component: UserMyCoursesComponent;
  let fixture: ComponentFixture<UserMyCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMyCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
