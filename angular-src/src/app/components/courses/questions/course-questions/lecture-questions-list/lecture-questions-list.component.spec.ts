import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureQuestionsListComponent } from './lecture-questions-list.component';

describe('LectureQuestionsListComponent', () => {
  let component: LectureQuestionsListComponent;
  let fixture: ComponentFixture<LectureQuestionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureQuestionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
