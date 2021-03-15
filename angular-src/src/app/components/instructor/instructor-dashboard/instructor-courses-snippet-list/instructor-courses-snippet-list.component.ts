import { Component, OnInit, OnDestroy } from '@angular/core';
import { InstructorCoursesService } from '../../instructor-courses.service'
import { Course } from '../../course.model';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instructor-courses-snippet-list',
  templateUrl: './instructor-courses-snippet-list.component.html',
  styleUrls: ['./instructor-courses-snippet-list.component.css']
})
export class InstructorCoursesSnippetListComponent implements OnInit, OnDestroy {

  courses: Course[];
  subscription: Subscription;

  constructor(
    private instructorCoursesService: InstructorCoursesService,
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
    this.subscription = this.instructorCoursesService.getCourses().subscribe(data => {
      if(data.success) {
        this.courses = data.courses;
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 5000});
      }
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
