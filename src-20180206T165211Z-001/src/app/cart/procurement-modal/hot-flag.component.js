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
//hot-flag.component
var core_1 = require("@angular/core");
var notification_service_1 = require("./../../_common/services/notification.service");
var common_data_service_1 = require("./../../_common/services/common-data.service");
var loader_service_1 = require("./../../_common/services/loader.service");
var vendors_service_1 = require("./../../search/modal/vendors/vendors.service");
var cart_service_1 = require("./../cart.service");
var _ = require("lodash");
var application_insights_service_1 = require("./../../_common/services/application-insights.service");
var app_insight_hot_flag_entity_1 = require("./../../_entities/app-insight-hot-flag.entity");
var HotFlagComponent = (function () {
    function HotFlagComponent(loader, notification, changeDetectorRef, elementRef, commonDataService, vendorsService, cartService, applicationInsightsService) {
        this.loader = loader;
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.commonDataService = commonDataService;
        this.vendorsService = vendorsService;
        this.cartService = cartService;
        this.applicationInsightsService = applicationInsightsService;
        this.hotFlags = null;
        this.selectedCartItems = new Array();
        this.filteredCartItems = new Array();
        this.filterKey = '';
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredCartItems = this.selectedCartItems.filter(function (e) {
                    return ((e.partNumber && e.partNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.corePartNumber && e.corePartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
            }
            else {
                this.filteredCartItems = this.selectedCartItems;
            }
        };
    }
    HotFlagComponent.prototype.ngOnInit = function () {
    };
    HotFlagComponent.prototype.showModal = function (selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems;
        this.filteredCartItems = this.selectedCartItems;
        this.initHotFlag();
        jQuery("#hotFlagModal").modal("show");
    };
    HotFlagComponent.prototype.closeModal = function () {
        jQuery("#hotFlagModal").modal("hide");
    };
    HotFlagComponent.prototype.initHotFlag = function () {
        var _this = this;
        var branchCode = this.commonDataService.Branch.code;
        _.each(this.filteredCartItems, function (row) {
            row.vendorCode = row.vendorCode == null || row.vendorCode == "" ? "" : row.vendorCode;
            row.branchCode = branchCode;
        });
        this.loader.loading = true;
        //get Price
        this.vendorsService.getPartVendorPrice(this.filteredCartItems)
            .then(function (vp) {
            _this.loader.loading = false;
            if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                _this.notification.errorMessage("HotFlagComponent", "initBuyout", "getPartVendorPrice", vp);
            }
            else {
                _this.selectedCartItems.forEach(function (item) {
                    var partsWithVendorCode = _.filter(vp, function (row) {
                        return row.partNumber === item.partNumber;
                    });
                    if (partsWithVendorCode && partsWithVendorCode.length > 0) {
                        item.vendorCode = partsWithVendorCode[0].vendorNumber;
                    }
                });
            }
            console.log("getPartVendorPrice", vp);
        }, function (error) { _this.loader.loading = false; });
    };
    HotFlagComponent.prototype.removeCartItem = function (cartItem) {
        var selectedItems = this.selectedCartItems.filter(function (item) { return item.cartItemId === cartItem.cartItemId; });
        var index = -1;
        if (selectedItems.length > 0)
            index = this.selectedCartItems.indexOf(selectedItems[0]);
        if (index != -1) {
            // Find and remove item from an array
            this.selectedCartItems.splice(index, 1);
            this.filteredCartItems = this.selectedCartItems;
            this.filter();
        }
    };
    HotFlagComponent.prototype.updateCartItemsHotFlag = function () {
        var _this = this;
        this.filteredCartItems.forEach(function (row) {
            row.buyoutPrice = null,
                row.salesPrice = null,
                row.corePurchasePrice = null,
                row.corePrice = null;
        });
        var updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsHotFlag",
            updateFlagCartItems: this.filteredCartItems
        };
        this.loader.loading = true;
        this.cartService.UpdateCartItemFlag(updateCartData, true)
            .then(function (v) {
            _this.loader.loading = false;
            console.log(v);
            if (v == true) {
                _this.closeModal();
                _this.notification.showNotification("HotFlag Updated Successfully for selected part(s).", notification_service_1.NotificationType.Success);
            }
        }, function (error) { _this.loader.loading = false; console.log(error); });
        var sourceName = "CartComponent_sendHotFlag";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightHotFlag = Object.assign(new app_insight_hot_flag_entity_1.AppInsightHotFlag(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightHotFlag.hotFlagCartItems = this.applicationInsightsService.getAppInsightParts(this.filteredCartItems, JSON.stringify(appInsightHotFlag).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightHotFlag);
    };
    HotFlagComponent.prototype.onToggleAccordion = function (cartItem) {
        this.selectedCartItems.forEach(function (item) {
            if (item.cartItemId != cartItem.cartItemId)
                item.isOpened = false;
        });
        cartItem.isOpened = cartItem.isOpened ? false : true;
    };
    return HotFlagComponent;
}());
__decorate([
    core_1.Input("hot-flags"),
    __metadata("design:type", Object)
], HotFlagComponent.prototype, "hotFlags", void 0);
HotFlagComponent = __decorate([
    core_1.Component({
        selector: "hot-flag",
        templateUrl: "./src/app/cart/procurement-modal/hot-flag.component.html?v=" + new Date().getTime(),
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        common_data_service_1.CommonDataService,
        vendors_service_1.VendorsService,
        cart_service_1.CartService,
        application_insights_service_1.ApplicationInsightsService])
], HotFlagComponent);
exports.HotFlagComponent = HotFlagComponent;
//# sourceMappingURL=hot-flag.component.js.map