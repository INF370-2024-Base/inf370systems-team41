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
import { EditOrderModalComponent } from './edit-order-modal/edit-order-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    OpenOrdersComponent,
    AddOrderComponent,
    OrdersComponent,
    EditOrderModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
