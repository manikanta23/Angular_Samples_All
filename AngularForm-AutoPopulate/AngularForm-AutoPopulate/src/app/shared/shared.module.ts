import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import {
  FormGroup, FormArray, FormBuilder,
  Validators, ReactiveFormsModule
} from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'test', component: TestComponent }

];


@NgModule({
  imports: [
    CommonModule
    , NgbModule.forRoot()
   
  ],

  declarations: [TestComponent],
  exports: [TestComponent]

})
export class SharedModule { }
