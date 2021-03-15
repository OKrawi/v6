import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from "ng2-file-upload/file-upload/file-upload.module";
import { DragulaModule } from 'ng2-dragula';

import { InstructorDashboardNavBarComponent } from './instructor-dashboard/instructor-dashboard-nav-bar/instructor-dashboard-nav-bar.component';
import { InstructorEditCourseComponent } from './instructor-course-management/instructor-edit-course/instructor-edit-course.component';
import { InstructorCoursesSnippetListComponent } from './instructor-dashboard/instructor-courses-snippet-list/instructor-courses-snippet-list.component';
import { InstructorCourseManagementComponent } from './instructor-course-management/instructor-course-management.component';
import { InstructorCourseNavBarComponent } from './instructor-course-management/instructor-course-nav-bar/instructor-course-nav-bar.component';
import { InstructorCurriculumManagementComponent } from './instructor-course-management/instructor-curriculum-management/instructor-curriculum-management.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { InstructorNewCourseComponent } from './instructor-new-course/instructor-new-course.component';
import { InstructorCourseDeleteComponent } from './instructor-course-management/instructor-course-delete/instructor-course-delete.component';
import { InstructorChapterComponent } from './instructor-course-management/instructor-curriculum-management/instructor-chapter/instructor-chapter.component';
import { InstructorLectureComponent } from './instructor-course-management/instructor-curriculum-management/instructor-chapter/instructor-lecture/instructor-lecture.component';
import { InstructorAnnouncementsListComponent } from './instructor-course-management/instructor-announcements-list/instructor-announcements-list.component';
import { InstructorAnnouncementComponent } from './instructor-course-management/instructor-announcements-list/instructor-announcement/instructor-announcement.component';
import { InstructorCourseGoalsComponent } from './instructor-course-management/instructor-course-goals/instructor-course-goals.component';
import { InstructorCourseInformationComponent } from './instructor-course-management/instructor-course-information/instructor-course-information.component';
import { InstructorCourseMediaComponent } from './instructor-course-management/instructor-course-media/instructor-course-media.component';
import { AnnouncementFormComponent } from './instructor-course-management/instructor-announcements-list/announcement-form/announcement-form.component';

import { InstructorCoursesService } from './instructor-courses.service';
import { InstructorCurriculumService } from './instructor-curriculum.service';
import { InstructorAnnouncementService } from './instructor-announcement.service';

import { InstructorRoutingModule } from './instructor-routing.module';
import { SharedModule } from '../shared/shared.module';

import { TinymceModule } from 'angular2-tinymce';
import { InstructorBiographyComponent } from './instructor-biography/instructor-biography.component';
import { InstructorBiographyService } from './instructor-biography.service';

let TinymceModuleConfig = {
  plugins: ['image', 'codesample', 'paste', 'autoresize', 'link', 'code'],
  menubar: "",
  toolbar: 'link image codesample code',
  codesample_languages: [
    {text: 'HTML/XML', value: 'markup'},
    {text: 'JavaScript', value: 'javascript'},
    {text: 'CSS', value: 'css'},
    {text: 'TypeScript', value: 'typescript'},
    {text: 'JSON', value: 'json'}
  ],
  // language: 'ar',
  default_link_target: "_blank",
  paste_data_images: true,
  statusbar: false,
  auto_focus: false
};

@NgModule({
  declarations: [
    InstructorDashboardNavBarComponent,
    InstructorEditCourseComponent,
    InstructorCoursesSnippetListComponent,
    InstructorCourseManagementComponent,
    InstructorCourseNavBarComponent,
    InstructorCurriculumManagementComponent,
    InstructorDashboardComponent,
    InstructorNewCourseComponent,
    InstructorCourseDeleteComponent,
    InstructorChapterComponent,
    InstructorLectureComponent,
    InstructorAnnouncementsListComponent,
    InstructorAnnouncementComponent,
    AnnouncementFormComponent,
    InstructorCourseGoalsComponent,
    InstructorCourseInformationComponent,
    InstructorCourseMediaComponent,
    InstructorBiographyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    ReactiveFormsModule,
    InstructorRoutingModule,
    FileUploadModule,
    SharedModule,
    TinymceModule.withConfig(TinymceModuleConfig)
  ],
  providers: [
    InstructorCoursesService,
    InstructorCurriculumService,
    InstructorAnnouncementService,
    InstructorBiographyService
  ]
})
export class InstructorModule { }
