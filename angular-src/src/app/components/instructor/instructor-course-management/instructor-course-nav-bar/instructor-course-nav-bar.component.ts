import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instructor-course-nav-bar',
  templateUrl: './instructor-course-nav-bar.component.html',
  styleUrls: ['./instructor-course-nav-bar.component.css']
})
export class InstructorCourseNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
) { }
  ngOnInit() {
  }

  onCourseInfo(){
    this.router.navigate(['course-information'], {relativeTo: this.route});
  }

  onCurriculum(){
    this.router.navigate(['curriculum'], {relativeTo: this.route});
  }

  onToDelete(){
    this.router.navigate(['delete'], {relativeTo: this.route});
  }

}
