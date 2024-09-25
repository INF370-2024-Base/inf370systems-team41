import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { CommonModule } from '@angular/common';
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
import { HelpComponent } from './help/help.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditEmployeeDialogComponent } from './edit-employee-dialog/edit-employee-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DailyHoursProfileComponent } from './daily-hours-profile/daily-hours-profile.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { StockComponent } from './stock/stock.component';
import { WriteOffModalComponent } from './write-off-modal/write-off-modal.component';
import { CaptureNewStockModalComponent } from './capture-new-stock-modal/capture-new-stock-modal.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ReportsComponent } from './reports/reports.component';
import { EmployeeHoursReport } from './shared/EmployeeHoursReport';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { HelpOrdersComponent } from './help-orders/help-orders.component';
import { HelpTimelineOfOrdersComponent } from './help-timeline-of-orders/help-timeline-of-orders.component';
import { HelpDeliveriesComponent } from './help-deliveries/help-deliveries.component';
import { HelpStockComponent } from './help-stock/help-stock.component';
import { HelpEmployeesComponent } from './help-employees/help-employees.component';
import { HelpDentistComponent } from './help-dentist/help-dentist.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { EditAnyUserComponent } from './edit-any-user/edit-any-user.component';
import { DentistEditDialogComponent } from './dentist-edit-dialog/dentist-edit-dialog.component';
import { HelpDentistSearchComponent } from './help-dentist-search/help-dentist-search.component';
import { HelpDentistAddComponent } from './help-dentist-add/help-dentist-add.component';
import { HelpDentistEditComponent } from './help-dentist-edit/help-dentist-edit.component';
import { HelpDentistDeleteComponent } from './help-dentist-delete/help-dentist-delete.component';
import { HelpEmployeeAddComponent } from './help-employee-add/help-employee-add.component';
import { HelpEmployeeEditComponent } from './help-employee-edit/help-employee-edit.component';
import { HelpEmployeeDeleteComponent } from './help-employee-delete/help-employee-delete.component';
import { HelpEmployeeSearchComponent } from './help-employee-search/help-employee-search.component';
import { HelpEmployeeHourComponent } from './help-employee-hour/help-employee-hour.component';
import { HelpEmploueeHourDeleteComponent } from './help-emplouee-hour-delete/help-emplouee-hour-delete.component';
import { HelpStockAddComponent } from './help-stock-add/help-stock-add.component';
import { HelpStockCaptureComponent } from './help-stock-capture/help-stock-capture.component';
import { HelpStockWriteoffComponent } from './help-stock-writeoff/help-stock-writeoff.component';
import { HelpStockSearchComponent } from './help-stock-search/help-stock-search.component';
import { StockCategoryComponent } from './stock-category/stock-category.component';
import { EditStockCategoryComponent } from './edit-stock-category/edit-stock-category.component';
import { StockTypeComponent } from './stock-type/stock-type.component';
import { EditStockTypeComponent } from './edit-stock-type/edit-stock-type.component';
import { AddStockTypeComponent } from './add-stock-type/add-stock-type.component';
import { AddStockCategoryComponent } from './add-stock-category/add-stock-category.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetUserPasswordComponent } from './reset-user-password/reset-user-password.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDeleteEmployeeComponent } from './confirm-delete-employee/confirm-delete-employee.component';
import { ConfirmDeleteDentistComponent } from './confirm-delete-dentist/confirm-delete-dentist.component';
import { HelpUserComponent } from './help-user/help-user.component';
import { ConfirmDeleteUserComponent } from './confirm-delete-user/confirm-delete-user.component';
import { ConfirmDeleteDailyHourComponent } from './confirm-delete-daily-hour/confirm-delete-daily-hour.component';
import { SettingsComponent } from './settings/settings.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ErrorInterceptor } from './services/httpInterceptor';
import { LoadingService } from './services/loading.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RejectOrderModalComponent } from './reject-order-modal/reject-order-modal.component';
import { ModellingComponent } from './modelling/modelling.component';
import { StockUsageModalComponent } from './stock-usage-modal/stock-usage-modal.component';
import { HelpProfileComponent } from './help-profile/help-profile.component';
import { HelpCalendarComponent } from './help-calendar/help-calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    OpenOrdersComponent,
    AddOrderComponent,
    OrdersComponent,
    LoginComponent,
    ApproveOrderComponent,
    AddEmployeeComponent,
    AddDentistComponent,
    DentistProfileComponent,
    EmployeeProfileComponent,
    CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, 
    ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, EmployeeOrdersAndStepsComponent,CalendarComponent, SearchBarComponent, EventModalComponent, ProcededuralTimelineViewComponent, AddEventModalComponent, StockUsedComponent, HelpComponent,
    CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent,
    UserProfileComponent, 
    EditEmployeeDialogComponent, DailyHoursProfileComponent, AddStockComponent, StockComponent, WriteOffModalComponent, CaptureNewStockModalComponent, EditUserComponent,
    ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, EmployeeOrdersAndStepsComponent,CalendarComponent, SearchBarComponent, EventModalComponent, ProcededuralTimelineViewComponent, AddEventModalComponent, StockUsedComponent, HelpComponent,HelpStockComponent, HelpEmployeesComponent, HelpDentistComponent, AllUsersComponent, EditAnyUserComponent
    , OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, EmployeeOrdersAndStepsComponent,CalendarComponent, SearchBarComponent, EventModalComponent, ProcededuralTimelineViewComponent, AddEventModalComponent, StockUsedComponent, HelpComponent,HelpStockComponent, HelpEmployeesComponent, HelpDentistComponent, DentistEditDialogComponent, HelpDentistSearchComponent, HelpDentistAddComponent, HelpDentistEditComponent, HelpDentistDeleteComponent, HelpEmployeeAddComponent, HelpEmployeeEditComponent, HelpEmployeeDeleteComponent, HelpEmployeeSearchComponent, HelpEmployeeHourComponent, HelpEmploueeHourDeleteComponent, HelpStockAddComponent, HelpStockCaptureComponent, HelpStockWriteoffComponent, HelpStockSearchComponent,
    ReportsComponent,
    StockUsageModalComponent,
    CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, HelpComponent, HelpOrdersComponent, HelpTimelineOfOrdersComponent, HelpDeliveriesComponent, StockCategoryComponent, EditStockCategoryComponent, StockTypeComponent, EditStockTypeComponent, AddStockTypeComponent, AddStockCategoryComponent, UpdatePasswordComponent, ResetPasswordComponent, ResetUserPasswordComponent
    ,CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, HelpComponent, HelpOrdersComponent, HelpTimelineOfOrdersComponent, HelpDeliveriesComponent, ConfirmDeleteEmployeeComponent, ConfirmDeleteDentistComponent, HelpUserComponent, ConfirmDeleteUserComponent, ConfirmDeleteDailyHourComponent, SettingsComponent, AuditTrailComponent, UnauthorizedComponent, RejectOrderModalComponent, ModellingComponent
    ,CaptureEmployeeHoursComponent,LoginComponent,EditOrderModalComponent, AddUserComponent, AddProceduralTimeline, DeliveriesComponent, AddDeliveryComponent, HomeComponent, TestingBackendComponent, ConfirmationDialogComponent, OrdersAwaitingDentalDesignComponent, DentalDesignApprovalComponent, HelpComponent, HelpOrdersComponent, HelpTimelineOfOrdersComponent, HelpDeliveriesComponent, ConfirmDeleteEmployeeComponent, ConfirmDeleteDentistComponent, HelpUserComponent, ConfirmDeleteUserComponent, ConfirmDeleteDailyHourComponent, SettingsComponent, AuditTrailComponent, UnauthorizedComponent, StockUsageModalComponent, HelpProfileComponent, HelpCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
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
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),MatExpansionModule,
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatSelectModule,    MatPaginatorModule
  ],
  providers: [DatePipe,{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },LoadingService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  exports: [CalendarComponent],
  entryComponents: [RejectOrderModalComponent]
})

export class AppModule { }
