import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnnouncementsService } from '../../announcements.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Announcement } from '../../announcement.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-course-announcements-list',
  templateUrl: './course-announcements-list.component.html',
  styleUrls: ['./course-announcements-list.component.css']
})
export class CourseAnnouncementsListComponent implements OnInit, OnDestroy {

  course_title_dashed: string;
  announcements: Announcement[];

  sub1: Subscription;

  constructor(
    private announcementService : AnnouncementsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      this.course_title_dashed = params['course_title_dashed'];
    });

    this.announcements = this.announcementService.returnAnnouncements();

    if(this.announcements.length < 1){
      this.onLoadAnnouncements();
    } 

    this.sub1 = this.announcementService.announcementsChanged
    .subscribe((announcements: Announcement[]) => {
      this.announcements = announcements;
    });

  }

  onLoadAnnouncements(){
    let sub = this.announcementService.getAnnouncements(this.course_title_dashed)
      .subscribe((data) => {
        sub.unsubscribe();
      });
  }

  setIndex(index: number){
    this.announcementService.setAnnouncementIndex(index);
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }

}
