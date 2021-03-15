import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Subscription } from 'rxjs/Subscription';
import { Report } from '../report.model';

@Component({
  selector: 'app-admin-reports-list',
  templateUrl: './admin-reports-list.component.html',
  styleUrls: ['./admin-reports-list.component.css']
})
export class AdminReportsListComponent implements OnInit, OnDestroy {

  resolved: boolean = false;
  not_resolved: boolean = false;
  is_removed: boolean = false;
  suspect_banned: boolean = false;
  is_ignored: boolean = false;
  abuseType: string = "";

  sub1: Subscription;
  sub2: Subscription;

  reports : Report[];

  constructor(
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.loadReports();

    this.sub2 = this.reportsService.reportsChanged
    .subscribe((reports: Report[]) => {
      this.reports = reports;
    });
  }

  loadReports(){
    this.reportsService.resetReports();
    this.sub1 = this.reportsService.getReports(
      this.resolved,
      this.not_resolved,
      this.is_removed,
      this.suspect_banned,
      this.is_ignored,
      this.abuseType)
      .subscribe((data: any) => {
        this.reports = data.reports;
      });
  }

  selectAbuseType(abuseType){
    this.abuseType = abuseType;
    this.loadReports();
  }

  onCheckSeeResolvedOnly(){
    this.resolved = !this.resolved;
    this.loadReports();
  }

  onCheckSeeNotResolvedOnly(){
    this.not_resolved = !this.not_resolved;
    this.loadReports();
  }

  onCheckSeeRemovedOnly(){
    this.is_removed = !this.is_removed;
    this.loadReports();
  }

  onCheckSeeBannedOnly(){
    this.suspect_banned = !this.suspect_banned;
    this.loadReports();
  }

  onCheckSeeIgnoredOnly(){
    this.is_ignored = !this.is_ignored;
    this.loadReports();
  }

  ngOnDestroy(){
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
