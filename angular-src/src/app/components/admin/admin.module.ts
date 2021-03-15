import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { AdminNavBarComponent } from './admin-nav-bar/admin-nav-bar.component';

import { AdminService } from './admin.service';
import { ReportsService } from './reports.service';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminReportsListComponent } from './admin-reports-list/admin-reports-list.component';
import { AdminReportComponent } from './admin-report/admin-report.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminNavBarComponent,
    AdminReportsListComponent,
    AdminReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
  ],
  providers: [
    AdminService,
    ReportsService
  ]
})
export class AdminModule { }
