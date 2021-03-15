import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CoursesService } from '../../courses.service';
import { Course } from '../../course.model';
import { UserCourseData } from '../../user-course-data.model';
import { Chapter } from '../../chapter.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit, OnDestroy {

  course = new Course();

  sub1: Subscription;


  constructor (
    private coursesService : CoursesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.course = this.coursesService.course;

    this.sub1 = this.coursesService.courseChanged
    .subscribe((course: Course) => {
        this.course = course;
      });
  }

  onToLecture(lecture_id: string){
    let url = '/courses/' + this.course.title_dashed + '/lectures/' + lecture_id
    this.router.navigate([url]);
    this.coursesService.markAsWatched(lecture_id);
    return false;
  }

  cumulativeLength(index) {
    let acc = 0;
    for (let i = 0; i<index; i++) {
        acc += this.course.chapters[i].lectures.length;
    }
    return acc;
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
