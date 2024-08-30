import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div *ngIf="notSignedIn; else defaultUnauthorized">
      <h1>Unauthorized Access</h1>
      <p>You are not signed in. Please log in to access this page.</p>
    </div>
    <ng-template #defaultUnauthorized>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
    </ng-template>
  `
})
export class UnauthorizedComponent implements OnInit {
  notSignedIn: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.notSignedIn = params['reason'] === 'notSignedIn';
    });
  }
}
