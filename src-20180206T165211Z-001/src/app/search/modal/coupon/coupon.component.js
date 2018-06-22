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
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var notification_service_1 = require("./../../../_common/services/notification.service");
var coupon_service_1 = require("./coupon.service");
var customer_service_1 = require("../customer/customer.service");
var cart_service_1 = require("../../../cart/cart.service");
var _ = require("lodash");
var router_1 = require("@angular/router");
var CouponModalComponent = (function () {
    function CouponModalComponent(notification, commonDataService, pagerService, couponService, customerModalService, cartService, router) {
        var _this = this;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.couponService = couponService;
        this.customerModalService = customerModalService;
        this.cartService = cartService;
        this.router = router;
        this.cartTotal = 0;
        this.couponRow = "";
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.orderType = "";
        this.isdefault = _.isEqual(this.commonDataService.Customer, this.commonDataService.DefaultCustomer);
        this.hasCouponSelected = false;
        this.isProcessing = false;
        this.subscription = this.commonDataService.showCouponsModalEventEmitter.subscribe(function (d) {
            _this.filterKey = "";
            _this.coupons = null;
            _this.couponRow = null;
            _this.couponVendors = null;
            _this.isProcessing = false;
            _this.orderType = d;
            _this.isdefault = _.isEqual(_this.commonDataService.Customer, _this.commonDataService.DefaultCustomer);
            if (!_this.isdefault) {
                _this.getCoupons();
            }
            else {
                jQuery("#couponModal").modal("show");
            }
        });
    }
    CouponModalComponent.prototype.ngOnInit = function () {
        this.filterKey = "";
        this.coupons = null;
        this.couponRow = null;
        this.couponVendors = null;
        this.isProcessing = false;
    };
    CouponModalComponent.prototype.getCoupons = function () {
        var _this = this;
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
            .then(function (coupondata) {
            if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                _this.notification.errorMessage("CouponModalComponent", "getCoupons", "getCoupon", coupondata);
                _this.commonDataService.onGetCouponComplete.emit(0);
            }
            _this.commonDataService.onGetCouponComplete.emit(coupondata != undefined && coupondata != null && coupondata.length != undefined ? coupondata.length : 0);
            jQuery('body').on('shown.bs.modal', '#couponModal', function () {
                jQuery('input:visible:enabled:first', this).focus();
            });
            if (coupondata.length > 0) {
                _this.coupons = coupondata;
                if (_this.coupons.length == 1 && _this.coupons[0].couponIsRedeemable) {
                    _this.coupons[0].isSelected = true;
                    _this.couponRow = _this.coupons[0];
                    _this.commonDataService.Coupons = coupondata[0];
                    _this.commonDataService.onCouponSelectEventEmitter.emit(coupondata[0]);
                    _this.couponService.getCouponVendors(_this.couponRow.couponId)
                        .then(function (couponVendors) {
                        _this.couponVendors = couponVendors;
                        _this.commonDataService.CouponVendors = couponVendors;
                    }, function (error) { _this.isProcessing = false; _this.commonDataService.onGetCouponComplete.emit(0); });
                }
                else if (coupondata.length > 1 || (_this.coupons.length == 1 && !_this.coupons[0].couponIsRedeemable)) {
                    jQuery("#couponModal").modal("show");
                    //this.coupons = coupondata;
                    //this.coupons.map((element) => {
                    //    return this.checkCouponValidity(element);
                    //});
                }
                var selectedCoupons = _.filter(coupondata, function (row) {
                    return row.couponMaxRedemptions > 0 && row.couponMaxRedemptions > row.couponClaimedRedemptions;
                });
                if (selectedCoupons.length > 0) {
                    _this.onSelectCoupon(selectedCoupons[0]);
                }
            }
            else {
                _this.commonDataService.onGetCouponComplete.emit(0);
            }
            console.log("Coupon data : ", coupondata);
        }, function (error) { _this.isProcessing = false; _this.commonDataService.onGetCouponComplete.emit(0); });
    };
    CouponModalComponent.prototype.onSelectCoupon = function (coupon) {
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
    };
    CouponModalComponent.prototype.clearSelection = function () {
        this.coupons.forEach(function (t) {
            t.isSelected = false;
        });
        this.couponRow = null;
        this.couponVendors = null;
    };
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
    CouponModalComponent.prototype.showConfirmation = function () {
        var _this = this;
        jQuery("#couponModal").modal("hide");
        this.commonDataService.Coupons = this.couponRow;
        this.couponService.getCouponVendors(this.couponRow.couponId)
            .then(function (couponVendors) {
            _this.couponVendors = couponVendors;
            _this.commonDataService.CouponVendors = couponVendors;
        }, function (error) { _this.isProcessing = false; });
        this.commonDataService.onCouponSelectEventEmitter.emit(this.couponRow);
    };
    CouponModalComponent.prototype.gotoMyCart = function () {
        var _this = this;
        jQuery("#couponModal").modal("hide");
        jQuery('#couponModal')
            .on('hidden.bs.modal', function (e) {
            _this.router.navigate(['cart']);
        });
    };
    CouponModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return CouponModalComponent;
}());
__decorate([
    core_1.Input('cart-total'),
    __metadata("design:type", Number)
], CouponModalComponent.prototype, "cartTotal", void 0);
CouponModalComponent = __decorate([
    core_1.Component({
        selector: "coupon-modal",
        templateUrl: "./src/app/search/modal/coupon/coupon.component.html?v=" + new Date().getTime(),
        providers: [coupon_service_1.CouponService, pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        coupon_service_1.CouponService,
        customer_service_1.CustomerModalService,
        cart_service_1.CartService,
        router_1.Router])
], CouponModalComponent);
exports.CouponModalComponent = CouponModalComponent;
//# sourceMappingURL=coupon.component.js.map