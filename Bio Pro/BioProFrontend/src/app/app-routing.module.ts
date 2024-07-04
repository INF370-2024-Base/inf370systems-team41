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
  {path:'help-stock', component:HelpStockComponent},
  {path:'help-employee', component:HelpEmployeesComponent },
  {path:'help-dentist', component:HelpDentistComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
