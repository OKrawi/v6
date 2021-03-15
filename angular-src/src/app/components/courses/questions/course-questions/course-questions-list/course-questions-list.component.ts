import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from '../../question.model';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { QuestionsService } from '../../questions.service';

@Component({
  selector: 'app-course-questions-list',
  templateUrl: './course-questions-list.component.html',
  styleUrls: ['./course-questions-list.component.css']
})
export class CourseQuestionsListComponent implements OnInit, OnDestroy {

  search: string;
  no_responses: boolean = false;
  sort_by_popularity: boolean = false;
  see_following: boolean = false;

  questions: Question[];
  sub1: Subscription;

  lecture_id: string;
  course_title_dashed: string;

  moreQuestionsAvailable: boolean = true;

  loading: boolean = true;

  constructor(
    private questionsService : QuestionsService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.search = this.questionsService.search ? this.questionsService.search : '';

    this.route.parent.parent.params.subscribe((params: Params) => {
      this.lecture_id = (params['lecture_id']);
      this.course_title_dashed = (params['course_title_dashed']);
    });

    this.questions = this.questionsService.returnQuestions();
    this.moreQuestionsAvailable = this.questionsService.moreQuestionsAvailable;

    if(this.questions.length < 1){
      this.onLoadQuestions();
    } else {
      this.loading = false;
    }

    this.sub1 = this.questionsService.questionsChanged
    .subscribe((questions: Question[]) => {
      this.questions = questions;
      this.moreQuestionsAvailable = this.questionsService.moreQuestionsAvailable;
      this.loading = false;
    });
  }

  onLoadQuestions(){
    this.loading = true;
    if(this.search.length === 0){
      this.questionsService.getQuestions(
        this.lecture_id,
        this.course_title_dashed,
        this.sort_by_popularity,
        this.no_responses,
        this.see_following
      );    
    } else {
      this.questionsService.searchQuestions(
        this.lecture_id,
        this.course_title_dashed,
        this.search,
        this.sort_by_popularity,
        this.no_responses,
        this.see_following
      );
    }
  }

  onSearch() {
    this.questionsService.resetQuestions();
    if(this.search.length === 0){
      this.onLoadQuestions();
    } else {
      this.questionsService.searchQuestions(
        this.lecture_id,
        this.course_title_dashed,
        this.search,
        this.sort_by_popularity,
        this.no_responses,
        this.see_following
      );
    }
  }

  onCheckNoResponses(){
    this.sort_by_popularity = false;
    this.no_responses = !this.no_responses;
    this.onSearch();
  }

  onCheckSortByPopularity(){
    this.no_responses = false;
    this.sort_by_popularity = !this.sort_by_popularity;
    this.onSearch();
  }

  onSeeFollowing(){
    this.see_following = !this.see_following;
    this.onSearch();
  }

  resetQuestionsIfSearching(){
    if(this.search.length > 0){
      this.questionsService.resetQuestions();
    }
  }

  setIndex(index: number){
    this.questionsService.setQuestionIndex(index);
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
  }
}
