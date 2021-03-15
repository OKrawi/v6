import { Component, OnInit, OnDestroy } from '@angular/core';
import { InstructorAnnouncementService } from '../../instructor-announcement.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Announcement } from '../../announcement.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-instructor-announcements-list',
  templateUrl: './instructor-announcements-list.component.html',
  styleUrls: ['./instructor-announcements-list.component.css']
})
export class InstructorAnnouncementsListComponent implements OnInit, OnDestroy {

  makeAnouncement: boolean = false;
  course_title_dashed: string;
  announcements: Announcement[];
  moreAnnouncementsAvailable: boolean = true;

  sub1: Subscription;

  constructor(
    private instructorAnnouncementService : InstructorAnnouncementService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
      this.course_title_dashed = (params['course_title_dashed']);
    });

    if(this.course_title_dashed != this.instructorAnnouncementService.course_title_dashed){
      this.instructorAnnouncementService.resetAnnouncements();
    }

    this.announcements = this.instructorAnnouncementService.returnAnnouncements();

    if(this.announcements.length < 1){
      this.onLoadAnnouncements();
    }

    this.sub1 = this.instructorAnnouncementService.announcementsChanged
    .subscribe((announcements: Announcement[]) => {
      this.announcements = announcements;
      this.moreAnnouncementsAvailable = this.instructorAnnouncementService.moreAnnouncementsAvailable;
    });
  }

  onLoadAnnouncements(){
    this.instructorAnnouncementService.getAnnouncements(this.course_title_dashed);
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
