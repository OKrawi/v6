import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { InstructorCurriculumService } from '../../instructor-curriculum.service';
import { Subscription } from 'rxjs/Subscription';

import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-instructor-curriculum-management',
  templateUrl: './instructor-curriculum-management.component.html',
  styleUrls: ['./instructor-curriculum-management.component.css']
})
export class InstructorCurriculumManagementComponent implements OnInit, OnDestroy {

  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;

  dragSub1: Subscription;
  dragSub2: Subscription;
  dragSub4: Subscription;

  addingChapterActive: Boolean = false;
  new_chapter_title: string;
  course_title_dashed: string = "";
  chapters : string[] = [];
  lectures : string[][] = [];

  chapterForm: FormGroup;

  options: any = {
    moves: function (el, container, handle) {
      return handle.classList.contains('handle');
      // return handle.className === 'handle';
    }
  }

  from_index: number;
  to_index: number;

  form_id: string;

  from_chapter_index: number;

  constructor(
    private instructorCurriculumService : InstructorCurriculumService,
    private router: Router,
    private route: ActivatedRoute,
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
    this.route.parent.params
      .subscribe( (params : Params) => {
        this.course_title_dashed = params['course_title_dashed'];
        this.initCurriculum();
      });

    this.sub4 = this.instructorCurriculumService.chaptersChanged
      .subscribe(
        (chapters: string[]) => {
          this.chapters = chapters;
        }
      );

    this.sub5 = this.instructorCurriculumService.lecturesChanged
      .subscribe(
        (lectures: string[][]) => {
          this.lectures = lectures;
        }
      );

    this.initForm();

    this.dragSub1 = this.dragulaService.drag.subscribe((value) => {
      this.onDrag(value.slice(1));
    });

    this.dragSub2 = this.dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });

  }

  private onDrag(args) {
    let [e, el] = args;
    let index = this.getElementIndex(e);
    this.from_index = index;

    this.form_id = e.parentElement.dataset.bag;
    this.from_chapter_index = e.parentElement.dataset.chapterindex;
  }

  private onDrop(args) {
    let [e, el] = args;
    let index = this.getElementIndex(e);
    this.to_index = index;


    if(e.parentElement.dataset.bag === 'curriculum-bag'){
      let dragSub = this.instructorCurriculumService
      .reorderChapters(this.course_title_dashed, this.from_index, this.to_index)
      .subscribe((data) => {
        if(!data.success) {
          console.log(data.msg);
        }
        dragSub.unsubscribe();
      });
    } else {
      let to_id = e.parentElement.dataset.bag;
      let to_chapter_index = e.parentElement.dataset.chapterindex;

      this.dragSub4 = this.instructorCurriculumService.reorderLectures(
        this.form_id,
        to_id,
        this.from_chapter_index,
        to_chapter_index,
        this.from_index,
        this.to_index
      ).subscribe((data) => {
          if(!data.success) {
          }
      });
    }
  }

  private getElementIndex(el: any) {
    return [].slice.call(el.parentElement.children).indexOf(el);
  }

  private initForm() {
    this.chapterForm = new FormGroup({
      'chapter_title': new FormControl(null, Validators.required)
    });
  }

  private initCurriculum(){
    this.sub3 = this.instructorCurriculumService.getCurriculum(this.course_title_dashed)
      .subscribe((data) => {
          if(data.success) {
          }
      });
  }

  onAddChapter(){
    this.addingChapterActive = true;
  }

  onCancelAddChapter(){
    this.chapterForm.reset();
    this.addingChapterActive = false;
  }

  onCreateChapter(){
    let sub = this.instructorCurriculumService.newChapter(this.course_title_dashed, this.chapterForm.value)
      .subscribe(data => {
        if(data.success) {
          this.onCancelAddChapter();
        }
        sub.unsubscribe();
    });
  }

  ngOnDestroy(){
    this.sub3.unsubscribe();
    this.sub4.unsubscribe();
    this.sub5.unsubscribe();
    this.dragSub1.unsubscribe();
    this.dragSub2.unsubscribe();
  }
}
