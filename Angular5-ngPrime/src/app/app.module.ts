import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import { AppComponent } from './app.component';
import { PopupComponent } from './popup/popup.component';

import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';



@NgModule({
    declarations: [
        AppComponent,
        PopupComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        InputTextModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        CheckboxModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
