import { Component, OnInit, Input } from '@angular/core';
import { Response } from '../../response.model';
import { AuthService } from '../../../../../services/auth.service';
import { QuestionsService } from '../../questions.service';
import { CoursesService } from '../../../courses.service';
import { ReportsService } from '../../../report/reports.service';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {
  @Input() response: Response;
  @Input() top_response_id: string;
  @Input() index: number;
  @Input() question_user_id: string;

  selectedAsUsefulResponseByUser : boolean = false;

  editMode: boolean = false;

  constructor(
    private questionsService : QuestionsService,
    // private coursesService : CoursesService,
    private authService: AuthService,
    private reportsService : ReportsService,
  ) { }

  ngOnInit() {

    if(this.response.voters.length > 0){
      this.getIsSelectedAsUsefulResponseByUser();
    }
  }

  onEditResponse(){
    this.questionsService.editResponse(this.response, this.index);
  }

  onToDeleteResponse(){
    let sub = this.questionsService.deleteResponse(this.response._id, this.index)
      .subscribe(data => {
        if(data.success) {
        } else {
        }
        sub.unsubscribe();
      });
  }

  OnMarkResponseAsUseful(){
    let sub = this.questionsService.markResponseAsUseful(this.response._id, this.index)
      .subscribe(data => {
        if(data.success){
          this.getIsSelectedAsUsefulResponseByUser();
        } else {
        }
        sub.unsubscribe();
      });
  }

  getIsSelectedAsUsefulResponseByUser(){
    this.selectedAsUsefulResponseByUser = this.response.voters.indexOf(this.authService.getUserId()) > -1;
  }

  OnMarkAsTopResponse(){
    let sub = this.questionsService.markAsTopResponse(this.response._id, this.index)
      .subscribe(data => {
        if(data.success){
        } else {
        }
        sub.unsubscribe();
      });
  }

  OnToReport(){
    this.reportsService.setBody(this.questionsService.selectedQuestion._id,
                                this.response._id,
                                null,
                                null,
                                this.response.user._id,
                                null,
                                this.response.body);
  }
}
