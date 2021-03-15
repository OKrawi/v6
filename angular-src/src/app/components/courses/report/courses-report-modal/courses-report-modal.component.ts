import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-report-modal',
  templateUrl: './courses-report-modal.component.html',
  styleUrls: ['./courses-report-modal.component.css']
})
export class CoursesReportModalComponent implements OnInit {
  reportForm: FormGroup;

  constructor(
    private reportsService : ReportsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.reportForm = new FormGroup({
      'abuseType': new FormControl(null),
      'body': new FormControl(null)
    });
  }

  onToSupport(){
    this.router.navigate(['support']);
  }



  onToReport(){
    let sub = this.reportsService.report(this.reportForm.value)
      .subscribe((data)=> {
        this.reportForm.reset();
        sub.unsubscribe();
      });
  }

}
