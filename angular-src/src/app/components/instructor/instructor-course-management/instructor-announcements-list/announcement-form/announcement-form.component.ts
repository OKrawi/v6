import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Announcement } from '../../../announcement.model';
import { InstructorAnnouncementService } from '../../../instructor-announcement.service';

@Component({
  selector: 'app-announcement-form',
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.css']
})
export class AnnouncementFormComponent implements OnInit {

  @Input() announcement : Announcement;
  @Input() index : number;
  editMode: boolean = false;

  announcementForm: FormGroup;
  @Output() announcementMade = new EventEmitter<boolean>();

  constructor(
    private instructorAnnouncementService : InstructorAnnouncementService,

  ) { }

  ngOnInit() {
    this.announcementForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'body': new FormControl(null, [Validators.required])
    });

    if(this.announcement){
      this.editMode = true;
      this.announcementForm.setValue({
        'title' : this.announcement.title,
        'body' : this.announcement.body
      });
    }
  }

  onSubmit() {
    let announcement = {
      title: this.announcementForm.value.title,
      body: this.announcementForm.value.body,
      _id: ''
    }
    if(!this.editMode){
      let sub = this.instructorAnnouncementService.newAnnouncement(announcement)
      .subscribe((data) => {
        if(data.success) {
          this.announcementMade.emit(false);
        } else {}
        sub.unsubscribe();
      });
    } else {
      announcement._id = this.announcement._id;
      let sub = this.instructorAnnouncementService.editAnnouncement(announcement, this.index)
      .subscribe((data) => {
        if(data.success) {
          this.announcementMade.emit(false);
        } else {}
        sub.unsubscribe();
      });
    }
  }

}
