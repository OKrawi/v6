import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Course } from '../../course.model';
import { InstructorCoursesService } from '../../instructor-courses.service';

@Component({
  selector: 'app-instructor-course-goals',
  templateUrl: './instructor-course-goals.component.html',
  styleUrls: ['./instructor-course-goals.component.css']
})
export class InstructorCourseGoalsComponent implements OnInit, OnDestroy {

  course = new Course();
  courseGoalsForm: FormGroup;
  sub1: Subscription;
  courses: any[];
  formChanged: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private instructorCoursesService: InstructorCoursesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.loadCourse(params['course_title_dashed']);
    });

    this.courses = this.instructorCoursesService.returnCourses();
  }

  onSubmit() {
    this.formChanged = false;
    this.course.prerequisites = this.courseGoalsForm.value.prerequisites.map( item => item.course_title_dashed );
    this.course.goals = this.courseGoalsForm.value.goals.map( item => item.course_goal );

    let sub = this.instructorCoursesService.updateCourse(this.course).subscribe(data => {
      // if(data.success) {
      //   } else {
      // }
      sub.unsubscribe();
    });
  }

  private loadCourse(title_dashed: string){
    if(title_dashed === this.instructorCoursesService.course.title_dashed){
      this.course = this.instructorCoursesService.course;
      this.courses = this.instructorCoursesService.returnCourses();
    }

    this.initForm();

    this.sub1 = this.instructorCoursesService.courseChanged
    .subscribe((course: Course) => {
      this.course = course;
      this.courses = this.instructorCoursesService.returnCourses();
      this.initForm();
    });
  }

  onAddPrerequisites() {
    (<FormArray>this.courseGoalsForm.get('prerequisites')).push(
      new FormGroup({'course_title_dashed': new FormControl(null, Validators.required)})
    );
  }

  onDeletePrerequisites(index: number) {
    (<FormArray>this.courseGoalsForm.get('prerequisites')).removeAt(index);
    this.formChanged = true;
  }

  onAddGoals() {
    console.log('message');
    (<FormArray>this.courseGoalsForm.get('goals')).push(
      new FormGroup({'course_goal': new FormControl(null, Validators.required)})
    );
    // this.formChanged = true;
  }

  onDeleteGoals(index: number) {
    (<FormArray>this.courseGoalsForm.get('goals')).removeAt(index);
    this.formChanged = true;
  }

  private initForm() {
    let coursePrerequisites = new FormArray([]);
    let courseGoals = new FormArray([]);

    if (this.course.prerequisites && this.course.prerequisites.length > 0) {
      for (let prerequisite of this.course.prerequisites) {
        coursePrerequisites.push(new FormGroup({
            'course_title_dashed': new FormControl(prerequisite, Validators.required),
          }));
      }

    } else {
      coursePrerequisites.push(new FormGroup({
          'course_title_dashed': new FormControl(null, Validators.required),
        }));
    }


    if (this.course.goals && this.course.goals.length > 0) {
      for (let goal of this.course.goals) {
        courseGoals.push(new FormGroup({
            'course_goal': new FormControl(goal, Validators.required),
          }));
      }
    } else {
      courseGoals.push(new FormGroup({
          'course_goal': new FormControl(null, Validators.required),
        }));
    }

    this.courseGoalsForm = new FormGroup({
      'prerequisites': coursePrerequisites,
      'goals': courseGoals
      // 'prerequisites': new FormArray([
        // new FormControl(null)
      // ])
    });

  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    // this.sub2.unsubscribe();
    // this.sub4.unsubscribe();
  }

}
