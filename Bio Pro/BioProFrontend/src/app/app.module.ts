import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from './shared/material.module';
import { MatSidenav } from '@angular/material/sidenav';
import { AddOrderComponent } from './add-order/add-order.component';
import { OrdersComponent } from './orders/orders.component';
import { ApproveOrderComponent } from './approve-order/approve-order.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddDentistComponent } from './add-dentist/add-dentist.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { CaptureEmployeeHoursComponent } from './capture-employee-hours/capture-employee-hours.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { LoginComponent } from './login/login.component';
import { EditOrderModalComponent } from './edit-order-modal/edit-order-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    OpenOrdersComponent,
    AddOrderComponent,
    OrdersComponent,
    ApproveOrderComponent,
    AddEmployeeComponent,
    AddDentistComponent,
    DentistProfileComponent,
    EmployeeProfileComponent,
    CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
