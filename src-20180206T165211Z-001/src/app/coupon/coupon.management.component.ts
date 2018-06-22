import { Component } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CouponDashboardService } from "./coupon-dashboard.service";
import { CommonDataService } from "./../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { PagerService } from "./../_common/services/pager.service";

@Component({
     selector: "coupon.management",
     templateUrl: `./src/app/coupon/coupon.management.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]

})
export class CouponManagementComponent{
    couponData: any = null;

    pager: any = {};
    pagedCoupons: any[];
    filteredCoupons: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;

    couponsPermissions: any = null;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private couponDashboardService: CouponDashboardService) {
        //this.notification.hideNotification();
    }

    ngOnInit() {

        this.couponsPermissions = this.commonDataService.CouponsPermissions;
        
        if (this.couponsPermissions &&(this.couponsPermissions.hasImportCouponsPermissions || this.couponsPermissions.hasReadCouponsPermissions))
            this.getCouponsforCouponManagement();
    }
    getCouponsforCouponManagement() {
        this.couponDashboardService
            .getCouponsforCouponManagement()
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != null) {
                    this.notification.errorMessage("CouponManagementComponent", "getCouponsforCouponManagement", "getCouponsforCouponManagement", c);
                }
                else {
                    this.couponData = c;
                    this.filterKey = "";
                    this.filteredCoupons = c;
                    this.setPage(1);
                }
                console.log("Coupon List for Coupon management component data : ", c);
            },
            error => { });
    }
    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredCoupons.length, page, 10);

        // get current page of items
        this.pagedCoupons = this.filteredCoupons.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    sortDataBy(sortBy: string) {
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
    }
    filter = function () {

        if (this.filterKey !== '') {
            this.filteredCoupons = this.couponData.filter(function (e) {
                return ((e.couponSAPPartNumber && e.couponSAPPartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.couponStartDate && ("" + e.couponStartDate).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.couponEndDate && ("" + e.couponEndDate).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)  ||
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
    }
}