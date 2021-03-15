import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminReportsListComponent } from './admin-reports-list/admin-reports-list.component';

// import { AdminGuard } from '../../guards/admin.guard';

const adminRoutes: Routes = [
  { path:'', component: AdminComponent, children:[
    { path: 'reports', component: AdminReportsListComponent }
  ] }
]

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})

export class  AdminRoutingModule{

}
