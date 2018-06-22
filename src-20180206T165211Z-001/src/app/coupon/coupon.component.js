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
//CouponComponent.ts
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var coupon_dashboard_service_1 = require("./coupon-dashboard.service");
var common_data_service_1 = require("./../_common/services/common-data.service");
var notification_service_1 = require("./../_common/services/notification.service");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var CouponComponent = (function () {
    function CouponComponent(http, notification, couponDashboardService, location, router, commonDataService) {
        this.http = http;
        this.notification = notification;
        this.couponDashboardService = couponDashboardService;
        this.location = location;
        this.router = router;
        this.commonDataService = commonDataService;
        this.isUploadBtn = false;
        this.isFileImported = false;
        this.notificationType = notification_service_1.NotificationType;
        this.formData = new FormData();
        this.couponsPermissions = null;
    }
    CouponComponent.prototype.ngOnInit = function () {
        this.couponsPermissions = this.commonDataService.CouponsPermissions;
    };
    //file upload event  
    CouponComponent.prototype.fileChange = function (event) {
        var _this = this;
        var fileList = event.target.files;
        if (fileList.length > 0) {
            this.formData = new FormData();
            for (var _i = 0, _a = event.target.files; _i < _a.length; _i++) {
                var file = _a[_i];
                var fileSize = '0';
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                this.fileName = 'Name: ' + file.name;
                this.fileSize = 'Size: ' + fileSize;
                this.fileType = 'Type: ' + file.type;
                this.formData.append(file.name, file);
            }
            this.couponDashboardService.importCouponJsonFile(this.formData)
                .then(function (oc) {
                if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                    _this.notification.errorMessage("CouponComponent", "importCouponJsonFile", "importCouponJsonFile", oc);
                }
                else {
                    _this.isFileImported = true;
                    _this.isUploadBtn = false;
                    _this.fileUploadMessages = oc;
                }
                console.log("CouponComponent importCouponJsonFile Data : ", _this.fileUploadMessages);
            }, function (error) { });
        }
        //window.location.reload();
    };
    CouponComponent.prototype.addFilesClick = function () {
        this.isUploadBtn = true;
        this.isFileImported = false;
    };
    CouponComponent.prototype.uploadFilesClick = function () {
        this.isUploadBtn = false;
        this.isFileImported = false;
    };
    CouponComponent.prototype.cancel = function () {
        this.location.back();
    };
    return CouponComponent;
}());
CouponComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/coupon/coupon.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [http_1.Http,
        notification_service_1.NotificationService,
        coupon_dashboard_service_1.CouponDashboardService,
        common_1.Location,
        router_1.Router,
        common_data_service_1.CommonDataService])
], CouponComponent);
exports.CouponComponent = CouponComponent;
//# sourceMappingURL=coupon.component.js.map