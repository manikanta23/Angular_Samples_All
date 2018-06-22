"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var authentication_service_1 = require("./../_common/services/authentication.service");
var common_data_service_1 = require("./../_common/services/common-data.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("./../_common/services/notification.service");
var loader_service_1 = require("./../_common/services/loader.service");
var ng2_cookies_1 = require("ng2-cookies");
var LoginComponent = (function () {
    function LoginComponent(activatedRoute, authService, router, notification, commonDataService, loaderService, elementRef, cookieService) {
        this.activatedRoute = activatedRoute;
        this.authService = authService;
        this.router = router;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.loaderService = loaderService;
        this.elementRef = elementRef;
        this.cookieService = cookieService;
        this.notificationType = notification_service_1.NotificationType;
        this.returnUrl = "";
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute
            .queryParams
            .subscribe(function (params) {
            _this.returnUrl = "";
            _this.returnUrl = params['returnUrl'];
            console.log("Login return Url : " + _this.returnUrl);
        });
        this.loaderService.loading = false;
        this.cookieService.set('ai_user', '', new Date(-8640000000000000));
        this.cookieService.set('ai_session', '', new Date(-8640000000000000));
        this.cookieService.delete('ai_user');
        this.cookieService.delete('ai_session');
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        if (this.commonDataService.ProviderKey == undefined || this.commonDataService.ProviderKey == null || this.commonDataService.ProviderKey == "") {
            var native = this.elementRef.nativeElement.parentElement;
            if (native != undefined && native != null) {
                var userId = native.getAttribute("userId");
                var userName = native.getAttribute("userName");
                var providerKey = native.getAttribute("providerKey");
                this.commonDataService.UserId = userId;
                this.commonDataService.UserName = userName;
                this.commonDataService.ProviderKey = providerKey;
            }
        }
        this.getToken();
    };
    LoginComponent.prototype.getToken = function () {
        var _this = this;
        var token = this.commonDataService.AuthToken;
        var currentDateTime = new Date().getTime();
        if (!token || !token.expires_in || token.expires_in < currentDateTime) {
            this.authService.getToken()
                .then(function (token) {
                if (token.ErrorType != undefined && token.ErrorType != null && token.ErrorType != 200) {
                    _this.notification.errorMessage("LoginComponent", "getToken", "getToken", token);
                }
                else {
                    var expiryDateTime = new Date(new Date().getTime() + (token.expires_in * 1000)).getTime();
                    token.expiry_datetime = expiryDateTime;
                    _this.commonDataService.AuthToken = token;
                    if (_this.returnUrl && _this.returnUrl.indexOf('/login') < 0) {
                        _this.router.navigateByUrl(_this.returnUrl);
                    }
                    else {
                        _this.router.navigate(['']);
                    }
                }
                console.log("Login token : ", token);
                console.log("login return url : " + _this.returnUrl);
            }, function (error) { });
        }
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/login/login.component.html?v=" + new Date().getTime(),
        providers: [authentication_service_1.AuthenticationService, ng2_cookies_1.CookieService]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        authentication_service_1.AuthenticationService,
        router_1.Router,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        loader_service_1.LoaderService,
        core_1.ElementRef,
        ng2_cookies_1.CookieService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map