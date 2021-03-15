import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoursesService } from '../courses.service';
import { UserCourseData } from '../user-course-data.model';
import { Subscription } from 'rxjs/Subscription';
import { Course } from '../course.model'

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit, OnDestroy {

  user_course_data: UserCourseData = new UserCourseData();
  sub1: Subscription;
  course: Course;
  lectureOrder: Number;

  constructor(protected coursesService : CoursesService) { }

  ngOnInit() {
    this.user_course_data = this.coursesService.user_course_data;
    this.course = this.coursesService.course;
    this.lectureOrder = this.coursesService.getLectureOrder(this.user_course_data.last_lecture_id)

    this.sub1 = this.coursesService.courseChanged
    .subscribe((course: any) => {
        this.user_course_data = this.coursesService.user_course_data;
        this.course = this.coursesService.course;
        this.lectureOrder = this.coursesService.getLectureOrder(this.user_course_data.last_lecture_id)
      });
  }

  markAsWatched(){
    if(!this.user_course_data.last_lecture_id){
      this.coursesService.markAsWatched(this.course.chapters[0].lectures[0]._id);
    }
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
