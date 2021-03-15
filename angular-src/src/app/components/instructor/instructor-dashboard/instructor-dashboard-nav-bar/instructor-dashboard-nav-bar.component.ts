import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard-nav-bar',
  templateUrl: './instructor-dashboard-nav-bar.component.html',
  styleUrls: ['./instructor-dashboard-nav-bar.component.css']
})
export class InstructorDashboardNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
) { }
  ngOnInit() {
  }

}
