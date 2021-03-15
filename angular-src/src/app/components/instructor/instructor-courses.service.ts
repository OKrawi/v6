import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service'
import { Course } from './course.model';

@Injectable()
export class InstructorCoursesService {

  course : Course = new Course();
  courseChanged = new Subject<Course>();
  courses: string[] = [];
  questions_count: number = 0;

  constructor(
    private http:Http,
    private authService: AuthService
  ) { }

  // Post a new course
  newCourse(course_title: string){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses/new');
    return this.http.post(ep, {title: course_title}, {headers: headers})
      .map(res => res.json());
  }

  // Get information about all courses
  getCourses(){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

  // Get details about one course
  getCourse(course_title_dashed: string){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses/' + course_title_dashed);
    return this.http.get(ep, {headers: headers})
      .map((res) => {
        if (res.json().success) {

          this.course = res.json().course;
          this.courses = res.json().courses;
          this.questions_count = res.json().questions_count;

          this.courseChanged.next(this.course);
        }
      return res.json();
    });
  }

  // Update a course
  updateCourse(course: Course){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses/' + this.course.title_dashed);
    return this.http.put(ep, course, {headers: headers})
      .map((res) => {

        this.course = res.json().course;

        this.courseChanged.next(this.course);
      return res.json();
    });
  }

  // Delete a course
  deleteCourse(course_title_dashed: string){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('courses/' + course_title_dashed);
    return this.http.delete(ep, {headers: headers})
      .map(res => res.json());
  }

  returnCourses(){
    return this.courses.slice();
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/instructor/' + ep;
  }
}
