import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <ng-container *ngIf="notSignedIn;">
    <mat-card class="unauthorized-container">
    <mat-icon class="error-icon">lock</mat-icon>
  <h1>Unauthorized Access</h1>
  <p>You are not signed in. Please log in to access this page.</p>
  <button mat-raised-button class="login-button" color="primary" (click)="login()">Login</button>
</mat-card>
    </ng-container>

    <ng-template #defaultUnauthorized>
      <mat-card class="error-card">
        <mat-card-content>
          <mat-icon class="error-icon">lock</mat-icon>
          <h1>Unauthorized Access</h1>
          <p>You do not have permission to view this page.</p>
        </mat-card-content>
      </mat-card>
    </ng-template>
  `,styles: [`
    .error-card {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      color:red;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .unauthorized-container {
  display: flex;
  color:red;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.mat-raised-button[color="primary"] {
  background-color: #0056b3;
  color: white;
}
.login-button {
  color: darkblue;
  margin-top: 20px;
}
    .error-icon {
      font-size: 48px;
      color: red;
      margin-bottom: 20px;
    }

    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `]
})
export class UnauthorizedComponent implements OnInit {
  notSignedIn: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.notSignedIn = params['reason'] === 'notSignedIn';
      console.log(this.notSignedIn)
    });
  }
  login()
  {
    this.router.navigate(['login'])
  }
}
