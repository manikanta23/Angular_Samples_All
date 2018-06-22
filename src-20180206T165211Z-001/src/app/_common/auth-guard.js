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
var router_1 = require("@angular/router");
var common_data_service_1 = require("./services/common-data.service");
var application_insights_service_1 = require("./services/application-insights.service");
var AuthGuard = (function () {
    function AuthGuard(router, commonDataService, applicationInsightsService) {
        this.router = router;
        this.commonDataService = commonDataService;
        this.applicationInsightsService = applicationInsightsService;
        this.AuthenticationCheckUpdated = new core_1.EventEmitter();
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        this.applicationInsightsService.trackPageView();
        var currentDateTime = new Date().getTime();
        var authToken = this.commonDataService.AuthToken;
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
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router,
        common_data_service_1.CommonDataService,
        application_insights_service_1.ApplicationInsightsService])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.js.map