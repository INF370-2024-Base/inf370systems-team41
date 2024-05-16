import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddDentistComponent } from './add-dentist/add-dentist.component';
import { DentistProfileComponent } from './dentist-profile/dentist-profile.component'; // Import DentistProfileComponent
import { CaptureEmployeeHoursComponent } from './capture-employee-hours/capture-employee-hours.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';


const routes: Routes = [
  { path: 'openOrder', component: OpenOrdersComponent },
  { path: '', redirectTo: 'openOrder', pathMatch: 'full' },
  { path: 'addEmployee', component: AddEmployeeComponent },
  { path: 'addDentist', component: AddDentistComponent },
  { path: 'dentistProfile', component: DentistProfileComponent }, // Add route for DentistProfileComponent
  { path: 'captureEmployeeDailyHours', component:  CaptureEmployeeHoursComponent},
  { path: 'employeeProfile', component:  EmployeeProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
