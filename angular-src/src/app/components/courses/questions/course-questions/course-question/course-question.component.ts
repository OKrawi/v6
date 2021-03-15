import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../../../services/auth.service';
import { QuestionsService } from '../../questions.service';
import { Question } from '../../question.model';
import { ReportsService } from '../../../report/reports.service';
import { CoursesService } from '../../../courses.service';
import * as Prism from "prismjs";

@Component({
  selector: 'app-course-question',
  templateUrl: './course-question.component.html',
  styleUrls: ['./course-question.component.css']
})
export class CourseQuestionComponent implements OnInit, OnDestroy {

  editMode: boolean = false;
  sub1: Subscription;
  following: boolean = false;
  selectedAsUsefulQuestionByUser : boolean = false;

  newResponse: string = '';
  addingNewResponse: boolean = false;
  question: Question = new Question();

  moreResponsesAvailable: boolean = true;

  responses_loading: boolean = true;

  constructor(
              private questionsService : QuestionsService,
              private coursesService : CoursesService,
              private reportsService : ReportsService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
            ) { }

  ngOnInit() {

    this.sub1 = this.questionsService.selectedQuestionChanged
    .subscribe((question: Question) => {
      this.question = question;
      this.moreResponsesAvailable = this.questionsService.moreResponsesAvailable;
      this.responses_loading = false;

      if(this.question.followers.indexOf(this.authService.getUserId()) > -1){
        this.following = true;
      } else {
        this.following = false;
      }
      if(this.question.voters.length > 0){
        this.selectedAsUsefulQuestionByUser = this.question.voters.indexOf(this.authService.getUserId()) > -1;
      } else {
        this.selectedAsUsefulQuestionByUser = false;
      }

      setTimeout(Prism.highlightAll, 10);

    });

    if (this.questionsService.returnQuestions().length > 0 && this.questionsService.getQuestionIndex() > 0) {
        this.questionsService.getQuestion();
        this.moreResponsesAvailable = this.questionsService.moreResponsesAvailable;
    } else {
      let course_title_dashed = this.route.parent.parent.snapshot.params.course_title_dashed ?
          this.route.parent.parent.snapshot.params.course_title_dashed: this.route.parent.parent.parent.snapshot.params.course_title_dashed;
      let question_id = this.route.snapshot.params.question_id;

      this.questionsService.getQuestionViaSubscribtion(course_title_dashed, question_id);
      }
  }

  // ngAfterViewInit() {
  // }

  onToDelete(){
    this.questionsService.deleteQuestion();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onToResponse(){
    this.addingNewResponse = false;
    let sub = this.questionsService.newResponse(this.question._id, this.newResponse)
      .subscribe(data => {
        if(data.success) {
          this.newResponse = '';

        } else {
        }
        sub.unsubscribe();
      });
  }

  onLoadResponses(){
    this.responses_loading = true;
    this.questionsService.getResponses(this.question._id, this.question.responses[this.question.responses.length - 1]._id)
  }

  onToFollow(){
    this.questionsService.follwoQuestion(this.question._id, this.following);
  }

  OnMarkQuestionAsUseful(){
    this.questionsService.markQuestionAsUseful(this.question._id)
  }

  endEditMode(){
    this.editMode = false;
    setTimeout(Prism.highlightAll, 10);
  }

  OnToReport(){
    this.reportsService.setBody(this.question._id,
                                null,
                                null,
                                null,
                                this.question.user._id,
                                this.question.title,
                                this.question.body
                              );
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    // this.questionsService.resetQuestions();
  }
}
