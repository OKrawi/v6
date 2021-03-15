import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Course } from './course.model';
import { UserCourseData } from './user-course-data.model';
import { Chapter } from './chapter.model';
import { Lecture } from './lecture.model';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class CoursesService {

  loading : boolean = true;

  course : Course = new Course();
  courseChanged = new Subject<Course>();

  lecture = new Lecture();
  lectureChanged = new Subject<Lecture>();

  previous_lecture_id: string;
  next_lecture_id: string;

  user_course_data : UserCourseData = new UserCourseData;
  last_lecture_order: number;


  constructor(
    private http: Http,
    private authService: AuthService,
    private router: Router,
  ) { }

  getCourse(course_title_dashed: string, preview: boolean){
    console.log(3);
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("courses/" + course_title_dashed);
    return this.http.get(ep, {headers: headers})
      .map((res) => {
        console.log(res.json());
        if(res.json().success){

          this.course = res.json().course;

          this.courseChanged.next(this.course);

          setTimeout(()=>{
            this.loading = false;
          },1000);
          console.log(4);
          if(res.json().enrolled){
            if (!preview) {
              console.log(5);
              this.user_course_data = res.json().user_course_data;
              return true;
            } else {
              console.log(6);
              this.router.navigate(['courses/' + course_title_dashed ]);
              return false;
            }
          } else {
            if (preview) {
              console.log(7);
              return true;
            } else {
              console.log(8);
              this.router.navigate(['courses/' + course_title_dashed + '/preview']);
              return false;
            }
          }
        } else {
          this.router.navigate(['404']);
        }
      });
  }


  getPreviewCourse(course_title_dashed: string, preview: boolean){
    console.log(9);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("courses/" + course_title_dashed + '/preview');
    return this.http.get(ep, {headers: headers})
      .map((res) => {
        if(res.json().success){

          this.course = res.json().course;

          this.courseChanged.next(this.course);

          setTimeout(()=>{
            this.loading = false;
          },1000);

          if (preview) {
            return true;
          } else {
            this.router.navigate(['courses/' + course_title_dashed + '/preview']);
            return false;
          }
        }
      });
  }

  // Enroll in a course
  enroll(course_title_dashed: string){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("courses/" + course_title_dashed + "/enroll");
    let sub = this.http.get(ep, {headers: headers})
      .map((res) => {
        console.log(res.json());

        if(res.json().success){
          this.router.navigate(['courses/' + course_title_dashed]);
        }
      }).subscribe(res => sub.unsubscribe());
  }


  // Get details about one lecture
  getLecture(course_title_dashed: string, lecture_id: string){

    let params = {
      course_title_dashed: course_title_dashed,
      lecture_id : lecture_id
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("lectures/");
    return this.http.get(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){
          this.lecture = res.json().lecture;
          this.lectureChanged.next(this.lecture);

          if(this.course.chapters){
            this.getIndices();
          }
        } else {
          this.router.navigate(['courses/' + course_title_dashed]);
        }
        return res.json();
      })
  }

  // Get details about one lecture
  getPreviewLecture(lecture_id: string){
    let params = {
      lecture_id: lecture_id
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("lectures/preview");
    return this.http.get(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){
        }
        return res.json().previewLecture;
      })
  }

  setLectureNavigationButtons(chapter_index: number, lecture_index: number){

    let next_lecture_id : string = '';
    let previous_lecture_id : string = '';

    let chapter : Chapter = this.course.chapters[chapter_index];

    if(lecture_index === 0){

      let previous_chapter = this.course.chapters[chapter_index -1];

      if(chapter_index != 0 && previous_chapter.lectures.length > 0){
        previous_lecture_id = previous_chapter.lectures[previous_chapter.lectures.length - 1]._id;
      }

    } else {
      previous_lecture_id = chapter.lectures[lecture_index - 1]._id;
    }

    if(lecture_index + 1 === chapter.lectures.length){

     if(chapter_index + 1 != this.course.chapters.length &&
        this.course.chapters[chapter_index + 1].lectures.length > 0){
        next_lecture_id = this.course.chapters[chapter_index + 1].lectures[0]._id;
      }

    } else {
      next_lecture_id = chapter.lectures[lecture_index + 1]._id;
    }

    this.previous_lecture_id = previous_lecture_id;
    this.next_lecture_id = next_lecture_id;
  }

  getIndices(){
    for(let i = 0; i < this.course.chapters.length; i++){
      for(let j = 0; j < this.course.chapters[i].lectures.length; j++){
        if(this.course.chapters[i].lectures[j]._id === this.lecture._id){
          this.setLectureNavigationButtons(i,j);
          return;
        }
      }
    }
  }

  getLectureOrder(lecture_id) : number {
    let lecture_order: number = 1;
    for(let i = 0; i < this.course.chapters.length; i++){
      for(let j = 0; j < this.course.chapters[i].lectures.length; j++){
        if(this.course.chapters[i].lectures[j]._id === lecture_id){
          return lecture_order;
        }
        lecture_order++;
      }
    }
    return 1;
  }

  markAsWatched(lecture_id: string){
    if(this.user_course_data.watched_lectures_ids.indexOf(lecture_id) === -1){
      this.user_course_data.watched_lectures_ids.push(lecture_id);
    }
    this.user_course_data.last_lecture_id = lecture_id;
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
