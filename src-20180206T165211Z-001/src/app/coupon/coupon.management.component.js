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
var coupon_dashboard_service_1 = require("./coupon-dashboard.service");
var common_data_service_1 = require("./../_common/services/common-data.service");
var notification_service_1 = require("./../_common/services/notification.service");
var pager_service_1 = require("./../_common/services/pager.service");
var CouponManagementComponent = (function () {
    function CouponManagementComponent(notification, commonDataService, pagerService, couponDashboardService) {
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.couponDashboardService = couponDashboardService;
        this.couponData = null;
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.couponsPermissions = null;
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredCoupons = this.couponData.filter(function (e) {
                    return ((e.couponSAPPartNumber && e.couponSAPPartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.couponStartDate && ("" + e.couponStartDate).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.couponEndDate && ("" + e.couponEndDate).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.couponDescription && e.couponDescription.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.couponDiscountFlatAmount && ("" + e.couponDiscountFlatAmount).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.couponCode && ("" + e.couponCode).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
                this.setPage(1);
            }
            else {
                this.filteredCoupons = this.couponData;
                this.setPage(1);
            }
        };
        //this.notification.hideNotification();
    }
    CouponManagementComponent.prototype.ngOnInit = function () {
        this.couponsPermissions = this.commonDataService.CouponsPermissions;
        if (this.couponsPermissions && (this.couponsPermissions.hasImportCouponsPermissions || this.couponsPermissions.hasReadCouponsPermissions))
            this.getCouponsforCouponManagement();
    };
    CouponManagementComponent.prototype.getCouponsforCouponManagement = function () {
        var _this = this;
        this.couponDashboardService
            .getCouponsforCouponManagement()
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != null) {
                _this.notification.errorMessage("CouponManagementComponent", "getCouponsforCouponManagement", "getCouponsforCouponManagement", c);
            }
            else {
                _this.couponData = c;
                _this.filterKey = "";
                _this.filteredCoupons = c;
                _this.setPage(1);
            }
            console.log("Coupon List for Coupon management component data : ", c);
        }, function (error) { });
    };
    CouponManagementComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredCoupons.length, page, 10);
        // get current page of items
        this.pagedCoupons = this.filteredCoupons.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    CouponManagementComponent.prototype.sortDataBy = function (sortBy) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;
        this.sortBy = sortBy;
        this.filteredCoupons = this.commonDataService.sortData(this.filteredCoupons, this.sortBy, this.sortAsc);
        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    };
    return CouponManagementComponent;
}());
CouponManagementComponent = __decorate([
    core_1.Component({
        selector: "coupon.management",
        templateUrl: "./src/app/coupon/coupon.management.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        coupon_dashboard_service_1.CouponDashboardService])
], CouponManagementComponent);
exports.CouponManagementComponent = CouponManagementComponent;
//# sourceMappingURL=coupon.management.component.js.map