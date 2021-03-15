import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Question } from '../../question.model';
import { QuestionsService } from '../../questions.service';
// import { AuthService } from '../../../../../services/auth.service';
// import { CoursesService } from '../../../courses.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {

  @Input() editedQuestion: Question;
  questionForm: FormGroup;
  @Output() editModeOver = new EventEmitter<boolean>();

  questionBody: FormControl;
  questionTitle: FormControl;

  constructor(
    // private coursesService : CoursesService,
    private questionsService : QuestionsService,
    private router: Router,
    private route: ActivatedRoute,
    // private authService: AuthService
  ) { }

  ngOnInit() {
    this.questionTitle = new FormControl(null, [Validators.required]),
    this.questionBody = new FormControl();

    if(this.editedQuestion){
      this.questionTitle.setValue(this.editedQuestion.title);
      this.questionBody.setValue(this.editedQuestion.body);
    }
  }

  onSubmit() {
    let question = {
      title: this.questionTitle.value,
      body: this.questionBody.value,
      _id: ''
    }

    if(this.editedQuestion){
      question._id = this.editedQuestion._id;

      let sub = this.questionsService.editQuestion(question).subscribe(data => {
        if(data.success) {
          this.editModeOver.emit(false);
          } else {
        }
        sub.unsubscribe();
      });
    } else {
      let sub = this.questionsService.newQuestion(question).subscribe(data => {
        if(data.success) {
              this.router.navigate(['../'], {relativeTo: this.route});
          } else {
        }
        sub.unsubscribe();
      });
    }
  }

  cancelEdit(){
    this.editModeOver.emit(false);
  }
}
