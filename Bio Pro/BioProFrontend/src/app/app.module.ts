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
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AddDentistComponent } from './add-dentist/add-dentist.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    OpenOrdersComponent,
    AddEmployeeComponent,
    AddDentistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,MaterialModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
