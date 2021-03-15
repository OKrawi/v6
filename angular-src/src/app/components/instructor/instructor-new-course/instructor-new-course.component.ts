import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InstructorCoursesService } from '../instructor-courses.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-instructor-new-course',
  templateUrl: './instructor-new-course.component.html',
  styleUrls: ['./instructor-new-course.component.css']
})
export class InstructorNewCourseComponent implements OnInit {

  @ViewChild('f') courseForm: NgForm;
  sub1: Subscription;
  course_title: string;

  constructor(
    private instructorCoursesService: InstructorCoursesService,
    private flashMessage:FlashMessagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    this.sub1 = this.instructorCoursesService.newCourse(this.course_title).subscribe(data => {
      if(data.success) {

        this.router.navigate(['instructor/courses/' + data.course.title_dashed]);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
      }
      this.sub1.unsubscribe();
    });
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
