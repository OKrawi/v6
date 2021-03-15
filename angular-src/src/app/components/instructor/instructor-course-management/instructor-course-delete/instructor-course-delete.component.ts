import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InstructorCoursesService } from '../../instructor-courses.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instructor-course-delete',
  templateUrl: './instructor-course-delete.component.html',
  styleUrls: ['./instructor-course-delete.component.css']
})
export class InstructorCourseDeleteComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;
  title_dashed: string = "";

  constructor(private instructorCoursesService : InstructorCoursesService,
              private router: Router,
              private route: ActivatedRoute
            ) {}

  ngOnInit() {
    this.sub1 = this.route.parent.params
      .subscribe( params => this.title_dashed = params['course_title_dashed']);
  }

  onDeleteCourse(){
    this.sub2 = this.instructorCoursesService.deleteCourse(this.title_dashed).subscribe(data => {
      if(data.success) {
        this.router.navigate(['instructor']);
      }
      this.sub2.unsubscribe();
    });
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
