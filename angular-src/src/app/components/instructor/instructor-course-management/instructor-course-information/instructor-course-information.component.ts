import { Component, OnInit, OnDestroy } from '@angular/core';
import { InstructorCoursesService } from '../../instructor-courses.service'
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Course } from '../../course.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instructor-course-information',
  templateUrl: './instructor-course-information.component.html',
  styleUrls: ['./instructor-course-information.component.css']
})
export class InstructorCourseInformationComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  course : Course = new Course();
  questions_count: number = 0;

  constructor(
    private instructorCoursesService: InstructorCoursesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.loadCourse(params['course_title_dashed']);
    });
  }

  private loadCourse(title_dashed: string){

    if(title_dashed === this.instructorCoursesService.course.title_dashed){
      this.course = this.instructorCoursesService.course;
      this.questions_count = this.instructorCoursesService.questions_count;
    }

    this.sub1 = this.instructorCoursesService.courseChanged
    .subscribe((course: Course) => {
      this.course = course;
      this.questions_count = this.instructorCoursesService.questions_count;
    });
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    // this.sub2.unsubscribe();
    // this.sub4.unsubscribe();
  }
}
