import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorBiographyComponent } from './instructor-biography.component';

describe('InstructorBiographyComponent', () => {
  let component: InstructorBiographyComponent;
  let fixture: ComponentFixture<InstructorBiographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorBiographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorBiographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
