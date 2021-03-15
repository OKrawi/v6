import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../../courses.service';
import { Subscription } from 'rxjs/Subscription';
import { Course } from '../../course.model';

@Component({
  selector: 'app-course-over-view',
  templateUrl: './course-over-view.component.html',
  styleUrls: ['./course-over-view.component.css']
})
export class CourseOverViewComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  course: Course;

  constructor ( private coursesService : CoursesService ) { }

  ngOnInit() {
    this.course = this.coursesService.course;

    this.sub1 = this.coursesService.courseChanged
    .subscribe((course: any) => {
        this.course = this.coursesService.course;
      });
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
