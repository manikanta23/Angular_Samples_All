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
var UserNotificationService = (function () {
    function UserNotificationService(http) {
        this.http = http;
    }
    UserNotificationService.prototype.getUserSalesMetrics = function (notificationId, userId, branchCode) {
        var url = "api/Notifications/GetUserSalesMetrics?notificationId=" + notificationId + "&userId=" + userId + "&branchCode=" + branchCode;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserNotificationService.prototype.getNotifications = function (userId) {
        var url = "api/Notifications/GetNotifications?userId=" + userId;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserNotificationService.prototype.markNotification = function (notificationId, userId) {
        var url = "api/Notifications/MarkNotification?notificationId=" + notificationId + "&userId=" + userId;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserNotificationService.prototype.markAllNotification = function (userId) {
        var url = "api/Notifications/MarkAllNotification?userId=" + userId;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UserNotificationService.prototype.extractData = function (res) {
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
    UserNotificationService.prototype.handleError = function (error) {
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
    return UserNotificationService;
}());
UserNotificationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserNotificationService);
exports.UserNotificationService = UserNotificationService;
//# sourceMappingURL=user.notification.service.js.map