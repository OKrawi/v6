import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDisplayComponent } from './category-display/category-display.component';

import { HomeRoutingModule } from './home-routing.module';

import { CoursesService } from '../courses/courses.service';


import { SharedCourseThumbnailListModule } from '../../shared/shared-course-thumbnail-list.module';


@NgModule({
  declarations: [
    HomeComponent,
    CategoriesListComponent,
    CategoryDisplayComponent,
  ],
  imports: [
    CommonModule,
    // FormsModule,

    SharedCourseThumbnailListModule,
    HomeRoutingModule
  ],
  providers: [
    CoursesService
  ]
})
export class HomeModule { }
