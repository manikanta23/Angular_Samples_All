import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
declare var jQuery: any;

import { CommonDataService } from "./../../../_common/services/common-data.service";
import { PagerService } from "./../../../_common/services/pager.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { CouponService } from "./coupon.service";
import { CustomerModalService } from "../customer/customer.service";
import { Cart } from "../../../_entities/cart.entity";
import { CartService } from "../../../cart/cart.service";
import * as _ from "lodash";
import { Router } from "@angular/router";

@Component({
    selector: "coupon-modal",
    templateUrl: `./src/app/search/modal/coupon/coupon.component.html?v=${new Date().getTime()}`,
    providers: [CouponService, PagerService]
})

export class CouponModalComponent implements OnInit, OnDestroy {
    @Input('cart-total') cartTotal: number = 0;
    //@Output() onCouponInsert: EventEmitter<any> = new EventEmitter();
    coupons: any;
    couponRow: any = "";
    couponVendors: string[];
    pager: any = {};
    pagedFavouriteCustomers: any[];
    filteredFavouriteCustomers: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;
    orderType: string = "";
    isdefault: boolean = _.isEqual(this.commonDataService.Customer, this.commonDataService.DefaultCustomer);
    hasCouponSelected: boolean = false;

    isProcessing: boolean = false;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private couponService: CouponService,
        private customerModalService: CustomerModalService,
        private cartService: CartService,
        private router: Router
    ) {
    }

    subscription: any = this.commonDataService.showCouponsModalEventEmitter.subscribe((d: any) => {
        this.filterKey = "";
        this.coupons = null;
        this.couponRow = null;
        this.couponVendors = null;
        this.isProcessing = false;

        this.orderType = d;
        this.isdefault = _.isEqual(this.commonDataService.Customer, this.commonDataService.DefaultCustomer);
        if (!this.isdefault) {
            this.getCoupons();
        } else {
            jQuery("#couponModal").modal("show");
        }
    });

    ngOnInit() {
        this.filterKey = "";
        this.coupons = null;
        this.couponRow = null;
        this.couponVendors = null;
        this.isProcessing = false;
    }

    getCoupons(): void {
        this.commonDataService.Coupons = null;
        this.commonDataService.CouponVendors = null;
        jQuery("#couponModal").modal("hide");
        this.hasCouponSelected = false;
        this.filterKey = "";
        this.coupons = null;
        this.couponRow = null;
        this.couponVendors = null;
        this.isProcessing = true;
        this.couponService.getCoupons('', this.commonDataService.UserId, this.commonDataService.Customer.customerNumber, this.commonDataService.Branch.code)
            .then(coupondata => {
                if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                    this.notification.errorMessage("CouponModalComponent", "getCoupons", "getCoupon", coupondata);
                    this.commonDataService.onGetCouponComplete.emit(0);
                }
                this.commonDataService.onGetCouponComplete.emit(coupondata != undefined && coupondata != null && coupondata.length != undefined ? coupondata.length : 0);
                jQuery('body').on('shown.bs.modal', '#couponModal', function () {
                    jQuery('input:visible:enabled:first', this).focus();
                });
                if (coupondata.length > 0) {
                    this.coupons = coupondata;
                    if (this.coupons.length == 1 && this.coupons[0].couponIsRedeemable) {
                        this.coupons[0].isSelected = true;
                        this.couponRow = this.coupons[0];
                        this.commonDataService.Coupons = coupondata[0];
                        this.commonDataService.onCouponSelectEventEmitter.emit(coupondata[0]);
                        this.couponService.getCouponVendors(this.couponRow.couponId)
                            .then(couponVendors => {
                                this.couponVendors = couponVendors;
                                this.commonDataService.CouponVendors = couponVendors;
                            },
                            error => { this.isProcessing = false; this.commonDataService.onGetCouponComplete.emit(0); });
                    } else if (coupondata.length > 1 || (this.coupons.length == 1 && !this.coupons[0].couponIsRedeemable)) {
                        jQuery("#couponModal").modal("show");
                        //this.coupons = coupondata;

                        //this.coupons.map((element) => {
                        //    return this.checkCouponValidity(element);
                        //});
                    }
                    let selectedCoupons = _.filter(<any[]>coupondata, function (row) {
                        return row.couponMaxRedemptions > 0 && row.couponMaxRedemptions > row.couponClaimedRedemptions;
                    });
                    if (selectedCoupons.length > 0) {
                        this.onSelectCoupon(selectedCoupons[0]);
                    }
                } else {
                    this.commonDataService.onGetCouponComplete.emit(0);
                }
                console.log("Coupon data : ", coupondata);
            },
            error => { this.isProcessing = false; this.commonDataService.onGetCouponComplete.emit(0); });
    }

    onSelectCoupon(coupon: any) {
        this.coupons.forEach(function (t) {
            if (!_.isEqual(t, coupon)) {
                t.isSelected = false;
            }
            else {
                t.isSelected = true;

            }
        });
        this.hasCouponSelected = true;
        this.couponRow = coupon;        
    }

    clearSelection() {
        this.coupons.forEach(function (t) {
            t.isSelected = false;
        });
        this.couponRow = null;
        this.couponVendors = null;
    }

    //checkCouponValidity(coupon: any) {
    //    let cartDiff = this.cartTotal - coupon.couponMinCartDollarsRequired;
    //    let message: string = '';
    //    coupon.isSelected = false;
    //    if (cartDiff < 0) {
    //        coupon.minRequiredCartTotalShortValue = cartDiff;
    //        coupon.couponIsRedeemable = false;
    //    } else {
    //        coupon.couponIsRedeemable = true;
    //    }
    //}

    showConfirmation() {
        jQuery("#couponModal").modal("hide");
        this.commonDataService.Coupons = this.couponRow;
        this.couponService.getCouponVendors(this.couponRow.couponId)
            .then(couponVendors => {
                this.couponVendors = couponVendors;
                this.commonDataService.CouponVendors = couponVendors;
            },
            error => { this.isProcessing = false; });
        this.commonDataService.onCouponSelectEventEmitter.emit(this.couponRow);
    }

    gotoMyCart() {
        jQuery("#couponModal").modal("hide");
        jQuery('#couponModal')
            .on('hidden.bs.modal', (e) => {
                this.router.navigate(['cart']);
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}