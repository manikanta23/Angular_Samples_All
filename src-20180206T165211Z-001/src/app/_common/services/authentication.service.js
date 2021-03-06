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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var common_data_service_1 = require("./common-data.service");
var AuthenticationService = (function () {
    function AuthenticationService(http, commonDataService) {
        this.http = http;
        this.commonDataService = commonDataService;
    }
    AuthenticationService.prototype.getToken = function () {
        var API_TOKEN_URI = 'Token';
        var API_CONTENT_TYPE = 'application/json';
        var API_PROVIDER = 'Windows';
        var API_PROVIDERKEY = this.commonDataService.ProviderKey;
        var headers = new http_1.Headers({
            'Content-Type': API_CONTENT_TYPE
        });
        var options = new http_1.RequestOptions({
            headers: headers
        });
        var body = 'grant_type=external&provider=' + API_PROVIDER + '&providerkey=' + API_PROVIDERKEY;
        return this.http.post(API_TOKEN_URI, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    AuthenticationService.prototype.extractData = function (res) {
        if (res.ErrorType != undefined && res.ErrorType != 200) {
            return res;
        }
        if (res != undefined && res != null) {
            return res.json() || {};
        }
        else {
            return {};
        }
    };
    AuthenticationService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || "";
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || "") + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Promise.reject(errMsg);
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, common_data_service_1.CommonDataService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map