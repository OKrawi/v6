import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Announcement } from './announcement.model';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../services/auth.service'

@Injectable()
export class InstructorAnnouncementService {

  announcements : Announcement[] = [];
  announcementsChanged = new Subject<Announcement[]>();
  moreAnnouncementsAvailable: boolean = true;

  course_title_dashed: string;

  constructor(
    private http: Http,
    private authService: AuthService,
    // private coursesService: CoursesService
  ) { }

  // Post a new announcement
  newAnnouncement(announcement: any){
    let body = {
      course_title_dashed: this.course_title_dashed,
      announcement_title: announcement.title,
      announcement_body: announcement.body
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('announcements');
    return this.http.post(ep, body, {headers: headers})
      .map(
        (res) => {
        if(res.json().success){
          if(this.announcements.length > 0 || !this.moreAnnouncementsAvailable){
            this.announcements.unshift(res.json().announcement);
            this.announcementsChanged.next(this.announcements.slice());
          }
        }
        return res.json();
      });
  }

  // // Get announcements
  getAnnouncements(course_title_dashed: string){

    // TODO : fix instructor route

    let params =  {
      instructor: true,
      course_title_dashed: course_title_dashed,
      last_announcement_id: ''
     }

     if (this.announcements.length > 0) {
       params.last_announcement_id = this.announcements[this.announcements.length - 1 ]._id;
     }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("announcements/");
    this.http.get(ep, {headers: headers, params: params })
      .map((res) => {
        if(res.json().success){

          this.course_title_dashed = course_title_dashed;

          for(let announcement of res.json().announcements){
            this.announcements.push(announcement);
          }

          if(res.json().announcements.length < 10){
            this.moreAnnouncementsAvailable = false
          }

          this.announcementsChanged.next(this.announcements.slice());
        }
      }).subscribe();
  }

  // Edit an announcement
  editAnnouncement(announcement: any, index: number){
    let body = {
      course_title_dashed: this.course_title_dashed,
      announcement_title: announcement.title,
      announcement_body: announcement.body,
      announcement_id: announcement._id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('announcements/');
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.announcements[index] = res.json().announcement;
          this.announcementsChanged.next(this.announcements.slice());
        }
        return res.json();
      });
  }

  // Delete an announcement
  deleteAnnouncement(announcement_id: string, index: number){
    let body = {
      course_title_dashed: this.course_title_dashed
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("announcements/" + announcement_id);
    this.http.delete(ep, {headers: headers, body: body})
      .map((res) => {
        if(res.json().success){
          this.announcements.splice(index, 1);
          this.announcementsChanged.next(this.announcements.slice());
        }
      }).subscribe();
  }

  resetAnnouncements(){
    this.announcements.length = 0;
    this.moreAnnouncementsAvailable = true;
    this.announcementsChanged.next(this.announcements.slice());
  }

  returnAnnouncements(){
    return this.announcements.slice();
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
