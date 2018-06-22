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
var coupon_dashboard_service_1 = require("./coupon-dashboard.service");
var common_data_service_1 = require("./../_common/services/common-data.service");
var notification_service_1 = require("./../_common/services/notification.service");
var router_1 = require("@angular/router");
var pager_service_1 = require("./../_common/services/pager.service");
var CouponFileImportComponent = (function () {
    function CouponFileImportComponent(http, notification, couponDashboardService, pagerService, router, commonDataService) {
        this.http = http;
        this.notification = notification;
        this.couponDashboardService = couponDashboardService;
        this.pagerService = pagerService;
        this.router = router;
        this.commonDataService = commonDataService;
        this.notificationType = notification_service_1.NotificationType;
        // pager object
        this.pager = {};
        this.fileItems = new Array();
        this.filteredFiletems = new Array();
        this.filterKey = '';
        this.sortBy = "";
        this.sortAsc = false;
        this.dataLoadMessage = null;
        this.isDataLoading = false;
        this.couponsPermissions = null;
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredFiletems = this.fileItems.filter(function (e) {
                    return ((e.fileName && e.fileName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.status && e.status.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
                this.setPage(1);
            }
            else {
                this.filteredFiletems = this.fileItems;
                this.setPage(1);
            }
        };
    }
    CouponFileImportComponent.prototype.ngOnInit = function () {
        this.couponsPermissions = this.commonDataService.CouponsPermissions;
        if (this.couponsPermissions && (this.couponsPermissions.hasImportCouponsPermissions || this.couponsPermissions.hasReadCouponsPermissions))
            this.getCouponFileImportsSummary();
    };
    CouponFileImportComponent.prototype.getCouponFileImportsSummary = function () {
        var _this = this;
        this.dataLoadMessage = "Loading coupon file imports summary data...";
        this.isDataLoading = true;
        this.couponDashboardService.getCouponFileImportsSummary()
            .then(function (oc) {
            _this.isDataLoading = false;
            if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                _this.notification.errorMessage("CouponFileImportComponent", "getCouponFileImportsSummary", "getCouponFileImportsSummary", oc);
            }
            else {
                _this.fileItems = oc;
                _this.filteredFiletems = _this.fileItems;
                _this.setPage(1);
                if (_this.fileItems == null || _this.fileItems.length <= 0)
                    _this.dataLoadMessage = "No records found.";
                else
                    _this.dataLoadMessage = null;
            }
            console.log("Coupon File Imports Summary : ", oc);
        }, function (error) { _this.isDataLoading = false; });
    };
    CouponFileImportComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFiletems.length, page, 10);
        // get current page of items
        this.pagedFiletems = this.filteredFiletems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    CouponFileImportComponent.prototype.sortDataBy = function (sortBy) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;
        this.sortBy = sortBy;
        this.filteredFiletems = this.commonDataService.sortData(this.filteredFiletems, this.sortBy, this.sortAsc);
        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    };
    CouponFileImportComponent.prototype.onToggleAccordion = function (fileItem) {
        this.filteredFiletems.forEach(function (item) {
            if (item.id != fileItem.id)
                item.isOpened = false;
        });
        fileItem.isOpened = fileItem.isOpened ? false : true;
    };
    return CouponFileImportComponent;
}());
CouponFileImportComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/coupon/coupon-file-import.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [http_1.Http,
        notification_service_1.NotificationService,
        coupon_dashboard_service_1.CouponDashboardService,
        pager_service_1.PagerService,
        router_1.Router,
        common_data_service_1.CommonDataService])
], CouponFileImportComponent);
exports.CouponFileImportComponent = CouponFileImportComponent;
//# sourceMappingURL=coupon-file-import.component.js.map