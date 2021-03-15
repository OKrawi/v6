import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions/questions.service';
import { AnnouncementsService } from '../announcements/announcements.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  constructor(
              private questionsService : QuestionsService,
              private announcementsService : AnnouncementsService,
            ) { }

  ngOnInit() {
    this.questionsService.resetQuestions();
    this.announcementsService.resetAnnouncements();
  }

}
