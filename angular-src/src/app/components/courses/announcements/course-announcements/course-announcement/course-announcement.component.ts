import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Announcement } from '../../announcement.model';
import { AnnouncementsService } from '../../announcements.service';
// import { AuthService } from '../../../../../services/auth.service';
// import { CoursesService } from '../../../courses.service';
import { ReportsService } from '../../../report/reports.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as Prism from "prismjs";

@Component({
  selector: 'app-course-announcement',
  templateUrl: './course-announcement.component.html',
  styleUrls: ['./course-announcement.component.css']
})
export class CourseAnnouncementComponent implements OnInit, OnDestroy {

  announcement = new Announcement();
  moreCommentsAvailable: boolean = true;

  newComment: string;
  sub1: Subscription;

    constructor(
      // private authService : AuthService,
      private announcementService : AnnouncementsService,
      // private coursesService : CoursesService,
      private reportsService : ReportsService,
      private route: ActivatedRoute,
      private router: Router,
  ) { }

  ngOnInit() {
    this.sub1 = this.announcementService.selectedAnnouncementChanged
    .subscribe((announcement: Announcement) => {
      this.announcement = announcement;
      this.moreCommentsAvailable = this.announcementService.moreCommentsAvailable;
    });

    if (this.announcementService.returnAnnouncements().length > 0 ) {
        this.announcementService.getAnnouncement();
        setTimeout(Prism.highlightAll, 10);
    } else {

      let course_title_dashed = this.route.parent.parent.snapshot.params.course_title_dashed;
      let announcement_id = this.route.snapshot.params.announcement_id;

      let sub = this.announcementService.getAnnouncementViaSubscribtion(course_title_dashed, announcement_id)
        .subscribe((data: any) => {
          if(data.success){
            setTimeout(Prism.highlightAll, 10);
          } else {
            this.router.navigate(['../'], {relativeTo: this.route});
          }
          sub.unsubscribe();
        });
      }

  }

  onToComment(){
    let sub = this.announcementService.newComment(this.announcement._id, this.newComment)
      .subscribe(data => {
        if(data.success) {
          this.newComment = '';
        } else {
        }
        sub.unsubscribe();
      });
  }

  onLoadComments(){
    let sub = this.announcementService.getComments(this.announcement._id,
      this.announcement.comments[this.announcement.comments.length - 1]._id)
      .subscribe((data) => {
        if(data.success){
        }
        sub.unsubscribe();
      });
  }

  OnToReport(){
    this.reportsService.setBody(null,
                                null,
                                this.announcement._id,
                                null,
                                this.announcement.user._id,
                                this.announcement.title,
                                this.announcement.body
                              );
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
