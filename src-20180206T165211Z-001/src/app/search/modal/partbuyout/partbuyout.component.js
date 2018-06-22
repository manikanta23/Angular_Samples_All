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
var router_1 = require("@angular/router");
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var notification_service_1 = require("./../../../_common/services/notification.service");
var cart_service_1 = require("./../../../cart/cart.service");
var cart_entity_1 = require("./../../../_entities/cart.entity");
var vendors_service_1 = require("./../vendors/vendors.service");
var vendor_component_1 = require("./../../../vendor/vendor.component");
var app_insight_part_buyout_entity_1 = require("../../../_entities/app-insight-part-buyout.entity");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var PartBuyoutModalComponent = (function () {
    function PartBuyoutModalComponent(notification, commonDataService, pagerService, cartService, router, vendorsService, elementRef, applicationInsightsService) {
        var _this = this;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.cartService = cartService;
        this.router = router;
        this.vendorsService = vendorsService;
        this.elementRef = elementRef;
        this.applicationInsightsService = applicationInsightsService;
        this.partsbuyoutQuantity = 1;
        this.partNo = "PARTSBUYOUTTX";
        this.price = "1.5";
        this.searchData = new cart_entity_1.CartSearch();
        this.selectedPartBuyoutCoreOption = "";
        this.isVendorSelected = false;
        this.vendor = null;
        this.buyoutAmount = "1";
        this.addtoCartParameters = new cart_entity_1.Cart();
        this.vendorSubscription = this.vendorsService.notifyVendorSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.isVendorSelected = true;
                _this.vendor = res.data;
                _this.elementRef.nativeElement.querySelector('input#txtpartNoOnly').focus();
                console.log("Part search component vendor selection subscription data : ", res.data);
            }
        });
        //this.notification.hideNotification();
    }
    PartBuyoutModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        jQuery('#partBuyoutModal')
            .on('hidden.bs.modal', function (e) {
            jQuery('.nav-tabs a[href="#pnlVendorSearch"]').tab('show');
            _this.isVendorSelected = false;
            _this.vendor = null;
            _this.partNoOnly = "";
            _this.description = "";
            _this.manufacturer = "";
            _this.price = "1.5";
            _this.buyoutAmount = "1";
            _this.selectedPartBuyoutCoreOption = "";
            _this.partsbuyoutQuantity = 1;
        })
            .on('shown.bs.modal', function (e) {
            _this.isVendorSelected = false;
            _this.vendor = null;
            //this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
        });
    };
    PartBuyoutModalComponent.prototype.onChangePartBuyout = function (newValue) {
        console.log("Partbuyout modal component on change : ", newValue);
        this.selectedPartBuyoutCoreOption = newValue;
    };
    PartBuyoutModalComponent.prototype.CancelPartBuyout = function () {
        this.partsbuyoutQuantity = 1;
        this.partNo = "PARTSBUYOUTTX";
        this.partNoOnly = null;
        this.description = null;
        this.manufacturer = null;
        this.price = "1.5";
        this.buyoutAmount = "1";
        this.selectedPartBuyoutCoreOption = "";
    };
    PartBuyoutModalComponent.prototype.addToCart = function (partNo, partNoOnly, description, manufacturer, price, partsbuyoutQuantity, partBuyoutCoreOption) {
        var _this = this;
        if (partNo === void 0) { partNo = "PARTSBUYOUTTX"; }
        this.addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: partNo,
            description: description,
            customerPrice: price,
            quantity: partsbuyoutQuantity == "0" ? "1" : partsbuyoutQuantity,
            coreOption: null,
            coreprice: null,
            corePartNumber: null,
            partId: null,
            listPrice: price,
            priceOverrideReasonId: null,
            PartNumOnly: partNoOnly,
            cartId: this.cartId,
            isBuyout: true,
            cateogory: "P0101",
            manufacturer: manufacturer,
            partBuyoutCoreOption: partBuyoutCoreOption,
            VendorCode: this.vendor.number,
            PurchasePrice: this.buyoutAmount
        });
        var sourceName = "PartBuyoutModalComponent_addToCart__UnknownPartBuyout";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightPartBuyout = Object.assign(new app_insight_part_buyout_entity_1.AppInsightPartBuyout(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            partNumber: (partNoOnly != null ? (partNoOnly + ",") : "") + (description != null ? (description + ",") : "") + (manufacturer != null ? manufacturer : ""),
            vendor: JSON.stringify(this.vendor).replace(/'/g, '"'),
            defaultVendorPartPurchasePrice: 1,
            defaultCustomerPartPurchasePrice: 1.5,
            vendorPartPurchasePrice: this.buyoutAmount,
            customerPartPurchasePrice: price,
            quantity: this.addtoCartParameters.quantity,
            plMetricName: sourceName
        });
        this.applicationInsightsService.trackMetric(metricName, appInsightPartBuyout);
        this.cartService.addToCart(this.addtoCartParameters)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("PartBuyoutModalComponent", "addToCart", "addToCart", carts);
            }
            else {
                _this.partsbuyoutQuantity = 1;
                _this.partNo = "PARTSBUYOUTTX";
                _this.partNoOnly = null;
                _this.description = "";
                _this.manufacturer = "";
                _this.price = null;
                _this.buyoutAmount = null;
                _this.selectedPartBuyoutCoreOption = "";
                _this.notification.showNotification(partNo + " " + partNoOnly + " " + (description != null ? description : "") + " with " + partsbuyoutQuantity + " quantity added successfully.", notification_service_1.NotificationType.Success);
                jQuery("#partBuyoutModal").modal("hide");
                _this.router.navigate(['/cart']);
            }
        }, function (error) { });
    };
    //Vendor Start
    PartBuyoutModalComponent.prototype.removeFavouriteVendors = function (selectedVendor) {
        var _this = this;
        this.vendorsService.deleteFavouriteVendors(selectedVendor.number)
            .then(function (favVendors) {
            if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                _this.notification.errorMessage("PartBuyoutModalComponent", "removeFavouriteVendors", "deleteFavouriteVendors", favVendors);
            }
            else {
                if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                    _this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                }
                else {
                    _this.vendor.isFavourite = false;
                    _this.vendorsService.notifyFavouriteVendorChange(selectedVendor);
                }
            }
        }, function (error) { });
    };
    PartBuyoutModalComponent.prototype.addToFavouriteVendors = function (selectedVendor) {
        var _this = this;
        this.vendorsService.createFavouriteVendors(selectedVendor.number)
            .then(function (favVendors) {
            if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                _this.notification.errorMessage("PartBuyoutModalComponent", "addToFavouriteVendors", "createFavouriteVendors", favVendors);
            }
            else {
                if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                    _this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                }
                else {
                    _this.vendor.isFavourite = true;
                    _this.vendorsService.notifyFavouriteVendorChange(selectedVendor);
                }
            }
        }, function (error) { });
    };
    PartBuyoutModalComponent.prototype.useDifferentVendor = function () {
        if (this.vendorComponent) {
            this.vendorComponent.vendorNumber = "";
            this.vendorComponent.advVendorName = "";
            this.vendorComponent.advVendorCity = "";
            this.vendorComponent.advVendorState = "";
            this.vendorComponent.advVendorPostalCode = "";
            this.vendorComponent.advVendorPhoneNumber = "";
        }
        this.isVendorSelected = false;
    };
    PartBuyoutModalComponent.prototype.changeQuntity = function (e) {
        if (e.which == 38) {
            this.partsbuyoutQuantity = +(this.partsbuyoutQuantity) + 1;
        }
        else if (e.which == 40 && this.partsbuyoutQuantity > 1) {
            this.partsbuyoutQuantity = this.partsbuyoutQuantity - 1;
        }
    };
    PartBuyoutModalComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    PartBuyoutModalComponent.prototype.onQuantityFocusout = function (e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            this.partsbuyoutQuantity = 1;
        }
    };
    PartBuyoutModalComponent.prototype.priceKeyPress = function (e) {
        var priceVal = e.currentTarget.value;
        // allows 0-9, backspace, and decimal
        if (((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 46)) {
            return false;
        }
        // checks to make sure only 1 decimal is allowed
        if (e.which == 46) {
            if (priceVal.indexOf(".") != -1)
                return false;
        }
        //if (/^\d*(\.\d\d)$/.test(priceVal)) {
        //    return false;
        //}
    };
    PartBuyoutModalComponent.prototype.priceOnPaste = function (e) {
        var content = e.clipboardData.getData('text/plain');
        this.correctPrice(content);
        return false;
    };
    PartBuyoutModalComponent.prototype.correctPrice = function (textPrice) {
        var match = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        this.price = "1.5";
        if (match && match.length > 0) {
            this.price = match[0];
            this.elementRef.nativeElement.querySelector('input#txtPrice').value = match[0] > 0 ? match[0] : "1.5";
            this.price = textPrice > 0 ? textPrice : "1.5";
        }
        ;
    };
    PartBuyoutModalComponent.prototype.buyoutPriceOnPaste = function (e) {
        var content = e.clipboardData.getData('text/plain');
        this.buyoutCorrectPrice(content);
        return false;
    };
    PartBuyoutModalComponent.prototype.buyoutCorrectPrice = function (textPrice) {
        var match = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        this.buyoutAmount = "1";
        if (match && match.length > 0) {
            this.buyoutAmount = match[0] > 0 ? match[0] : "1";
            this.elementRef.nativeElement.querySelector('input#txtBuyoutAmount').value = match[0] > 0 ? match[0] : "1";
            this.price = textPrice > 0 ? (parseFloat((textPrice * 1.5).toFixed(2))).toString() : "1.5";
        }
        ;
    };
    PartBuyoutModalComponent.prototype.ngOnDestroy = function () {
        this.vendorSubscription.unsubscribe();
    };
    return PartBuyoutModalComponent;
}());
__decorate([
    core_1.ViewChild('vendorPanel'),
    __metadata("design:type", vendor_component_1.VendorComponent)
], PartBuyoutModalComponent.prototype, "vendorComponent", void 0);
PartBuyoutModalComponent = __decorate([
    core_1.Component({
        selector: "partBuyout-modal",
        templateUrl: "./src/app/search/modal/partbuyout/partbuyout.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        cart_service_1.CartService,
        router_1.Router,
        vendors_service_1.VendorsService,
        core_1.ElementRef,
        application_insights_service_1.ApplicationInsightsService])
], PartBuyoutModalComponent);
exports.PartBuyoutModalComponent = PartBuyoutModalComponent;
//# sourceMappingURL=partbuyout.component.js.map