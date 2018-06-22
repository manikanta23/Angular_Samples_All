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
//import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
var cart_service_1 = require("./cart.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var cart_entity_1 = require("./../_entities/cart.entity");
var common_data_service_1 = require("./../_common/services/common-data.service");
var loader_service_1 = require("./../_common/services/loader.service");
var notification_service_1 = require("./../_common/services/notification.service");
var partbuyout_component_1 = require("./../search/modal/partbuyout/partbuyout.component");
var price_verify_component_1 = require("./../parts/details/price-verify/price-verify.component");
var msc_price_verify_part_1 = require("./../_entities/msc-price-verify-part");
var hot_flag_component_1 = require("./procurement-modal/hot-flag.component");
var known_part_buyout_component_1 = require("./procurement-modal/known-part-buyout.component");
var user_service_1 = require("./../user/user.service");
var vendors_service_1 = require("./../search/modal/vendors/vendors.service");
var _ = require("lodash");
var application_insights_service_1 = require("../_common/services/application-insights.service");
var app_insight_quote_entity_1 = require("../_entities/app-insight-quote.entity");
var update_cart_entity_1 = require("../_entities/update-cart-entity");
var coupon_service_1 = require("../search/modal/coupon/coupon.service");
var app_insight_hot_flag_entity_1 = require("../_entities/app-insight-hot-flag.entity");
var app_insight_customer_change_entity_1 = require("../_entities/app-insight-customer-change.entity");
var app_insight_billing_entity_1 = require("../_entities/app-insight-billing.entity");
var stock_transfer_order_component_1 = require("./procurement-modal/stock-transfer-order.component");
var CartComponent = (function () {
    function CartComponent(loader, activatedRoute, cartService, title, router, changeDetectorRef, commonDataService, vendorsService, userService, elementRef, notification, couponService, applicationInsightsService) {
        var _this = this;
        this.loader = loader;
        this.activatedRoute = activatedRoute;
        this.cartService = cartService;
        this.title = title;
        this.router = router;
        this.changeDetectorRef = changeDetectorRef;
        this.commonDataService = commonDataService;
        this.vendorsService = vendorsService;
        this.userService = userService;
        this.elementRef = elementRef;
        this.notification = notification;
        this.couponService = couponService;
        this.applicationInsightsService = applicationInsightsService;
        this.deliveryType = "";
        this.estimatedFrieght = 0;
        this.estimatedDelivery = 0;
        this.isPriceAdjustmentActive = false;
        this.isDefaultVendorSelected = true;
        this.defaultVendorCode = "";
        this.isPartBuyOutCorePart = false;
        this.searchData = new cart_entity_1.CartSearch();
        this.total = 0;
        this.cartMessage = "";
        this.defaultBranchValue = 0;
        this.partSearchTerm = "";
        this.subscription = null;
        this.branchSubscription = null;
        this.selectedAdjustedPriceReason = 0;
        this.selectedRushPartNumber = "";
        this.priceAdjustmentMessage = "";
        this.isQuantityChanged = false;
        //Procurement....
        this.selectedCartItemArray = new Array();
        this.disableProcurementbuttons = false;
        //HotFlag list...
        this.doNotShowPricingAlert = false;
        this.isMscOrFleetCustomer = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        this.mscPayerSubscription = null;
        this.sourceLocationType = application_insights_service_1.SourceLocationType;
        this.completeCartItems = null;
        //coupon....
        this.couponCodeSearchTerm = null;
        this.searchedCouponData = null;
        this.isProcessingCoupon = false;
        this.isCouponSelected = this.commonDataService.Coupons != null && this.commonDataService.Coupons != undefined
            && this.commonDataService.Coupons.couponCode != null && this.commonDataService.Coupons.couponCode != undefined && this.commonDataService.Coupons.couponCode != "";
        this.defaultPrices = null;
        this.isBranchChanged = false;
        this.branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe(function (d) {
            _this.isBranchChanged = true;
            _this.branchDataUpdated = d;
        });
        this.isCustomerChanged = false;
        this.customerDataOnCustomerChange = null;
        this.PONumber = "";
        this.customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe(function (d) {
            _this.isCustomerChanged = true;
            _this.customerDataOnCustomerChange = d;
        });
        title.setTitle("Cart - Parts Link");
        //this.notification.hideNotification();
    }
    CartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cartsData = null;
        this.partsBuyOutData = null;
        this.hotFlagData = null;
        this.stockTransferData = null;
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            //this.getDefaultBranchValue();
            _this.getCarts();
            _this.branchName = _this.commonDataService.Branch.name;
            _this.branchCode = _this.commonDataService.Branch.code;
            _this.branchCity = _this.commonDataService.Branch.city;
            _this.loader.loading = false;
        });
        this.cartCountSubscription = this.cartService.notifyCartChangeEventEmitter.subscribe(function (d) {
            _this.getCarts();
            //this.selectedCartItemArray = new Array<any>();
        });
        this.mscPayerSubscription = this.commonDataService.mscPayerUpdated.subscribe(function (d) {
            _this.isMscOrFleetCustomer = (_this.commonDataService.MscPayer != null && _this.commonDataService.MscPayer != undefined)
                ? _this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        });
        //this.getDefaultBranchValue();
        this.branchName = this.commonDataService.Branch.name;
        this.branchCode = this.commonDataService.Branch.code;
        this.branchCity = this.commonDataService.Branch.city;
        this.getCarts();
        this.getHotFlags();
        if ((this.commonDataService.UserIsPricingAlertEnabled == "True" || this.commonDataService.UserIsPricingAlertEnabled == "true") && this.isMscOrFleetCustomer)
            jQuery("#pricingAlertPopup").modal("show");
    };
    CartComponent.prototype.getDefaultBranchValue = function () {
        var _this = this;
        this.cartService.CheckDefaultBranchValue(this.commonDataService.Branch.code)
            .then(function (b) {
            if (b.ErrorType != undefined && b.ErrorType != null && b.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "getDefaultBranchValue", "CheckDefaultBranchValue", b);
            }
            else {
                _this.defaultBranchValue = b;
            }
        }, function (error) { });
    };
    CartComponent.prototype.getCarts = function () {
        var _this = this;
        //this.cartsData = null;
        //this.partsBuyOutData = null;
        //this.hotFlagData = null;
        //this.stockTransferData = null;
        this.isQuantityChanged = false;
        this.cartCount = 0;
        this.mycartCount = 0;
        this.completeCartItems = null;
        this.selectedCartItemArray = new Array();
        this.cartMessage = "loading cart items ...";
        this.searchData = Object.assign(new cart_entity_1.CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId
        });
        this.cartService.getCarts(this.searchData)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "getCarts", "getCarts", c);
            }
            else {
                if (!c || c.carts == undefined || c.carts == null || c.carts.length == 0) {
                    _this.cartsData = null;
                    _this.partsBuyOutData = null;
                    _this.hotFlagData = null;
                    _this.stockTransferData = null;
                    _this.cartCount = 0;
                    _this.mycartCount = 0;
                    _this.cartMessage = "cart item is not available.";
                }
                else {
                    var carts = c.carts;
                    _this.completeCartItems = c.carts;
                    _this.commonDataService.CartId = c.carts[0].cartId;
                    _this.PONumber = c.carts[0].poNumber == "" || c.carts[0].poNumber == null ? _this.commonDataService.Customer.customerPONumber : c.carts[0].poNumber;
                    if (c != undefined && c != null && c.carts != undefined && c.carts != null && c.carts.length > 0) {
                        c.carts.forEach(function (t) {
                            t.hasCoupon = _this.commonDataService.checkPartCouponVendorAssociation(t.partNumber);
                        });
                    }
                    if (c.hasError) {
                        _this.notification.showMultilineNotification(c.errorMessages);
                    }
                    _this.freight = _.filter(carts, function (row) {
                        return row.isFreight == true;
                    });
                    var couponItem = _.filter(carts, function (row) {
                        return row.couponId != null && row.couponId != "";
                    });
                    _this.isCouponSelected = couponItem.length > 0 || (_this.commonDataService.Coupons != null && _this.commonDataService.Coupons != undefined
                        && _this.commonDataService.Coupons.couponCode != null && _this.commonDataService.Coupons.couponCode != undefined && _this.commonDataService.Coupons.couponCode != "");
                    if (_this.freight && _this.freight.length > 0) {
                        _this.estimatedFrieght = _this.freight[0].finalPrice;
                    }
                    _this.delivery = _.filter(carts, function (row) {
                        return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                    });
                    if (_this.delivery && _this.delivery.length > 0) {
                        _this.estimatedDelivery = _this.delivery[0].finalPrice;
                    }
                    _this.cartsData = _.reject(carts, function (item) {
                        return item.isBuyout == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    _this.partsBuyOutData = _.filter(carts, function (row) {
                        return row.isBuyout == true;
                    });
                    _this.hotFlagData = _.filter(carts, function (row) {
                        return row.isHotFlag == true;
                    });
                    _this.stockTransferData = _.filter(carts, function (row) {
                        return row.isSTO == true;
                    });
                    console.log("cartsData :", _this.cartsData, " partsBuyOutData :", _this.partsBuyOutData, " hotFlagData :", _this.hotFlagData, " stockTransferData :", _this.stockTransferData);
                    // this.cartsData = carts;
                    _this.cartCount = _this.cartsData.length + _this.partsBuyOutData.length + _this.hotFlagData.length + _this.stockTransferData.length;
                    _this.cartSubTotalAmount = _this.calculateCartTotals();
                    _this.mycartCount = _this.cartsData.length + _this.partsBuyOutData.length + _this.hotFlagData.length + _this.stockTransferData.length;
                    _this.total = _this.calculateCartTotals() + _this.estimatedFrieght + _this.estimatedDelivery;
                    if ((!_this.cartsData && !_this.partsBuyOutData && !_this.hotFlagData && !_this.stockTransferData) || (_this.cartsData.length <= 0 && _this.partsBuyOutData.length <= 0 && _this.hotFlagData.length <= 0 && _this.stockTransferData.length <= 0)) {
                        _this.cartsData = null;
                        _this.partsBuyOutData = null;
                        _this.hotFlagData = null;
                        _this.stockTransferData = null;
                        _this.cartCount = 0;
                        _this.mycartCount = 0;
                        _this.cartMessage = "cart item is not available.";
                    }
                }
                if (_this.isCustomerChanged) {
                    var appInsightCustomerChange = Object.assign(new app_insight_customer_change_entity_1.AppInsightCustomerChange(), {
                        userId: _this.commonDataService.UserId,
                        searchTerm: '',
                        branchNumber: _this.commonDataService.Branch.code,
                        cartNumber: _this.commonDataService.CartId,
                        source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Cart]
                    });
                    if (_this.customerDataOnCustomerChange != undefined && _this.customerDataOnCustomerChange != null) {
                        if (_this.customerDataOnCustomerChange.previousCustomer != undefined && _this.customerDataOnCustomerChange.previousCustomer != null) {
                            appInsightCustomerChange.previousCustomerNumber = _this.customerDataOnCustomerChange.previousCustomer.customerNumber;
                            appInsightCustomerChange.previousCustomerName = _this.customerDataOnCustomerChange.previousCustomer.customerName;
                        }
                        if (_this.customerDataOnCustomerChange.newCustomer != undefined && _this.customerDataOnCustomerChange.newCustomer != null) {
                            appInsightCustomerChange.currentCustomerNumber = _this.customerDataOnCustomerChange.newCustomer.customerNumber;
                            appInsightCustomerChange.currentCustomerName = _this.customerDataOnCustomerChange.newCustomer.customerName;
                        }
                    }
                    appInsightCustomerChange.products = _this.applicationInsightsService.getAppInsightParts(_this.completeCartItems, JSON.stringify(appInsightCustomerChange).length);
                    _this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
                    _this.isCustomerChanged = false;
                    _this.customerDataOnCustomerChange = null;
                }
                if (_this.isBranchChanged) {
                    var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                        userId: _this.commonDataService.UserId,
                        searchTerm: '',
                        customerNumber: _this.commonDataService.Customer.customerNumber,
                        customerName: _this.commonDataService.Customer.customerName,
                        cartNumber: _this.commonDataService.CartId,
                        PONumber: (_this.commonDataService.PONumberValue == null || _this.commonDataService.PONumberValue == undefined) ? "" : _this.commonDataService.PONumberValue,
                        source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Cart],
                        unitNumber: (_this.commonDataService.UnitNumberValue == null || _this.commonDataService.UnitNumberValue == undefined) ? "" : _this.commonDataService.UnitNumberValue,
                    });
                    if (_this.branchDataUpdated != undefined && _this.branchDataUpdated != null) {
                        if (_this.branchDataUpdated.previousBranch != undefined && _this.branchDataUpdated.previousBranch != null) {
                            appInsightBilling.previousBranch = _this.branchDataUpdated.previousBranch.code;
                        }
                        if (_this.branchDataUpdated.newBranch != undefined && _this.branchDataUpdated.newBranch != null) {
                            appInsightBilling.currentBranch = _this.branchDataUpdated.newBranch.code;
                        }
                    }
                    appInsightBilling.products = _this.applicationInsightsService.getAppInsightParts(_this.completeCartItems, JSON.stringify(appInsightBilling).length);
                    _this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                    _this.isBranchChanged = false;
                }
            }
        }, function (error) { });
    };
    CartComponent.prototype.getHotFlags = function () {
        var _this = this;
        this.hotFlags = null;
        this.cartService.getHotFlags()
            .then(function (h) {
            if (h.ErrorType != undefined && h.ErrorType != null && h.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "getCarts", "getCarts", h);
            }
            else {
                _this.hotFlags = h;
            }
            console.log("hotFlags Data : ", h);
        }, function (error) { });
    };
    CartComponent.prototype.onChangePriceOverride = function (newValue) {
        console.log("Cart onChangePriceOverride : ", newValue);
        this.selectedAdjustedPriceReason = newValue;
    };
    CartComponent.prototype.clrPriceOverride = function () {
        this.adjustedPriceValue = null;
        this.selectedAdjustedPriceReason = 0;
    };
    CartComponent.prototype.priceOverride = function (selectedCartItem) {
        this.selectedRushPartNumber = "";
        this.adjustedPriceValue = null;
        this.selectedAdjustedPriceReason = 0;
        this.cartId = selectedCartItem.cartId;
        this.cartItemId = selectedCartItem.cartItemId;
        this.yourPrice = selectedCartItem.customerPrice;
        this.listPrice = selectedCartItem.listPrice;
        this.selectedRushPartNumber = selectedCartItem.partNumber;
        jQuery('body').on('shown.bs.modal', '#priceoverrideOnCart', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    };
    CartComponent.prototype.setCartAdjustedPrice = function (adjustedPrice, priceOverrideReasonId) {
        var priceOverrideLowerLimit = this.yourPrice;
        var priceTobeAdjusted = this.listPrice;
        var priceOverrideFactor = this.commonDataService.Price_Override_Factor;
        //adjusted Price is within x% of cost price, e.g. 10%
        var calulatedPercentagePrice = (priceTobeAdjusted * priceOverrideFactor) / 100;
        var lowerLimit = priceTobeAdjusted - calulatedPercentagePrice;
        var selectedPartNumber = this.selectedRushPartNumber;
        //let isCoupon: boolean = _.includes(this.commonDataService.Coupons, this.selectedRushPartNumber);
        var isCoupon = this.commonDataService.CouponCriteria.some(function (v) { return selectedPartNumber.indexOf(v) >= 0; });
        if (!isCoupon && !(adjustedPrice >= lowerLimit && adjustedPrice >= priceOverrideLowerLimit)) {
            this.notification.showNotification("You are violating the adjustment limit.", notification_service_1.NotificationType.Error);
        }
        else {
            this.priceAdjustmentMessage = "Are You Sure? Remember! Coupons, Discounts, or Fee Credits must be entered as a negative value (e.g. $ -5.00)";
            jQuery("#confirmationPriceAdjustment").modal("show");
            jQuery("#priceoverrideOnCart").modal("hide");
        }
    };
    CartComponent.prototype.onPriceAdjustmentConfirmationYes = function () {
        var _this = this;
        var adjustedPriceData = {
            cartItemId: this.cartItemId,
            cartId: this.cartId,
            adjustedPrice: this.adjustedPriceValue,
            selectedAdjustedPriceReason: this.selectedAdjustedPriceReason
        };
        this.cartService.UpdateForAdjustedPrice(adjustedPriceData)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "setCartAdjustedPrice", "UpdateForAdjustedPrice", carts);
            }
            else {
                jQuery("#priceoverrideOnCart").modal("hide");
            }
        }, function (error) { });
    };
    CartComponent.prototype.removeCartItems = function () {
        var _this = this;
        var deleteCartItems = new Array();
        var cartItemArray = new Array();
        this.selectedCartItemArray.forEach(function (row) {
            if (row.couponId == null) {
                var _item = {
                    cartItemId: row.cartItemId,
                    quantityAvailable: row.quantityAvailable,
                };
                deleteCartItems.push(_item);
                cartItemArray.push(row);
            }
            else {
                _this.commonDataService.Coupons = null;
                _this.commonDataService.CouponVendors = null;
            }
        });
        var removeCartData = {
            cartId: this.commonDataService.CartId,
            isPickupDeliveryType: false,
            deleteCartItems: deleteCartItems
        };
        this.cartService.DeleteCartItem(removeCartData)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "removeCartItems", "DeleteCartItem", carts);
            }
        }, function (error) { });
        var sourceName = "CartComponent_removeCartItems";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightQuote = Object.assign(new app_insight_quote_entity_1.AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(cartItemArray, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
    };
    CartComponent.prototype.updateCartItems = function (selectedCartItem) {
        var _this = this;
        var updateForMycart = Object.assign(new update_cart_entity_1.UpdateCart(), {
            cartItemId: selectedCartItem.cartItemId,
            cartId: selectedCartItem.cartId,
            price: selectedCartItem.quantity * selectedCartItem.finalPrice,
            quantity: selectedCartItem.quantity,
            corePrice: selectedCartItem.corePrice,
            coreOption: selectedCartItem.coreOption,
            partBuyoutCoreOption: selectedCartItem.partBuyoutCoreOption,
            quantityAvailable: selectedCartItem.quantityAvailable,
            deliveryType: ""
        });
        this.cartService.UpdateCartItemformycart(updateForMycart)
            .then(function (carts) {
            if (carts) {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    _this.notification.errorMessage("CartComponent", "updateCartItems", "UpdateCartItem", carts);
                }
            }
        }, function (error) { });
    };
    CartComponent.prototype.editFreight = function (editedPrice) {
        this.cartService.UpdateCartFreightAndDelivery(this.freight[0].cartId, this.freight[0].cartItemId, editedPrice)
            .then(function (carts) {
        }, function (error) { });
    };
    CartComponent.prototype.editDelivery = function (editedPrice) {
        this.cartService.UpdateCartFreightAndDelivery(this.delivery[0].cartId, this.delivery[0].cartItemId, editedPrice)
            .then(function (carts) {
        }, function (error) { });
    };
    CartComponent.prototype.processKeyUp = function (e, el) {
        if (e.keyCode == 65) {
            el.focus();
        }
    };
    CartComponent.prototype.hidenotification = function () {
        this.notification.hideNotification();
    };
    CartComponent.prototype.calculateCartTotals = function () {
        var totalPrice = 0;
        if (this.cartsData != undefined && this.cartsData != null && this.cartsData.length > 0) {
            this.cartsData.forEach(function (d) {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                    if (d.corePrice > 0 && d.coreOption == "NOCORER") {
                        totalPrice += d.quantity * (d.finalPrice + d.corePrice);
                    }
                    else {
                        totalPrice += d.quantity * d.finalPrice;
                    }
                }
            });
        }
        if (this.partsBuyOutData != undefined && this.partsBuyOutData != null && this.partsBuyOutData.length > 0) {
            this.partsBuyOutData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.hotFlagData != undefined && this.hotFlagData != null && this.hotFlagData.length > 0) {
            this.hotFlagData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.stockTransferData != undefined && this.stockTransferData != null && this.stockTransferData.length > 0) {
            this.stockTransferData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        return totalPrice;
    };
    CartComponent.prototype.changeQuntity = function (cart, e) {
        if (e.which != 9) {
            this.isQuantityChanged = true;
        }
        if (e.which == 38) {
            cart.quantity = +(cart.quantity) + 1;
            this.updateCartItems(cart);
        }
        else if (e.which == 40 && cart.quantity > 1) {
            cart.quantity = cart.quantity - 1;
            this.updateCartItems(cart);
        }
    };
    CartComponent.prototype.onQuantityFocusout = function (cart, e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            cart.quantity = 1;
        }
        if (this.isQuantityChanged)
            this.updateCartItems(cart);
    };
    CartComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    CartComponent.prototype.onChangeCartItemsHotFlag = function (cartItem, newValue) {
        var _this = this;
        cartItem.hotFlagCode = newValue;
        var updateFlagCartItems = new Array();
        var _item = {
            cartItemId: cartItem.cartItemId,
            cartItemFlag: "IsHotFlag",
            vendorCode: cartItem.vendorCode,
            buyoutPrice: null,
            salesPrice: null,
            corePurchasePrice: null,
            corePrice: null,
            hotFlagCode: newValue,
        };
        updateFlagCartItems.push(_item);
        var updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsHotFlag",
            updateFlagCartItems: updateFlagCartItems
        };
        this.cartService.UpdateCartItemFlag(updateCartData, false)
            .then(function (v) {
            console.log(v);
            _this.notification.showNotification("HotFlag Updated Successfully for part " + cartItem.partNumber, notification_service_1.NotificationType.Success);
        }, function (error) { console.log(error); });
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
        appInsightHotFlag.hotFlagCartItems = this.applicationInsightsService.getAppInsightParts(cartItem, JSON.stringify(appInsightHotFlag).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightHotFlag);
    };
    CartComponent.prototype.verifyPriceOfAllCartItems = function () {
        var mscPriceVerifyParts = new Array();
        var parts = new Array();
        _.each(this.selectedCartItemArray, function (row) {
            if (row.couponId == null) {
                var _mscPart = Object.assign(new msc_price_verify_part_1.MscPriceVerifyPart(), {
                    PartNumber: row.partNumber,
                    Quantity: row.quantity,
                    UnitPrice: row.finalPrice //adjustedPrice
                });
                mscPriceVerifyParts.push(_mscPart);
                parts.push(row);
            }
        });
        this.priceVerifyComponent.mscPriceVerifyParts = mscPriceVerifyParts;
        this.priceVerifyComponent.parts = parts;
        this.priceVerifyComponent.showModal(application_insights_service_1.SourceLocationType.PriceVerifyAllCartLineItems);
    };
    CartComponent.prototype.onMscPriceVerified = function (mscPriceVerifiedData) {
        console.log("onMscPriceVerified : ", mscPriceVerifiedData);
        if (mscPriceVerifiedData != null && mscPriceVerifiedData != undefined) {
            this.getCarts();
            //this.selectedCartItemArray = new Array<any>();
        }
    };
    CartComponent.prototype.hidePricingAlertPopup = function () {
        var _this = this;
        jQuery("#pricingAlertPopup").modal("hide");
        if (this.doNotShowPricingAlert == true) {
            this.userService.SetUserIsPricingAlert(this.commonDataService.UserId, !this.doNotShowPricingAlert)
                .then(function (p) {
                if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                    _this.notification.errorMessage("CartComponent", "hidePricingAlertPopup", "SetUserIsPricingAlert", p);
                }
                else {
                    _this.commonDataService.UserIsPricingAlertEnabled = p.isPricingAlertEnabled;
                    console.log("IsPricingAlertEnabled Updated:", p);
                }
            }, function (error) { });
        }
    };
    CartComponent.prototype.checkout = function () {
        var sourceName = "CartComponent_checkout";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightQuote = Object.assign(new app_insight_quote_entity_1.AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            PONumber: this.PONumber,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(this.completeCartItems, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
        this.router.navigate(['/checkout']);
    };
    CartComponent.prototype.searchCoupons = function () {
        var _this = this;
        this.isProcessingCoupon = true;
        this.couponService.getCoupons(this.couponCodeSearchTerm, this.commonDataService.UserId, null, this.commonDataService.Branch.code)
            .then(function (coupondata) {
            _this.isProcessingCoupon = false;
            if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "searchCoupons", "searchCoupons", coupondata);
            }
            else if (coupondata.length > 0 && coupondata[0].couponMaxRedemptions > 0 && coupondata[0].couponMaxRedemptions <= coupondata[0].couponClaimedRedemptions) {
                _this.notification.showNotification("Coupon has already been redeemed " + coupondata[0].couponClaimedRedemptions + " of " + coupondata[0].couponMaxRedemptions + " times.", notification_service_1.NotificationType.Error);
            }
            else if (coupondata.length > 0) {
                _this.searchedCouponData = coupondata[0];
                jQuery("#searchedCouponDataModal").modal("show");
            }
            else {
                _this.notification.showNotification("Coupon not found.", notification_service_1.NotificationType.Error);
            }
            console.log("DefaultCustomer Coupon data : ", coupondata);
        }, function (error) { _this.isProcessingCoupon = false; });
    };
    CartComponent.prototype.addCouponToCart = function () {
        var _this = this;
        var couponRequestObject = {
            cartId: this.commonDataService.CartId,
            couponId: this.searchedCouponData.couponId,
            customerSegmentId: this.searchedCouponData.customerSegmentId,
            couponCode: this.searchedCouponData.couponCode
        };
        this.loader.loading = true;
        this.couponService.addCouponToCart(couponRequestObject)
            .then(function (coupondata) {
            if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                _this.notification.errorMessage("CartComponent", "addCouponToCart", "addCouponToCart", coupondata);
            }
            else {
                console.log("Add Coupon For Default Customer", coupondata);
                if (coupondata.errorMessage != null && coupondata.errorMessage != undefined) {
                    if (!coupondata.hasError) {
                        _this.notification.showNotification(coupondata.errorMessage[0].message, notification_service_1.NotificationType.Success);
                        _this.couponCodeSearchTerm = null;
                        jQuery("#searchedCouponDataModal").modal("hide");
                        _this.commonDataService.Coupons = _this.searchedCouponData;
                        _this.isCouponSelected = true;
                        _this.couponService.getCouponVendors(_this.searchedCouponData.couponId)
                            .then(function (couponVendors) {
                            _this.commonDataService.CouponVendors = couponVendors;
                        }, function (error) { });
                        _this.getCarts();
                    }
                    else {
                        if (coupondata.errorMessage.length > 1) {
                            _this.notification.showMultilineNotification(coupondata.errorMessage);
                        }
                        else {
                            _this.notification.showNotification(coupondata.errorMessage[0].message, coupondata.errorMessage[0].type);
                        }
                    }
                }
                _this.loader.loading = false;
            }
        }, function (error) { _this.loader.loading = false; });
    };
    //Procurement Start...
    CartComponent.prototype.onCartItemSelectionChange = function (cartItem, isChecked) {
        var selectedItems = this.selectedCartItemArray.filter(function (item) { return item.cartItemId === cartItem.cartItemId; });
        var index = -1;
        if (selectedItems.length > 0)
            index = this.selectedCartItemArray.indexOf(selectedItems[0]);
        if (isChecked == true && index === -1) {
            this.selectedCartItemArray.push(cartItem);
        }
        else if (isChecked == false && index != -1) {
            // Find and remove item from an array
            this.selectedCartItemArray.splice(index, 1);
        }
        this.disableProcurementbuttons = this.selectedCartItemArray.filter(function (item) { return item.partNumber == 'PARTSBUYOUTTX' || (item.couponId != undefined && item.couponId != null && item.couponId != ''); }).length > 0;
    };
    CartComponent.prototype.selectAll = function () {
        var _this = this;
        this.cartsData.filter(function (row) {
            row.selected = true;
            _this.onCartItemSelectionChange(row, true);
        });
        this.partsBuyOutData.filter(function (row) {
            row.selected = true;
            _this.onCartItemSelectionChange(row, true);
        });
        this.hotFlagData.filter(function (row) {
            row.selected = true;
            _this.onCartItemSelectionChange(row, true);
        });
        this.stockTransferData.filter(function (row) {
            row.selected = true;
            _this.onCartItemSelectionChange(row, true);
        });
    };
    CartComponent.prototype.unSelectAll = function () {
        var _this = this;
        this.cartsData.filter(function (row) {
            row.selected = false;
            _this.onCartItemSelectionChange(row, false);
        });
        this.partsBuyOutData.filter(function (row) {
            row.selected = false;
            _this.onCartItemSelectionChange(row, false);
        });
        this.hotFlagData.filter(function (row) {
            row.selected = false;
            _this.onCartItemSelectionChange(row, false);
        });
        this.stockTransferData.filter(function (row) {
            row.selected = false;
            _this.onCartItemSelectionChange(row, false);
        });
    };
    CartComponent.prototype.ShowHotFlagModal = function () {
        var selectedItems = [];
        _.each(this.selectedCartItemArray, function (row) {
            var _item = {
                cartItemId: row.cartItemId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: (row.hotFlagCode != null && row.hotFlagCode != undefined && row.hotFlagCode != '') ? row.hotFlagCode : '',
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice
            };
            selectedItems.push(_item);
        });
        this.hotFlagComponent.showModal(selectedItems);
    };
    CartComponent.prototype.ShowKnownPartBuyoutModal = function () {
        var selectedItems = [];
        _.each(this.selectedCartItemArray, function (row) {
            var _item = {
                cartItemId: row.cartItemId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: row.hotFlagCode,
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice,
                finalPrice: row.finalPrice,
                isDefaultVendorSelected: true
            };
            selectedItems.push(_item);
        });
        this.knownPartBuyoutComponent.showModal(selectedItems);
    };
    CartComponent.prototype.ShowStockTransferModal = function () {
        var selectedItems = [];
        _.each(this.selectedCartItemArray, function (row) {
            var _item = {
                cartItemId: row.cartItemId,
                cartId: row.cartId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: row.hotFlagCode,
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice,
                listPrice: row.listPrice,
                adjustedPrice: row.adjustedPrice,
                finalPrice: row.finalPrice,
                description: row.description,
                customerPrice: row.customerPrice,
                partId: row.partId,
                isPriceVerified: row.isPriceVerified,
                rebateField: row.rebateField,
                priceOverrideReasonId: row.priceOverrideReasonId,
                partNumOnly: row.partNumOnly,
                vmrsCode: row.vmrsCode,
                vmrsDescription: row.vmrsDescription,
                manufacturer: row.manufacturer,
                cateogory: row.cateogory,
                binLocation: row.binLocation,
                partWithSource: row.partWithSource,
                isSplit: row.isSplit,
                verifiedPrice: row.verifiedPrice
            };
            selectedItems.push(_item);
        });
        this.stockTransferOrderComponent.showModal(selectedItems);
    };
    //Procurement End...
    CartComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.cartCountSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this.mscPayerSubscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
    };
    return CartComponent;
}());
__decorate([
    core_1.ViewChild('partBuyoutModal'),
    __metadata("design:type", partbuyout_component_1.PartBuyoutModalComponent)
], CartComponent.prototype, "partBuyoutComponent", void 0);
__decorate([
    core_1.ViewChild('priceVerify'),
    __metadata("design:type", price_verify_component_1.PriceVerifyComponent)
], CartComponent.prototype, "priceVerifyComponent", void 0);
__decorate([
    core_1.ViewChild('hotFlag'),
    __metadata("design:type", hot_flag_component_1.HotFlagComponent)
], CartComponent.prototype, "hotFlagComponent", void 0);
__decorate([
    core_1.ViewChild('knownPartBuyout'),
    __metadata("design:type", known_part_buyout_component_1.KnownPartBuyoutComponent)
], CartComponent.prototype, "knownPartBuyoutComponent", void 0);
__decorate([
    core_1.ViewChild('stockTransfer'),
    __metadata("design:type", stock_transfer_order_component_1.StockTransferOrderComponent)
], CartComponent.prototype, "stockTransferOrderComponent", void 0);
CartComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/cart/cart.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        router_1.ActivatedRoute,
        cart_service_1.CartService,
        platform_browser_1.Title,
        router_1.Router,
        core_1.ChangeDetectorRef,
        common_data_service_1.CommonDataService,
        vendors_service_1.VendorsService,
        user_service_1.UserService,
        core_1.ElementRef,
        notification_service_1.NotificationService,
        coupon_service_1.CouponService,
        application_insights_service_1.ApplicationInsightsService])
], CartComponent);
exports.CartComponent = CartComponent;
//# sourceMappingURL=cart.component.js.map