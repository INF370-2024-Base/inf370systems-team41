import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { AddOrderComponent } from './add-order/add-order.component';
import{OrdersComponent }from './orders/orders.component';
import { ApproveOrderComponent } from './approve-order/approve-order.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddDentistComponent } from './add-dentist/add-dentist.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component'; // Import DentistProfileComponent
import { CaptureEmployeeHoursComponent } from './capture-employee-hours/capture-employee-hours.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { LoginComponent } from './login/login.component'; 
import { AddUserComponent } from './add-user/add-user.component';
import { AddProceduralTimeline } from './add-order-proceduraltimeline/add-order-proceduraltimeline.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { AddDeliveryComponent } from './add-delivery/add-delivery.component';
import { HomeComponent } from './home/home.component';
import { TestingBackendComponent } from './testing-backend/testing-backend.component';
import { OrdersAwaitingDentalDesignComponent } from './orders-awaiting-dental-design/orders-awaiting-dental-design.component';
import { DentalDesignApprovalComponent } from './dental-design-approval/dental-design-approval.component';
import { EmployeeOrdersAndStepsComponent } from './employee-orders-and-steps/employee-orders-and-steps.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HelpComponent } from './help/help.component';
import { HelpStockComponent } from './help-stock/help-stock.component';
import { HelpEmployeesComponent } from './help-employees/help-employees.component';
import { HelpDentistComponent } from './help-dentist/help-dentist.component';
import { DailyHoursProfileComponent } from './daily-hours-profile/daily-hours-profile.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { StockComponent } from './stock/stock.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditAnyUserComponent } from './edit-any-user/edit-any-user.component';
import { AllUsersComponent } from './all-users/all-users.component';

import { ReportsComponent } from './reports/reports.component';
import { ReportsServices } from './services/reports';
import { StockItemCountByCategory } from './shared/StockItemCountByCategory';
import { StockTypeCountByCategory } from './shared/StockTypeCountByCategory';
import { EmployeeHoursReport } from './shared/EmployeeHoursReport';
import { FormsModule } from '@angular/forms';
import { HelpOrdersComponent } from './help-orders/help-orders.component';
import { HelpTimelineOfOrdersComponent } from './help-timeline-of-orders/help-timeline-of-orders.component';
import { HelpDeliveriesComponent } from './help-deliveries/help-deliveries.component';
import { StockCategoryComponent } from './stock-category/stock-category.component';
import { StockTypeComponent } from './stock-type/stock-type.component';
import { ResetUserPasswordComponent } from './reset-user-password/reset-user-password.component';
import { UpdateModeEnum } from 'chart.js';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { HelpUserComponent } from './help-user/help-user.component';
import { SettingsComponent } from './settings/settings.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { RoleGuardService } from './services/roleCheck';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ModellingComponent } from './modelling/modelling.component';
import { StockUsageModalComponent } from './stock-usage-modal/stock-usage-modal.component';
import { HelpProfileComponent } from './help-profile/help-profile.component';
import { HelpCalendarComponent } from './help-calendar/help-calendar.component';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'help-user', component: HelpUserComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'addOrder', component: AddOrderComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'orders', component: OrdersComponent},
  { path: 'orderAwaitingDentalDesign', component: OrdersAwaitingDentalDesignComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Design Technician',"Lab Manager"] } },
  { path: 'dentalDesignApproval', component: DentalDesignApprovalComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Lab Manager',"Owner"] } },
  { path: 'approval', component: ApproveOrderComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Lab Manager',"Owner"] } },
  { path: 'addEmployee', component: AddEmployeeComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Lab Manager',"Owner"] } },
  { path: 'addDentist', component: AddDentistComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'dentistProfile', component: DentistProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'captureEmployeeDailyHours', component: CaptureEmployeeHoursComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin'] } },
  { path: 'employeeProfile', component: EmployeeProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Lab Manager',"Owner","Admin"] } },
  { path: 'Dentist', component: DentistProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'employee', component: EmployeeProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'login', component: LoginComponent },
  { path: 'UpdatePassword', component: UpdatePasswordComponent },
  { path: 'adduser', component: AddUserComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Lab Manager',"Owner"] } },
  { path: 'addproceduraltimeline', component: AddProceduralTimeline, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'deliveries', component: DeliveriesComponent},
  { path: 'addDelivery', component: AddDeliveryComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'test', component: TestingBackendComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin',"Lab Manager"] } },
  { path: 'employeeOrders', component: EmployeeOrdersAndStepsComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Employee', 'Lab Manager','Design Technician'] } },
  { path: 'calendar', component: CalendarComponent},
  { path: 'help', component: HelpComponent },
  { path: 'dailyHoursProfile', component: DailyHoursProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'addStock', component: AddStockComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'pageStock', component: StockComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'help-stock', component: HelpStockComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'help-employee', component: HelpEmployeesComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'help-dentist', component: HelpDentistComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'all-user', component: AllUsersComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },

  { path: 'reports', component: ReportsComponent},
  { path: 'help-orders', component: HelpOrdersComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'help-orderTimeline', component: HelpTimelineOfOrdersComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'help-deliveries', component: HelpDeliveriesComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'stock-categories', component: StockCategoryComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"]} },
  { path: 'stock-type', component: StockTypeComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager',"Owner"] } },
  { path: 'rp/:email', component: ResetUserPasswordComponent},
  { path: 'audit-trail', component: AuditTrailComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager','Owner'] } },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'model', component: ModellingComponent },
  {path: 'stock-usage-modal', component:StockUsageModalComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager','Owner'] }},
  {path: 'help-profile', component:HelpProfileComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager','Owner'] }},
  {path: 'help-calendar', component:HelpCalendarComponent, canActivate: [RoleGuardService], data: { expectedRoles: ['Admin', 'Lab Manager','Owner'] }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
