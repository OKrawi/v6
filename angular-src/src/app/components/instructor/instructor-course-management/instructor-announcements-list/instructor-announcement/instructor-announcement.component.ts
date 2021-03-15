import { Component, OnInit, Input } from '@angular/core';
import { Announcement } from '../../../announcement.model';
import { InstructorAnnouncementService } from '../../../instructor-announcement.service';
import * as Prism from "prismjs";

@Component({
  selector: 'app-instructor-announcement',
  templateUrl: './instructor-announcement.component.html',
  styleUrls: ['./instructor-announcement.component.css']
})
export class InstructorAnnouncementComponent implements OnInit {

  @Input() announcement: Announcement;
  @Input() index: number;

  editAnnouncement: boolean = false;

  constructor(
    private instructorAnnouncementService : InstructorAnnouncementService,

  ) { }

  ngOnInit() {
    setTimeout(Prism.highlightAll, 10);
  }

  onDeleteAnnouncements(){
    if(confirm("You are about to delete a chapter, continue?")) {
      this.instructorAnnouncementService.deleteAnnouncement(this.announcement._id, this.index);
    }
  }

}
