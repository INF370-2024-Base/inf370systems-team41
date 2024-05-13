import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddDentistComponent } from './add-dentist/add-dentist.component';

const routes: Routes = [
  
  {path: 'openOrder', component: OpenOrdersComponent},  
  {path: '', redirectTo: 'openOrder', pathMatch: 'full'},
  { path: 'addEmployee', component: AddEmployeeComponent }, 
  { path: 'addDentist', component:  AddDentistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
