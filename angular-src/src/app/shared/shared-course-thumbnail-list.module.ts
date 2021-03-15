import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesThumbnailsListComponent } from '../components/courses/courses-thumbnails-list/courses-thumbnails-list.component';

@NgModule({
  declarations: [
    CoursesThumbnailsListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    CoursesThumbnailsListComponent
  ]
})
export class SharedCourseThumbnailListModule {}
