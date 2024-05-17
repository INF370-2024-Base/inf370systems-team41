import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { AddOrderComponent } from './add-order/add-order.component';
import{OrdersComponent }from './orders/orders.component';
import { ApproveOrderComponent } from './approve-order/approve-order.component';


const routes: Routes = [
  
  {path: 'openOrder', component: OpenOrdersComponent},  
  {path: '', redirectTo: 'openOrder', pathMatch: 'full'},
  {path: 'addOrder', component: AddOrderComponent},
  { path: 'orders', component: OrdersComponent },
  { path: 'approval', component: ApproveOrderComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
