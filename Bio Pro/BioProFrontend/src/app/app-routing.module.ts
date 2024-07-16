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
import { ReportsComponent } from './reports/reports.component';
import { ReportsServices } from './services/reports';
import { StockItemCountByCategory } from './shared/StockItemCountByCategory';
import { StockTypeCountByCategory } from './shared/StockTypeCountByCategory';
import { EmployeeHoursReport } from './shared/EmployeeHoursReport';
import { FormsModule } from '@angular/forms';
import { HelpOrdersComponent } from './help-orders/help-orders.component';
import { HelpTimelineOfOrdersComponent } from './help-timeline-of-orders/help-timeline-of-orders.component';
import { HelpDeliveriesComponent } from './help-deliveries/help-deliveries.component';



const routes: Routes = [
  
  {path: 'openOrder', component: OpenOrdersComponent},  
  {path: 'addOrder', component: AddOrderComponent},
  { path: 'orders', component: OrdersComponent },
  { path: 'orderAwaitingDentalDesign', component: OrdersAwaitingDentalDesignComponent },
  { path: 'dentalDesignApproval', component: DentalDesignApprovalComponent },
  { path: 'approval', component: ApproveOrderComponent },
  { path: 'addEmployee', component: AddEmployeeComponent },
  { path: 'addDentist', component: AddDentistComponent },
  { path: 'dentistProfile', component: DentistProfileComponent }, // Add route for DentistProfileComponent
  { path: 'captureEmployeeDailyHours', component:  CaptureEmployeeHoursComponent},
  { path: 'employeeProfile', component:  EmployeeProfileComponent},
  { path: 'Dentist', component:  DentistProfileComponent},
  { path: 'employee', component:  EmployeeProfileComponent},
  {path: 'login', component: LoginComponent}, 
  {path: 'adduser', component: AddUserComponent}, 
  {path: 'addproceduraltimeline', component: AddProceduralTimeline}, 
  {path: 'deliveries', component: DeliveriesComponent}, 
  {path: 'addDelivery', component: AddDeliveryComponent}, 
  {path: '', redirectTo: 'calendar', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'test', component: TestingBackendComponent},
  {path: 'employeeOrders', component: EmployeeOrdersAndStepsComponent},
  {path: 'calendar', component: CalendarComponent},
  {path:'help', component:HelpComponent},
  {path: 'dailyHoursProfile', component: DailyHoursProfileComponent},
  {path: 'addStock', component: AddStockComponent},
  {path: 'pageStock', component: StockComponent},
  { path: 'edit-user', component: EditUserComponent },
  {path:'help-stock', component:HelpStockComponent},
  {path:'help-employee', component:HelpEmployeesComponent },
  {path:'help-dentist', component:HelpDentistComponent},
  {path:'all-user', component:AllUsersComponent},
  {path:'help-dentist-search', component:HelpDentistSearchComponent},
  {path:'help-dentist-add', component:HelpDentistAddComponent},
  {path:'help-dentist-edit', component:HelpDentistEditComponent},
  {path:'help-dentist-delete', component:HelpDentistDeleteComponent},
  {path:'help-employee-search', component:HelpEmployeeSearchComponent},
  {path:'help-employee-add', component:HelpEmployeeAddComponent},
  {path:'help-employee-edit', component:HelpEmployeeEditComponent},
  {path:'help-employee-delete', component:HelpEmployeeDeleteComponent},
  {path:'help-stock-search', component:HelpStockSearchComponent},
  {path:'help-stock-add', component:HelpStockAddComponent},
  {path:'help-stock-capture', component:HelpStockCaptureComponent},
  {path:'help-stock-writeoff', component:HelpStockWriteoffComponent},
  {path:'help-employee-hour', component:HelpEmployeeHourComponent},
  {path:'help-employee-hour-delete', component: HelpEmploueeHourDeleteComponent},
  {path : 'reports', component:ReportsComponent},
  {path: 'help', component: HelpComponent},
  {path:'help-orders', component:HelpOrdersComponent },
  {path: 'help-orderTimeline', component:HelpTimelineOfOrdersComponent},
  {path: 'help-deliveries', component:HelpDeliveriesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
