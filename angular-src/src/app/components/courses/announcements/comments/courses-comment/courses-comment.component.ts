import { Component, OnInit, Input } from '@angular/core';
import { Comment } from '../../comment.model';
import { AuthService } from '../../../../../services/auth.service';
import { AnnouncementsService } from '../../announcements.service';
import { ReportsService } from '../../../report/reports.service';
// import { CoursesService } from '../../../courses.service';

@Component({
  selector: 'app-courses-comment',
  templateUrl: './courses-comment.component.html',
  styleUrls: ['./courses-comment.component.css']
})
export class CoursesCommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() index: number;

  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private announcementsService: AnnouncementsService,
    // private coursesService: CoursesService,
    private reportsService: ReportsService,
  ) { }

  ngOnInit() { }

  onEditComment(){
    this.announcementsService.editComment(this.comment, this.index);
  }

  onToDeleteComment(){
    let sub = this.announcementsService.deleteComment(this.comment._id, this.index)
      .subscribe(data => {
        if(data.success) {
        } else {
        }
        sub.unsubscribe();
      });
  }

  OnToReport(){
    this.reportsService.setBody(null,
                                null,
                                this.announcementsService.selectedAnnouncement._id,
                                this.comment._id,
                                this.comment.user._id,
                                null,
                                this.comment.body
                              );
  }

}
