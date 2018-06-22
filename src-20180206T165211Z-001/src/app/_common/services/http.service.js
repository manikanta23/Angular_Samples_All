"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var common_data_service_1 = require("./common-data.service");
var router_1 = require("@angular/router");
var error_information_entity_1 = require("./../../_entities/error-information.entity");
var application_insights_service_1 = require("./application-insights.service");
var HttpService = (function (_super) {
    __extends(HttpService, _super);
    function HttpService(backend, options, commonDataService, injector) {
        var _this = _super.call(this, backend, options) || this;
        _this.commonDataService = commonDataService;
        _this.injector = injector;
        var token = commonDataService.AuthToken;
        options.headers.set("Authorization", "Bearer " + token);
        return _this;
    }
    Object.defineProperty(HttpService.prototype, "router", {
        //this creates router property on your service.
        get: function () {
            return this.injector.get(router_1.Router);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpService.prototype, "applicationInsightsService", {
        //this creates router property on your service.
        get: function () {
            return this.injector.get(application_insights_service_1.ApplicationInsightsService);
        },
        enumerable: true,
        configurable: true
    });
    HttpService.prototype.request = function (url, options) {
        var token;
        if (this.commonDataService.AuthToken != null && this.commonDataService.AuthToken.access_token) {
            token = this.commonDataService.AuthToken.access_token;
        }
        if (typeof url === "string") {
            if (!options) {
                options = { headers: new http_1.Headers() };
            }
            if (url.indexOf("Token") === -1) {
                options.headers.set("Authorization", "Bearer " + token);
                options.headers.set("Access-Control-Allow-Methods", ["POST", "PUT", "GET", "DELETE"]);
                options.headers.set("Access-Control-Allow-Headers", ["accept", "authorization", "content-type"]);
                options.headers.set("Access-Control-Allow-Origin", "*");
            }
            url = this.commonDataService.API_URL + url;
        }
        else {
            if (url.url.indexOf("Token") === -1) {
                url.headers.set("Authorization", "Bearer " + token);
                url.headers.set("Access-Control-Allow-Methods", ["POST", "PUT", "GET", "DELETE"]);
                url.headers.set("Access-Control-Allow-Headers", ["accept", "authorization", "content-type"]);
                url.headers.set("Access-Control-Allow-Origin", "*");
            }
            url.url = this.commonDataService.API_URL + url.url;
        }
        return _super.prototype.request.call(this, url, options).catch(this.catchAuthError(this, url));
    };
    HttpService.prototype.checkToken = function () {
        console.log("http service return url : " + window.location.href);
        var returnUrl = window.location.href;
        var token;
        if (this.commonDataService.AuthToken != null && this.commonDataService.AuthToken.access_token) {
            var tokenObject = this.commonDataService.AuthToken;
            var currentDateTime = new Date().getTime();
            var expiryDateTime = this.commonDataService.AuthToken.expiry_datetime;
            console.log("Token : currentDateTime : " + new Date(currentDateTime) + "\t expiryDateTime  : " + new Date(expiryDateTime));
            if (!tokenObject || !tokenObject.expires_in || expiryDateTime < currentDateTime) {
                this.router.navigateByUrl("/login");
                return null;
            }
            else {
                return tokenObject.access_token;
            }
        }
        else {
            this.router.navigateByUrl("/login?returnUrl=" + returnUrl);
        }
    };
    HttpService.prototype.catchAuthError = function (self, url) {
        var _this = this;
        return function (res) {
            // following condition is to handle the error response containing the blob object with error message.
            if (res.status == 500 && (res.url.indexOf("DownloadGmInvoicePdfFile") > 0 || res.url.indexOf("GetPickTicket") > 0 || res.url.indexOf("GetPrintTicket") > 0 || res.url.indexOf("UpdateOrderValues") > 0 || res.url.indexOf("DownloadPurchaseOrder") > 0)) {
                return Observable_1.Observable.of(res);
            }
            else {
                var body = null;
                var requestUrl = "";
                var requestParameter = "";
                var errorObj = null;
                if (res.json()) {
                    body = res.json();
                }
                var errInfo = Object.assign(new error_information_entity_1.ErrorInformation(), {
                    Message: body != null && body.message != undefined && body.message != null ? body.message : "",
                    ErrorType: res.status
                });
                if (typeof url === "string") {
                    requestUrl = url;
                }
                else {
                    requestUrl = url.url;
                    requestParameter = url._body;
                }
                errorObj = new Error(JSON.stringify({ Message: errInfo.Message, Type: errInfo.ErrorType, url: requestUrl, Paramters: requestParameter }));
                _this.applicationInsightsService.trackException(errorObj, "Http service");
                console.log("URL : " + res.url + "Response Type : " + res.status);
                if (res.status === 401) {
                    return _this.unauthorised(errInfo);
                }
                else if (res.status === 403) {
                    return _this.forbidden(errInfo);
                }
                else {
                    return Observable_1.Observable.of(errInfo);
                }
            }
        };
    };
    HttpService.prototype.unauthorised = function (errInfo) {
        console.log("http service return URL : " + this.router.url);
        this.router.navigateByUrl("/login?returnUrl=" + encodeURIComponent(this.router.url));
        return Observable_1.Observable.of(errInfo);
    };
    HttpService.prototype.forbidden = function (errInfo) {
        this.router.navigate(['/']);
        return Observable_1.Observable.of(errInfo);
    };
    HttpService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    HttpService.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return HttpService;
}(http_1.Http));
HttpService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.XHRBackend, http_1.RequestOptions, common_data_service_1.CommonDataService, core_1.Injector])
], HttpService);
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map