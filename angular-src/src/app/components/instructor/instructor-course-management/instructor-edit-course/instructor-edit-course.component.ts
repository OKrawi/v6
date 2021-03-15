import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InstructorCoursesService } from '../../instructor-courses.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Course } from '../../course.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instructor-edit-course',
  templateUrl: './instructor-edit-course.component.html',
  styleUrls: ['./instructor-edit-course.component.css']
})
export class InstructorEditCourseComponent implements OnInit, OnDestroy {

  course = new Course();

  sub1: Subscription;
  // sub4: Subscription;
  // sub2: Subscription;

  constructor(
    private instructorCoursesService: InstructorCoursesService,
    private flashMessage:FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.loadCourse(params['course_title_dashed']);
    });
  }

  onSubmit() {
    let sub = this.instructorCoursesService.updateCourse(this.course).subscribe(data => {
      if(data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success',
          timeout: 5000});
        } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
      }
      sub.unsubscribe();
    });
  }

  private loadCourse(title_dashed: string){

    if(title_dashed === this.instructorCoursesService.course.title_dashed){
      this.course = this.instructorCoursesService.course;
    }

    this.sub1 = this.instructorCoursesService.courseChanged
    .subscribe((course: Course) => {
      this.course = course;
    });
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    // this.sub2.unsubscribe();
    // this.sub4.unsubscribe();
  }
}
