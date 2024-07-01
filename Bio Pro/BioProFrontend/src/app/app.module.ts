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
import { AddUserComponent } from './add-user/add-user.component';
import {  AddProceduralTimeline } from './add-order-proceduraltimeline/add-order-proceduraltimeline.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import { HomeComponent } from './home/home.component';
import { TestingBackendComponent } from './testing-backend/testing-backend.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { OrdersAwaitingDentalDesignComponent } from './orders-awaiting-dental-design/orders-awaiting-dental-design.component';
import { DentalDesignApprovalComponent } from './dental-design-approval/dental-design-approval.component';
import { EmployeeOrdersAndStepsComponent } from './employee-orders-and-steps/employee-orders-and-steps.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventModalComponent } from './event-modal/event-modal.component';
import { ProcededuralTimelineViewComponent } from './procededural-timeline-view/procededural-timeline-view.component';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { StockUsedComponent } from './stock-used/stock-used.component';

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
    CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, 
    ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, EmployeeOrdersAndStepsComponent,CalendarComponent, SearchBarComponent, EventModalComponent, ProcededuralTimelineViewComponent, AddEventModalComponent, StockUsedComponent
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
    MatGridListModule,
    CommonModule,   
    MatDatepickerModule,
    MatNativeDateModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),MatExpansionModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  exports: [CalendarComponent]
})

export class AppModule { }
