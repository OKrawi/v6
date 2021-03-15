import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service'
import { Report } from './report.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportsService {

  reports : Report[];
  reportsChanged = new Subject<Report[]>();

  constructor(
    private http:Http,
    private authService: AuthService
  ) { }

  getReports(
    resolved: boolean,
    not_resolved: boolean,
    is_removed: boolean,
    suspect_banned: boolean,
    is_ignored: boolean,
    abuseType: string){

    let params = {
      resolved: resolved,
      not_resolved: not_resolved,
      is_removed: is_removed,
      suspect_banned: suspect_banned,
      is_ignored: is_ignored,
      abuseType: abuseType
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('reports');
    return this.http.get(ep, {headers: headers, params: params})
      .map((res) => {
        if (res.json().success) {
          this.reports = res.json().reports;
        }
        return res.json();
      });
  }

  banUser(suspect_id: string){
    let body = {
      suspect_id: suspect_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/ban");
    return this.http.put(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          console.log('success');

          this.reports.map((report) => {
            if(report.suspect._id === suspect_id ){
              report.resolved = true;
              report.suspect_banned = true;
            }
          });

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      });
  }

  IgnoreReport(report_id: string){
    let body = {
      // report_id: report_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/ignore/" + report_id );
    console.log(ep);
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          this.reports.map((report) => {
            if(report._id === report_id ){
              report.resolved = true;
              report.is_ignored = true;
            }
          });

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      });
  }

  // Delete a question
  deleteQuestion(question_id: string, suspect_id: string){
    let params = {
      suspect_id: suspect_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/questions/" + question_id);
    return this.http.delete(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){

          this.reports.map((report) => {
            if(!report.response_id && report.question_id === question_id){
              report.resolved = true;
              report.is_removed = true;
            }
          })

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      })
  }

  deleteResponse(response_id: string, suspect_id: string){
    let params = {
      suspect_id: suspect_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/responses/" + response_id);
    return this.http.delete(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){

          this.reports.map((report) => {
            if(report.response_id === response_id){
              report.resolved = true;
              report.is_removed = true;
            }
          })

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      });
  }

  deleteAnnouncement(announcement_id: string, suspect_id: string){
    let params = {
      suspect_id: suspect_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/announcements/" + announcement_id);
    return this.http.delete(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){

          this.reports.map((report) => {
            if(!report.comment_id && report.announcement_id === announcement_id){
              report.resolved = true;
              report.is_removed = true;
            }
          })

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      });
  }

  deleteComment(comment_id: string, suspect_id: string){
    let params = {
      suspect_id: suspect_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("reports/comments/" + comment_id);
    return this.http.delete(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){

          this.reports.map((report) => {
            if(report.comment_id === comment_id){
              report.resolved = true;
              report.is_removed = true;
            }
          })

          this.reportsChanged.next(this.reports.slice());
        }
        return res.json();
      })
  }

  resetReports(){
    this.reports = [];
  }



  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
