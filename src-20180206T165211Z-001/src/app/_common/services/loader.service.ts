import { Injectable, EventEmitter } from '@angular/core';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'

@Injectable()
export class LoaderService {
    loadingVal: boolean = false;
    public loadingFlagUpdated: EventEmitter<any> = new EventEmitter();
    public get loading(): any { return this.loadingVal };
    public set loading(value: any) { this.loadingVal = value; this.loadingFlagUpdated.emit(value); }
}