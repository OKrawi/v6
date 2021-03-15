import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesReportModalComponent } from './courses-report-modal.component';

describe('CoursesReportModalComponent', () => {
  let component: CoursesReportModalComponent;
  let fixture: ComponentFixture<CoursesReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
