import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Announcement } from './announcement.model';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../../services/auth.service'

@Injectable()
export class AnnouncementsService {

  loading : boolean = true;

  announcements : Announcement[] = [];
  announcementsChanged = new Subject<Announcement[]>();
  moreAnnouncementsAvailable: boolean = true;

  selectedAnnouncement: Announcement;
  selectedAnnouncementChanged = new Subject<Announcement>();

  course_title_dashed: string;

  announcementIndex: number;
  moreCommentsAvailable: boolean = true;

  constructor(
    private http: Http,
    private authService: AuthService,
  ) { }

  // Get announcements
  getAnnouncements(course_title_dashed: string){
    let params =  {
      course_title_dashed: course_title_dashed,
      last_announcement_id: ''
     }

     if (this.announcements.length > 0) {
       params.last_announcement_id = this.announcements[this.announcements.length - 1 ]._id;
     }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("announcements/");
    return this.http.get(ep, {headers: headers, params: params })
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

          setTimeout(()=>{
            this.loading = false;
          },1000);
          return res.json();
      }
    })
  }

  // Get details about one announcement
  getAnnouncement(){
    this.selectedAnnouncement = this.announcements[this.announcementIndex];

    if(this.selectedAnnouncement.comments.length < 8 ){
      this.moreCommentsAvailable = false;
    } else {
      this.moreCommentsAvailable = true;
    }

    this.selectedAnnouncementChanged.next(this.selectedAnnouncement);
  }

  getAnnouncementViaSubscribtion(course_title_dashed:string, announcement: string){
    let params = {
      course_title_dashed: course_title_dashed
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("announcements/" + announcement);
    return this.http.get(ep, {headers: headers, params: params })
    .map((res) => {
      if(res.json().success){

        this.course_title_dashed = course_title_dashed;

        this.selectedAnnouncement = res.json().announcement;

        if(this.selectedAnnouncement.comments.length < 8 ){
          this.moreCommentsAvailable = false;
        } else {
          this.moreCommentsAvailable = true;
        }

        this.selectedAnnouncementChanged.next(this.selectedAnnouncement);

        // setTimeout(()=>{
        //   this.loading = false;
        // },1000);
      }
      return res.json();
    })
  }

  // Get Comments
  getComments(announcement: string, last_comment_id: string){
    let params = {
      announcement: announcement,
      last_comment_id: last_comment_id
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("comments/");
    return this.http.get(ep, {headers: headers, params: params})
    .map((res) => {
      if(res.json().success){
        for(let comment of res.json().comments){
          this.selectedAnnouncement.comments.push(comment);
        }

        if(res.json().comments.length < 8 ){
          this.moreCommentsAvailable = false;
        }

        this.selectedAnnouncementChanged.next(this.selectedAnnouncement);
      }
      return res.json();
    });
  }

  // Post a new comment
  newComment(announcement: string, comment_body: string){
    let body = {
      course_title_dashed: this.course_title_dashed,
      announcement: announcement,
      comment_body: comment_body
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('comments/');
    return this.http.post(ep, body, {headers: headers})
      .map((res) => {
        // console.log(res.json());
        if(res.json().success){
          this.selectedAnnouncement.comments.unshift(res.json().comment);
          this.selectedAnnouncementChanged.next(this.selectedAnnouncement);
        }
        return res.json();
      });
  }

  // Edit a comment
  editComment(comment: any, comment_index: number){
    let body = {
      comment_id: comment._id,
      comment_body: comment.body
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('comments/' + comment._id);
    this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedAnnouncement.comments[comment_index] = res.json().comment;
          this.selectedAnnouncementChanged.next(this.selectedAnnouncement);
        }
      }).subscribe();
  }

  // Delete a comment
  deleteComment(comment_id: string, comment_index: number){
    let body = {
      announcement: this.selectedAnnouncement._id,
      comment_id: comment_id
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("comments/");
    return this.http.delete(ep, {headers: headers, body: body})
      .map((res) => {
        if(res.json().success){
          this.selectedAnnouncement.comments.splice(comment_index, 1);
          this.selectedAnnouncementChanged.next(this.selectedAnnouncement);
        }
        return res.json();
      });
  }

  resetAnnouncements(){
    this.announcements.length = 0;
    this.moreAnnouncementsAvailable = true;
    this.announcementsChanged.next(this.announcements.slice());
  }

  setAnnouncementIndex(index: number){
    this.announcementIndex = index;
  }

  returnAnnouncements(){
    return this.announcements.slice();
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
