import { Injectable } from '@angular/core';
import { CoursesService } from '../components/courses/courses.service';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CourseGuard implements CanActivate {

    constructor(
      private coursesService: CoursesService,
      private authService: AuthService,
    ) {}

    canActivate(route: ActivatedRouteSnapshot)
                : Observable<boolean> | Promise<boolean> | boolean {

      let course_title_dashed = route.params.course_title_dashed;
      let preview: boolean = false;

      route.url.map((segment) => {
        if (segment.path === 'preview') {
          preview = true;
        }
      });

      console.log(2);
      
      if (this.authService.loggedIn()) {
        return this.coursesService.getCourse(course_title_dashed, preview);
      } else {
        return this.coursesService.getPreviewCourse(course_title_dashed, preview);
      }
    }
}
