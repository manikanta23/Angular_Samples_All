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
var app_insight_part_buyout_entity_1 = require("./../../_entities/app-insight-part-buyout.entity");
var KnownPartBuyoutComponent = (function () {
    function KnownPartBuyoutComponent(loader, notification, changeDetectorRef, elementRef, commonDataService, vendorsService, cartService, applicationInsightsService) {
        var _this = this;
        this.loader = loader;
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.commonDataService = commonDataService;
        this.vendorsService = vendorsService;
        this.cartService = cartService;
        this.applicationInsightsService = applicationInsightsService;
        this.selectedCartItems = new Array();
        this.filteredCartItems = new Array();
        this.filterKey = '';
        this.partItemTobeChanged = null;
        this.vendorSubscription = this.vendorsService.notifyVendorSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                if (_this.partItemTobeChanged.defaultVendorCode.replace(/^0+/, '') == res.data.number.replace(/^0+/, '')) {
                    _this.partItemTobeChanged.isDefaultVendorSelected = true;
                }
                else {
                    _this.partItemTobeChanged.isDefaultVendorSelected = false;
                }
                _this.partItemTobeChanged.isKnownPartVendorSelected = true;
                _this.partItemTobeChanged.knownPartVendor = res.data;
                if (_this.partItemTobeChanged) {
                    _this.partItemTobeChanged.vendorCode = _this.partItemTobeChanged.knownPartVendor.number;
                    _this.vendorsService.getVendorPrice(_this.partItemTobeChanged.knownPartVendor.number, _this.partItemTobeChanged.corePartNumber, _this.partItemTobeChanged.corePrice > 0, _this.partItemTobeChanged.partNumber)
                        .then(function (vp) {
                        if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                            _this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", vp);
                            _this.loader.loading = false;
                        }
                        else {
                            _this.partItemTobeChanged.knownPartBuyoutAmount = vp.purchasePrice > 0 ? vp.purchasePrice : 1;
                            _this.partItemTobeChanged.knownPartPrice = !_this.partItemTobeChanged.isDefaultVendorSelected ? (vp.purchasePrice > 0 ? (parseFloat((vp.purchasePrice * 1.5).toFixed(2))).toString() : "1.5") : (vp.purchasePrice <= 0 ? "1.5" : _this.partItemTobeChanged.DefaultCustomerPrice);
                            _this.partItemTobeChanged.coreknownPartBuyoutAmount = vp.hasCore ? (vp.corePurchasePrice > 0 ? vp.corePurchasePrice : "1") : "0";
                            _this.partItemTobeChanged.coreknownPartPrice = vp.hasCore ? (!_this.partItemTobeChanged.isDefaultVendorSelected ? (vp.corePurchasePrice > 0 ? (vp.corePurchasePrice * 1.33).toFixed(2).toString() : "1.33") : _this.partItemTobeChanged.corePrice) : "0";
                            _this.partItemTobeChanged.defaultPrices = {
                                vendorPartPurchasePrice: _this.partItemTobeChanged.knownPartBuyoutAmount,
                                customerPartPurchasePrice: _this.partItemTobeChanged.knownPartPrice,
                                vendorCorePurchasePrice: _this.partItemTobeChanged.coreknownPartBuyoutAmount,
                                customerCorePrice: _this.partItemTobeChanged.coreknownPartPrice
                            };
                            _this.partItemTobeChanged.showVendorPanel = false;
                        }
                    }, function (error) { _this.loader.loading = false; });
                }
                console.log("Part search component vendor selection subscription data : ", res.data);
            }
        });
        this.filter = function () {
            console.log(this.filteredCartItems); //["0"].knownPartVendor.number
            if (this.filterKey !== '') {
                this.filteredCartItems = this.selectedCartItems.filter(function (e) {
                    return ((e.partNumber && e.partNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.corePartNumber && e.corePartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.knownPartVendor.name && e.knownPartVendor.name.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.knownPartVendor.name2 && e.knownPartVendor.name2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.knownPartVendor.number && e.knownPartVendor.number.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
            }
            else {
                this.filteredCartItems = this.selectedCartItems;
            }
        };
    }
    KnownPartBuyoutComponent.prototype.ngOnInit = function () {
    };
    KnownPartBuyoutComponent.prototype.showModal = function (selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems;
        this.filteredCartItems = this.selectedCartItems;
        this.partItemTobeChanged = null;
        this.initBuyout();
        jQuery("#knownPartBuyoutModal").modal("show");
    };
    KnownPartBuyoutComponent.prototype.closeModal = function () {
        jQuery("#knownPartBuyoutModal").modal("hide");
    };
    KnownPartBuyoutComponent.prototype.initBuyout = function () {
        var _this = this;
        var branchCode = this.commonDataService.Branch.code;
        _.each(this.selectedCartItems, function (row) {
            row.vendorCode = row.vendorCode == null || row.vendorCode == "" ? "" : row.vendorCode;
            row.branchCode = branchCode;
            row.defaultCustomerPrice = row.finalPrice == null ? "" : row.finalPrice;
            row.isKnownPartVendorSelected = false;
            row.knownPartVendor = null;
            row.knownPartBuyoutAmount = null;
            row.continueWithLessSalesPrice = false;
            row.isPartBuyOutCorePart = row.corePrice > 0;
        });
        this.filteredCartItems = this.selectedCartItems;
        this.loader.loading = true;
        //get Price
        this.vendorsService.getPartVendorPrice(this.filteredCartItems)
            .then(function (resp) {
            if (resp.ErrorType != undefined && resp.ErrorType != null && resp.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", resp);
                _this.loader.loading = false;
            }
            else {
                _this.selectedCartItems.forEach(function (item) {
                    var partsWithVendorCode = _.filter(resp, function (row) {
                        return row.partNumber === item.partNumber;
                    });
                    if (partsWithVendorCode && partsWithVendorCode.length > 0) {
                        var vp_1 = partsWithVendorCode[0];
                        item.knownPartBuyoutAmount = vp_1.purchasePrice > 0 ? vp_1.purchasePrice : 1;
                        var defaultCustomerPrice = item.finalPrice == null ? "" : item.finalPrice;
                        item.knownPartPrice = !item.isDefaultVendorSelected ? (vp_1.purchasePrice > 0 ? (parseFloat((vp_1.purchasePrice * 1.5).toFixed(2))).toString() : "1.5") : (vp_1.purchasePrice <= 0 ? "1.5" : defaultCustomerPrice);
                        item.coreknownPartBuyoutAmount = vp_1.hasCore ? (vp_1.corePurchasePrice > 0 ? vp_1.corePurchasePrice : "1") : "0";
                        item.coreknownPartPrice = vp_1.hasCore ? (!item.isDefaultVendorSelected ? (vp_1.corePurchasePrice > 0 ? (vp_1.corePurchasePrice * 1.33).toFixed(2).toString() : "1.33") : item.corePrice) : "0";
                        item.defaultPrices = {
                            vendorPartPurchasePrice: item.knownPartBuyoutAmount,
                            customerPartPurchasePrice: item.knownPartPrice,
                            vendorCorePurchasePrice: item.coreknownPartBuyoutAmount,
                            customerCorePrice: item.coreknownPartPrice
                        };
                        item.vendorCode = item.vendorCode == null || item.vendorCode == "" ? vp_1.vendorNumber : item.vendorCode;
                        item.defaultVendorCode = vp_1.vendorNumber;
                        //get Vendor details
                        _this.vendorsService.getVendors(item.vendorCode, "", "", "", "", "", "", "")
                            .then(function (v) {
                            if (v.ErrorType != undefined && v.ErrorType != null && v.ErrorType != 200) {
                                _this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", vp_1);
                            }
                            else {
                                item.isKnownPartVendorSelected = true;
                                item.knownPartVendor = v.vendors[0];
                            }
                            _this.loader.loading = false;
                        }, function (error) { _this.loader.loading = false; });
                    }
                });
            }
        }, function (error) { _this.loader.loading = false; });
    };
    KnownPartBuyoutComponent.prototype.removeCartItem = function (cartItem) {
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
    KnownPartBuyoutComponent.prototype.confirmPartsBuyout = function () {
        this.filteredCartItems.forEach(function (row) {
            row.buyoutPrice = +row.knownPartBuyoutAmount,
                row.salesPrice = +row.knownPartPrice,
                row.corePurchasePrice = +row.coreknownPartBuyoutAmount,
                row.corePrice = +row.coreknownPartPrice,
                row.hotFlagCode = null;
        });
        var updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsBuyOut",
            updateFlagCartItems: this.filteredCartItems
        };
        this.cartService.UpdateCartItemFlag(updateCartData, true)
            .then(function (v) {
            console.log(v);
            if (v == true) {
                jQuery("#knownPartBuyoutModal").modal("hide");
            }
        }, function (error) { console.log(error); });
        this.logToAppInsight();
    };
    KnownPartBuyoutComponent.prototype.logToAppInsight = function () {
        var _this = this;
        var sourceName = "CartComponent_confirmPartsBuyout__KnownPartBuyout";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        this.filteredCartItems.forEach(function (row) {
            var appInsightPartBuyout = Object.assign(new app_insight_part_buyout_entity_1.AppInsightPartBuyout(), {
                userId: _this.commonDataService.UserId,
                customerNumber: _this.commonDataService.Customer.customerNumber,
                customerName: _this.commonDataService.Customer.customerName,
                branchNumber: _this.commonDataService.Branch.code,
                cartNumber: _this.commonDataService.CartId,
                partId: row.partId,
                partNumber: row.partNumber,
                vendor: JSON.stringify(row.knownPartVendor).replace(/'/g, '"'),
                isDefaultVendor: row.isDefaultVendorSelected,
                defaultVendorPartPurchasePrice: row.defaultPrices != null ? row.defaultPrices.vendorPartPurchasePrice : 0,
                defaultCustomerPartPurchasePrice: row.defaultPrices != null ? row.defaultPrices.customerPartPurchasePrice : 0,
                defaultVendorCorePurchasePrice: row.defaultPrices != null ? row.defaultPrices.vendorCorePurchasePrice : 0,
                defaultCustomerCorePrice: row.defaultPrices != null ? row.defaultPrices.customerCorePrice : 0,
                vendorPartPurchasePrice: row.knownPartBuyoutAmount,
                customerPartPurchasePrice: row.knownPartPrice,
                vendorCorePurchasePrice: row.coreknownPartBuyoutAmount,
                customerCorePrice: row.coreknownPartPrice,
                quantity: row.quantity,
                quantityAvailable: row.quantityAvailable,
                plMetricName: sourceName
            });
            _this.applicationInsightsService.trackMetric(metricName, appInsightPartBuyout);
        });
    };
    KnownPartBuyoutComponent.prototype.knownPartPriceKeyPress = function (e) {
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
    KnownPartBuyoutComponent.prototype.coreknownPartPriceKeyPress = function (e) {
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
    };
    KnownPartBuyoutComponent.prototype.knownPartPriceOnPaste = function (cartItem, e) {
        var content = e.clipboardData.getData('text/plain');
        this.knownPartBuyoutCorrectPrice(cartItem, content);
        return false;
    };
    KnownPartBuyoutComponent.prototype.coreknownPartPriceOnPaste = function (cartItem, e) {
        var content = e.clipboardData.getData('text/plain');
        this.coreknownPartBuyoutCorrectPrice(cartItem, content);
        return false;
    };
    KnownPartBuyoutComponent.prototype.knownPartCorrectPrice = function (cartItem, textPrice) {
        var match = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.knownPartPrice = "1.5";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.knownPartPrice = match[0] > 0 ? match[0] : "1.5";
        }
        ;
    };
    //knownPartBuyoutPriceOnPaste(cartItem: any, e: any) {
    //    let content = e.clipboardData.getData('text/plain');
    //    this.knownPartBuyoutCorrectPrice(cartItem, content);
    //    return false;
    //}
    KnownPartBuyoutComponent.prototype.knownPartBuyoutCorrectPrice = function (cartItem, textPrice) {
        var match = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.knownPartBuyoutAmount = "1";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.knownPartBuyoutAmount = match[0] > 0 ? match[0] : "1";
            cartItem.knownPartPrice = textPrice > 0 ? (parseFloat((textPrice * 1.5).toFixed(2))).toString() : "1.5";
        }
        ;
    };
    KnownPartBuyoutComponent.prototype.coreknownPartBuyoutCorrectPrice = function (cartItem, textPrice) {
        var match = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.coreknownPartBuyoutAmount = "1";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.coreknownPartBuyoutAmount = match[0] > 0 ? match[0] : "1";
            cartItem.coreknownPartPrice = textPrice > 0 ? (parseFloat((textPrice * 1.33).toFixed(2))).toString() : "1.33";
        }
        ;
    };
    KnownPartBuyoutComponent.prototype.onToggleAccordion = function (cartItem) {
        this.partItemTobeChanged = null;
        this.selectedCartItems.forEach(function (item) {
            if (item.cartItemId != cartItem.cartItemId) {
                item.isOpened = false;
            }
            item.showVendorPanel = false;
        });
        cartItem.isOpened = cartItem.isOpened ? false : true;
    };
    KnownPartBuyoutComponent.prototype.changeVendor = function (cartItem) {
        cartItem.showVendorPanel = true;
        this.partItemTobeChanged = cartItem;
    };
    KnownPartBuyoutComponent.prototype.onKnownPartVendorSelect = function (knownPartVendor) { };
    KnownPartBuyoutComponent.prototype.ngOnDestroy = function () {
        this.vendorSubscription.unsubscribe();
    };
    return KnownPartBuyoutComponent;
}());
KnownPartBuyoutComponent = __decorate([
    core_1.Component({
        selector: "known-part-buyout",
        templateUrl: "./src/app/cart/procurement-modal/known-part-buyout.component.html?v=" + new Date().getTime(),
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        common_data_service_1.CommonDataService,
        vendors_service_1.VendorsService,
        cart_service_1.CartService,
        application_insights_service_1.ApplicationInsightsService])
], KnownPartBuyoutComponent);
exports.KnownPartBuyoutComponent = KnownPartBuyoutComponent;
//# sourceMappingURL=known-part-buyout.component.js.map