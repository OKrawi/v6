import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDisplayComponent } from './category-display/category-display.component';

const homeRoutes: Routes = [

  { path: '', component: HomeComponent, children: [
    { path:'', component: CategoriesListComponent},
    { path:'categories/:category_title_dashed', component: CategoryDisplayComponent}
  ] }
]

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class  HomeRoutingModule{

}
