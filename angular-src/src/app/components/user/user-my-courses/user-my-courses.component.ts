import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'

@Component({
  selector: 'app-user-my-courses',
  templateUrl: './user-my-courses.component.html',
  styleUrls: ['./user-my-courses.component.css']
})
export class UserMyCoursesComponent implements OnInit {

  courses: any[];
  courses_enrolled: any[];


  constructor(
    private userService: UserService,
  ){ }

  ngOnInit() {
    this.courses = this.userService.user.courses;
    this.courses_enrolled = this.userService.user.courses_enrolled;
  }

}
