import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../../services/auth.service'
import { CoursesService } from '../courses.service'
import { Router } from '@angular/router';

@Injectable()
export class ReportsService {

  body = {
    question_id: '',
    response_id: '',
    announcement_id: '',
    comment_id: '',
    course_title_dashed: '',
    item_title: '',
    item_body: '',
    abuseType: '',
    body: '',
    suspect_id: ''
  }

  constructor(
    private http:Http,
    private authService: AuthService,
    private coursesService: CoursesService,
    private router: Router,
  ) { }

  setBody(question_id: string,
          response_id: string,
          announcement_id:string,
          comment_id: string,
          suspect_id: string,
          item_title: string,
          item_body: string
         ){

    this.body = {
      question_id: question_id,
      response_id: response_id,
      announcement_id: announcement_id,
      comment_id: comment_id,
      course_title_dashed: this.coursesService.course.title_dashed,
      item_title: item_title,
      item_body: item_body,
      abuseType: '',
      body: '',
      suspect_id: suspect_id
    }
  }

  report(report: any){
    this.body.abuseType = report.abuseType;
    this.body.body = report.body;

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization', this.authService.getToken());
    let ep = this.prepEndpoint('reports');
    return this.http.post(ep, this.body, { headers: headers })
      .map(res => res.json());
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
