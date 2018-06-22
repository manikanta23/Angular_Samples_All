import { Injectable, EventEmitter } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { CommonDataService } from "./services/common-data.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApplicationInsightsService } from "./services/application-insights.service";

@Injectable()
export class AuthGuard implements CanActivate {

    public AuthenticationCheckUpdated: EventEmitter<any> = new EventEmitter();

    constructor(private router: Router,
        private commonDataService: CommonDataService,
        private applicationInsightsService: ApplicationInsightsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.applicationInsightsService.trackPageView();
        let currentDateTime = new Date().getTime();
        let authToken: any = this.commonDataService.AuthToken;
        console.log("AuthGuard : currentDateTime : " + new Date(currentDateTime) + "\t expiryDateTime : " + (authToken != undefined && authToken != null && authToken.expiry_datetime != null ? new Date(authToken.expiry_datetime) : "Auth token not present"));
        console.log("AuthGuard (UTC): currentDateTime : " + new Date(currentDateTime).toUTCString() + "\t expiryDateTime : " + (authToken != undefined && authToken != null && authToken.expiry_datetime != null ? new Date(authToken.expiry_datetime).toUTCString() : "Auth token not present"));
        if (authToken != undefined && authToken != null && authToken.expiry_datetime > currentDateTime) {
            // logged in and token not expired, so return true
            this.AuthenticationCheckUpdated.emit(true);
            return true;
        }

        // not logged in or token expired, so redirect to login page
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.AuthenticationCheckUpdated.emit(false);
        return false;
    }
}