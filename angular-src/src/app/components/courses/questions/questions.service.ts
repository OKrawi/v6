import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Question } from '../questions/question.model';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../../services/auth.service'
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable()
export class QuestionsService {

  loading: boolean = true;
  responses_loading: boolean = true;

  questions : Question[] = [];
  questionsChanged = new Subject<Question[]>();
  moreQuestionsAvailable: boolean = true;
  moreResponsesAvailable: boolean = true;

  selectedQuestion : Question;
  selectedQuestionChanged = new Subject<Question>();

  questionIndex: number;

  search: string;

  constructor(
    private http:Http,
    private authService: AuthService,
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  // Post a new question
  newQuestion(question: any){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      lecture_id: this.coursesService.lecture._id,
      question_title: question.title,
      question_body: question.body,
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('questions/');
    return this.http.post(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          if(this.questions.length > 0 || !this.moreQuestionsAvailable){
            this.questions.unshift(res.json().question)
            this.questionsChanged.next(this.questions.slice());
          }
        }
        return res.json();
      });
  }

  // Get questions
  getQuestions(lecture_id: string,
               course_title_dashed: string,
               sort_by_popularity: boolean,
               no_responses: boolean,
               see_following: boolean){

    this.loading = true;
    this.search = '';

    let params = {
      lecture_id: lecture_id,
      course_title_dashed: course_title_dashed,
      last_question_id: '',
      sort_by_popularity: sort_by_popularity,
      no_responses: no_responses,
      see_following: see_following
    }

    if (this.questions.length > 0) {
      params.last_question_id = this.questions[this.questions.length - 1 ]._id;
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("questions/");
     this.http.get(ep, {headers: headers, params: params})
      .map((res) => {
        if(res.json().success){
            for(let question of res.json().questions){
              this.questions.push(question);
            }

            if(res.json().questions.length < 10){
              this.moreQuestionsAvailable = false
            }

            this.questionsChanged.next(this.questions.slice());

            setTimeout(()=>{
              this.loading = false;
            },1000);
          }
      }).subscribe();
  }

  // Search questions
  searchQuestions(lecture_id: string,
                  course_title_dashed: string,
                  search: string,
                  sort_by_popularity: boolean,
                  no_responses: boolean,
                  see_following: boolean){

    this.loading = true;

    this.search = search;

    let params = {
      lecture_id: lecture_id,
      course_title_dashed: course_title_dashed,
      search: search,
      last_question_id: '',
      sort_by_popularity: sort_by_popularity,
      no_responses: no_responses,
      see_following: see_following
    }

    if (this.questions.length > 0) {
      params.last_question_id = this.questions[this.questions.length - 1 ]._id;
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("questions/");
     this.http.get(ep, {headers: headers,
       params: params})
      .map((res) => {
        if(res.json().success){

          for(let question of res.json().questions){
            this.questions.push(question);
          }

          if(res.json().questions.length < 10){
            this.moreQuestionsAvailable = false
          }

          this.questionsChanged.next(this.questions.slice());

          this.loading = false;

        }
      }).subscribe();
  }

  // Get details about one question
  getQuestion(){
    this.selectedQuestion = this.questions[this.questionIndex];

    if(this.selectedQuestion.responses.length < 12 ){
      this.moreResponsesAvailable = false;
    } else {
      this.moreResponsesAvailable = true;
    }
    this.selectedQuestionChanged.next(this.selectedQuestion);
  }

  getQuestionViaSubscribtion(course_title_dashed:string, question_id: string){
    // TODO : Check if we need loading here and go to course question component (and maybe course/lecture question list components) to do editing
    this.loading = true;

    let params = {
      course_title_dashed: course_title_dashed
    }
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("questions/" + question_id);
    let sub = this.http.get(ep, {headers: headers, params: params })
    .map((res) => {
      if(res.json().success){
        this.selectedQuestion = res.json().question;

        if(this.selectedQuestion.responses.length < 12 ){
          this.moreResponsesAvailable = false;
        } else {
          this.moreResponsesAvailable = true;
        }

        this.selectedQuestionChanged.next(this.selectedQuestion);

        setTimeout(()=>{
          this.loading = false;
        },1000);
      } else {
        this.router.navigate(['/courses/' + this.coursesService.course.title_dashed + '/questions']);
      }
    }).subscribe(() => sub.unsubscribe());
  }

  // Edit a question
  editQuestion(question: any){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      question_title: question.title,
      question_body: question.body
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('questions/' + question._id);
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.title = res.json().question.title;
          this.selectedQuestion.body = res.json().question.body;
          this.selectedQuestionChanged.next(this.selectedQuestion);

          this.questions[this.questionIndex] = res.json().question;
          this.questionsChanged.next(this.questions.slice());
        }
        return res.json();
      });
  }

  follwoQuestion(question_id: string, following: boolean){
    let body = {
      following: following
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('questions/' + question_id + '/follow');
    let sub =  this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          if (this.questions && this.questions.length > 0) {
            this.questions[this.questionIndex].followers = res.json().question.followers;
            this.questionsChanged.next(this.questions.slice());
          }

          this.selectedQuestion.followers = res.json().question.followers;
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
      }).subscribe(() => sub.unsubscribe());
  }

  markQuestionAsUseful(question_id: string){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      vote: this.selectedQuestion.voters.indexOf(this.authService.getUserId()) === -1 ? true : false
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('questions/' + question_id + '/vote/');
    let sub = this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.voters = res.json().question.voters;
          this.selectedQuestion.voters_count = res.json().question.voters_count;
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
      }).subscribe(() => sub.unsubscribe());
  }

  // Delete a question
  deleteQuestion(){
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("questions/" + this.selectedQuestion._id);
    this.http.delete(ep, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.questions.splice(this.questionIndex, 1);
          this.questionsChanged.next(this.questions.slice());
        }
      }).subscribe();
  }

  // Get Responses
  getResponses(question_id: string, last_response_id: string){

    this.responses_loading = true;
    let params = {
      question_id: question_id,
      last_response_id: last_response_id
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("responses/");
    this.http.get(ep, {headers: headers, params: params})
    .map((res) => {
      if(res.json().success){
        for(let response of res.json().responses){
          this.selectedQuestion.responses.push(response);
        }

        if(res.json().responses.length < 12 ){
          this.moreResponsesAvailable = false;
        }

        this.selectedQuestionChanged.next(this.selectedQuestion);

        this.responses_loading = false;
      }
    }).subscribe();
  }

  // Post a new response
  newResponse(question_id: string, response_body: string){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      question_id: question_id,
      response_body: response_body
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('responses/');
    return this.http.post(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.responses_count++;
          this.selectedQuestion.responses.push(res.json().response);
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
        return res.json();
      });
  }

  // Edit a question
  editResponse(response: any, index: number){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      response_body: response.body,
      response_id: response._id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('responses/' + response._id);
    let sub = this.http.put(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.responses[index] = res.json().response;
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
      }).subscribe(() => sub.unsubscribe());
  }

  markResponseAsUseful(response_id: string, index: number){
    let body = {
      course_title_dashed: this.coursesService.course.title_dashed,
      voters_count: this.selectedQuestion.responses[index].voters.indexOf(this.authService.getUserId()) === -1 ? 1 : -1
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('responses/' + response_id + '/vote/');
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.responses[index].voters = res.json().response.voters;
          this.selectedQuestion.responses[index].voters_count = res.json().response.voters_count;
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
        return res.json();
      });
  }

  markAsTopResponse(response_id: string, index: number){

    let body = {
      top_response_id : response_id,
      course_title_dashed: this.coursesService.course.title_dashed,
      remove_top_response_id: false
    }

    if(this.selectedQuestion.top_response_id === response_id){
      body.remove_top_response_id = true;
    }

    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('questions/' + this.selectedQuestion._id + '/top-response');
    return this.http.patch(ep, body, {headers: headers})
      .map((res) => {
        if(res.json().success){

          if(this.selectedQuestion.top_response_id === response_id){
            this.selectedQuestion.top_response_id = null;
          } else {
            this.selectedQuestion.top_response_id = response_id;
          }

          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
        return res.json();
      });
  }

  // Delete an asnwer
  deleteResponse(response_id: string, index: number){
    let body = {
      question_id: this.selectedQuestion._id,
      response_id: response_id
    }
    let headers = new Headers();
    headers.append('Authorization', this.authService.getToken());
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint("responses/");
    return this.http.delete(ep, {headers: headers, body: body})
      .map((res) => {
        if(res.json().success){
          this.selectedQuestion.responses_count--;
          this.selectedQuestion.responses.splice(index, 1);
          this.selectedQuestionChanged.next(this.selectedQuestion);
        }
        return res.json();
      });
  }

  resetQuestions(){
    this.questions.length = 0;
    this.moreQuestionsAvailable = true;
    this.questionsChanged.next(this.questions.slice());
  }

  setQuestionIndex(index: number){
    this.questionIndex = index;
  }

  getQuestionIndex(){
    return this.questionIndex;
  }

  returnQuestions(){
    return this.questions.slice();
  }

  prepEndpoint(ep){
      return 'http://localhost:8080/' + ep;
  }
}
