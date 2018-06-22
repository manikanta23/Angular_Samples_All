import { Component, OnInit, ElementRef, AfterViewInit } from "@angular/core";
import { AuthenticationService } from "./../_common/services/authentication.service";
import { CommonDataService } from "./../_common/services/common-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { Token } from "./../_entities/token.entity";
import { ErrorInformation } from "./../_entities/error-information.entity";
import { LoaderService } from "./../_common/services/loader.service";
import { CookieService } from 'ng2-cookies';

@Component({
    templateUrl: `./src/app/login/login.component.html?v=${new Date().getTime()}`,
    providers: [AuthenticationService, CookieService]
})

export class LoginComponent implements OnInit, AfterViewInit {

    token: string;
    errorMessage: any;
    notificationType = NotificationType;
    returnUrl: string = "";

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthenticationService,
        private router: Router,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private loaderService: LoaderService,
        private elementRef: ElementRef,
        private cookieService: CookieService
    ) { }

    ngOnInit() {        
        this.activatedRoute
            .queryParams
            .subscribe(params => {
                this.returnUrl = "";
                this.returnUrl = params['returnUrl'];
                console.log("Login return Url : " + this.returnUrl);
            });
        this.loaderService.loading = false;
        this.cookieService.set('ai_user', '', new Date(-8640000000000000));
        this.cookieService.set('ai_session', '', new Date(-8640000000000000));
        this.cookieService.delete('ai_user');
        this.cookieService.delete('ai_session');
    }

    ngAfterViewInit() {
        if (this.commonDataService.ProviderKey == undefined || this.commonDataService.ProviderKey == null || this.commonDataService.ProviderKey == "") {
            let native = this.elementRef.nativeElement.parentElement;
            if (native != undefined && native != null) {
                let userId: any = native.getAttribute("userId");
                let userName: any = native.getAttribute("userName");
                let providerKey: any = native.getAttribute("providerKey");

                this.commonDataService.UserId = userId;
                this.commonDataService.UserName = userName;
                this.commonDataService.ProviderKey = providerKey;
            }
        }

        this.getToken();
    }

    getToken(): void {
        let token = <Token>this.commonDataService.AuthToken;

        let currentDateTime = new Date().getTime();
        if (!token || !token.expires_in || token.expires_in < currentDateTime) {
            this.authService.getToken()
                .then(token => {
                    if (token.ErrorType != undefined && token.ErrorType != null && token.ErrorType != 200) {
                        this.notification.errorMessage("LoginComponent", "getToken", "getToken", token);
                    }
                    else {
                        let expiryDateTime: number = new Date(new Date().getTime() + (token.expires_in * 1000)).getTime();
                        token.expiry_datetime = expiryDateTime;
                        this.commonDataService.AuthToken = token;

                        if (this.returnUrl && this.returnUrl.indexOf('/login') < 0) {
                            this.router.navigateByUrl(this.returnUrl);
                        }
                        else {
                            this.router.navigate(['']);
                        }
                    }
                    console.log("Login token : ", token);
                    console.log("login return url : " + this.returnUrl);
                },
                error => { });
        }
    }
}