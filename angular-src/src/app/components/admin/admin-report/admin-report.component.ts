import { Component, OnInit, Input } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Report } from '../report.model';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.css']
})
export class AdminReportComponent implements OnInit {
  @Input() report: Report;
  @Input() index: number;

  constructor(
    private reportsService : ReportsService,

  ) { }

  ngOnInit() { }

  OnBanByQuestion(question_id: string, suspect_id: string, is_removed: boolean){
    this.OnBanUser(suspect_id);
    if(!is_removed){
      this.OnDeleteQuestion(question_id, suspect_id);
    }
  }

  OnDeleteQuestion(question_id: string, suspect_id: string){
    let sub = this.reportsService.deleteQuestion(question_id, suspect_id)
                .subscribe((data) => {
                  sub.unsubscribe();
                });;
  }

  OnBanByResponse(response_id: string, suspect_id: string, is_removed: boolean){
    this.OnBanUser(suspect_id);
    if(!is_removed){
      this.OnDeleteResponse(response_id, suspect_id);
    }
  }

  OnDeleteResponse(response_id: string, suspect_id: string){
    let sub = this.reportsService.deleteResponse(response_id, suspect_id)
                .subscribe((data) => {
                  sub.unsubscribe();
                });
  }

  OnBanByAnnouncement(announcement_id: string, suspect_id: string, is_removed: boolean){
    this.OnBanUser(suspect_id);
    if(!is_removed){
      this.OnDeleteAnnouncement(announcement_id, suspect_id);
    }
  }

  OnDeleteAnnouncement(announcement_id: string, suspect_id: string){
    let sub = this.reportsService.deleteAnnouncement(announcement_id, suspect_id)
                .subscribe((data) => {
                  sub.unsubscribe();
                });
  }

  OnBanByComment(comment_id: string, suspect_id: string, is_removed: boolean){
    this.OnBanUser(suspect_id);
    if(!is_removed){
      this.OnDeleteComment(comment_id, suspect_id);
    }
  }

  OnDeleteComment(comment_id: string, suspect_id: string){
    let sub = this.reportsService.deleteComment(comment_id, suspect_id)
                .subscribe((data) => {
                  sub.unsubscribe();
                });
  }

  OnBanUser(suspect_id: string){
    let sub = this.reportsService.banUser(suspect_id)
    .subscribe((data) => {
      sub.unsubscribe();
    });
  }

  OnIgnoreReport(report_id: string){
    let sub = this.reportsService.IgnoreReport(report_id)
    .subscribe((data) => {
      sub.unsubscribe();
    });
  }





}
