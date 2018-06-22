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
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.UserDataUpdated = new core_1.EventEmitter();
        this.UserListUpdated = new core_1.EventEmitter();
    }
    UserService.prototype.getUser = function (userSearch) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/" + encodeURIComponent(userSearch.userId);
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUsers = function (userSearch) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var userSearchParams = {
            userId: userSearch.userId ? userSearch.userId : '',
            userName: userSearch.userName ? userSearch.userName : '',
            userTypeId: userSearch.userTypeId ? userSearch.userTypeId.toString() : '',
            entityTypeId: userSearch.entityTypeId ? userSearch.entityTypeId.toString() : ''
        };
        var url = "api/users?" + Object.keys(userSearchParams).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(userSearchParams[key]);
        }).join('&');
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.searchUsersInActiveDirectory = function (userName) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/SearchUsers?username=" + userName;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.createUser = function (user, providerKey, roleIds) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user";
        var params = JSON.stringify({ "user": user, "providerKey": providerKey, "roleIds": roleIds });
        return this.http.post(url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.updateUser = function (user, providerKey, roleIds) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/" + user.id;
        var params = JSON.stringify({ "user": user, "providerKey": providerKey, "roleIds": roleIds });
        return this.http.put(url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserRoles = function (userId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        //let url: string = `api/user/${userId}/roles`;
        var url = "api/user/roles?userId=" + userId;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserBranchesForOverriding = function (userId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/userbranchesforoverriding?userId=" + userId;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.getUserEntityRoles = function (userId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        //let url: string = `api/user/${userId}/entityroles`;
        var url = "api/user/entityroles?userId=" + userId;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.syncUserWithSap = function (userId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/" + userId + "/syncwithsap";
        return this.http.post(url, null, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserService.prototype.SetUserIsPricingAlert = function (userId, IsPricingAlertEnabled) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = "api/user/setuserispricingalert?userId=" + userId + "&isPricingAlertEnabled=" + IsPricingAlertEnabled;
        return this.http.put(url, null, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    // TODO : put this in base service class, extend this service with base class
    UserService.prototype.extractData = function (res) {
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
    // TODO : put this in base service class, extend this service with base class
    UserService.prototype.handleError = function (error) {
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
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map