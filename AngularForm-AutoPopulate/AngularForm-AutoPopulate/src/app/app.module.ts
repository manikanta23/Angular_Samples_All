import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  FormGroup, FormArray, FormBuilder,
  Validators, ReactiveFormsModule
} from '@angular/forms';


import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { TestComponent } from './shared/test.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent }

];

@NgModule({
  declarations: [
    AppComponent, HomeComponent    
  ],
  imports: [
    BrowserModule,   ReactiveFormsModule,   FormsModule, HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true }), SharedModule, NgbModule.forRoot() 
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
