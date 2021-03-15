import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { InstructorCoursesService } from '../instructor-courses.service'

@Component({
  selector: 'app-instructor-course-management',
  templateUrl: './instructor-course-management.component.html',
  styleUrls: ['./instructor-course-management.component.css']
})
export class InstructorCourseManagementComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private instructorCoursesService: InstructorCoursesService,
    private router: Router,

  ) { }
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.loadCourse(params['course_title_dashed']);
    });
  }


  private loadCourse(title_dashed: string){
    if(title_dashed != this.instructorCoursesService.course.title_dashed){
      let sub = this.instructorCoursesService.getCourse(title_dashed).subscribe(data => {
        if(data.success) {
        } else {
          this.router.navigate(['404']);
        }

        sub.unsubscribe();
      });
    }
  }

}
