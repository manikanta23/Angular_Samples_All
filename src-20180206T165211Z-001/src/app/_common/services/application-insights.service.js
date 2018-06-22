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
require("rxjs/add/operator/toPromise");
var common_data_service_1 = require("./common-data.service");
var ng2_appinsights_1 = require("ng2-appinsights");
var app_insight_part_entity_1 = require("../../_entities/app-insight-part.entity");
var _ = require("lodash");
var ApplicationInsightsService = (function () {
    function ApplicationInsightsService(appInsightsService, commonDataService) {
        this.appInsightsService = appInsightsService;
        this.commonDataService = commonDataService;
        ///TrackMetricNameCollection START
        this.metricKeyValue = {
            'CartComponent_removeCartItems': 'Cart\\RemoveCartItem',
            'CartComponent_confirmPartsBuyout__KnownPartBuyout': 'Cart\\PartBuyout',
            'CartComponent_sendHotFlag': 'Cart\\PartBuyout',
            'CartComponent_checkout': 'Cart\\Checkout',
            'CheckoutComponent_placeOrder_placeOrder_Quote': 'Checkout\\CreateQuote',
            'CheckoutComponent_placeOrder_placeOrder_Order': 'Checkout\\CreateOrder',
            'CheckoutComponent_DeleteCartItem': 'Cart\\DeleteCartItem',
            'CheckoutComponent_removeCouponCartItems': 'Cart\\RemoveCoupon',
            'PartSearch_CustomerComponent_customerSearch_getCustomers': 'Home\\CustomerSearch',
            'HeaderSearch_CustomerComponent_customerSearch_getCustomers': 'SiteCustomerSearch',
            'OrderConfirmationComponent_downloadInvoice__Billing': 'OrderConfirmationComponent_downloadInvoice__Billing',
            'OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder': 'OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder',
            'OrderConfirmationComponent_getPickTicket__PrintPickTicket': 'OrderConfirmationComponent_getPickTicket__PrintPickTicket',
            'AlternateRelatedComponent_addToCart': 'AlternateRelatedComponent_addToCart',
            'PartsDetailsComponent_addToCart': 'PartsDetailsComponent_addToCart',
            'NationalInventoryComponent_addToCart__STO': 'NationalInventoryComponent_addToCart__STO',
            'PartsComponent_getParts_getParts': 'PartsComponent_getParts_getParts',
            'HeaderSearchComponent_partSearch_getPartCount': 'HeaderSearchComponent_partSearch_getPartCount',
            'HeaderSearchComponent_removeCartItems': 'HeaderSearchComponent_removeCartItems',
            'CustomerModalComponent_onCustomerSelect': 'CustomerModalComponent_onCustomerSelect',
            'FavouritesModalComponent_onSelectFavouriteCustomer': 'FavouritesModalComponent_onSelectFavouriteCustomer',
            'PartBuyoutModalComponent_addToCart__UnknownPartBuyout': 'PartBuyoutModalComponent_addToCart__UnknownPartBuyout',
            'PartsSearchComponent_partSearch_getPartCount': 'PartsSearchComponent_partSearch_getPartCount'
        };
        try {
            this.appInsightsService.Init({
                instrumentationKey: this.commonDataService.App_Insights_Instrumentation_Key,
                enableDebug: true,
                disableExceptionTracking: false
            });
        }
        catch (e) {
            console.error('ApplicationInsightsService constructor init error: ', e);
        }
    }
    ApplicationInsightsService.prototype.trackPageView = function () {
        try {
            this.appInsightsService.trackPageView(undefined, undefined, this.setApplicationVersion());
        }
        catch (e) {
            console.error('ApplicationInsightsService trackPageView error: ', e);
        }
    };
    ;
    ApplicationInsightsService.prototype.trackMetric = function (name, properties) {
        try {
            this.appInsightsService.trackMetric(name, 0, 0, 0, 0, this.setApplicationVersion(properties));
        }
        catch (e) {
            console.error('applicationinsightsservice trackmetric error: ', e);
        }
    };
    ;
    ApplicationInsightsService.prototype.trackException = function (exception, handledAt, properties) {
        try {
            this.appInsightsService.trackException(exception, handledAt, this.setApplicationVersion(properties));
        }
        catch (e) {
            console.error('ApplicationInsightsService trackException error: ', e);
        }
    };
    ;
    ApplicationInsightsService.prototype.setApplicationVersion = function (properties) {
        try {
            if (properties) {
                properties.applicaion_Version = this.commonDataService.AppVersion;
            }
            else {
                properties = { "applicaion_Version": this.commonDataService.AppVersion };
            }
            return properties;
        }
        catch (e) {
            console.error('ApplicationInsightsService setApplicationVersion error: ', e);
        }
    };
    ApplicationInsightsService.prototype.getAppInsightParts = function (data, remainingDataLength) {
        if (data != undefined && data != null) {
            var parts = null;
            if (data instanceof Array) {
                parts = _.map(data, function (element, idx) {
                    var part = element;
                    return JSON.parse(JSON.stringify(Object.assign(new app_insight_part_entity_1.AppInsightPart(), {
                        partId: part.partId ? part.partId : '',
                        partNumber: part.partNumber ? part.partNumber : (part.rushPartNumber ? part.rushPartNumber : ''),
                        partCost: part.yourPrice ? part.yourPrice : (part.customerPrice ? part.customerPrice : 0),
                        customerPrice: part.verifiedPrice ? part.verifiedPrice : (part.adjustedPrice ? part.adjustedPrice : (part.finalPrice ? part.finalPrice : (part.customerPrice ? part.customerPrice : (part.listPrice ? part.listPrice : 0)))),
                        quantity: part.quantity ? part.quantity : 0,
                        quantityAvailable: part.quantityAvailable ? part.quantityAvailable : 0,
                        verifiedPrice: part.verifiedPrice ? part.verifiedPrice : 0,
                        isSpecialPricing: part.isSpecialPricing ? part.isSpecialPricing : false,
                        vendorCode: part.vendorCode ? part.vendorCode : '',
                        hotFlagCode: part.hotFlagCode ? part.hotFlagCode : ''
                    })).replace(/'/g, '"'));
                });
            }
            else {
                parts = JSON.parse(JSON.stringify(Object.assign(new app_insight_part_entity_1.AppInsightPart(), {
                    partId: data.partId ? data.partId : '',
                    partNumber: data.partNumber ? data.partNumber : (data.rushPartNumber ? data.rushPartNumber : ''),
                    partCost: data.yourPrice ? data.yourPrice : (data.customerPrice ? data.customerPrice : 0),
                    customerPrice: data.verifiedPrice ? data.verifiedPrice : (data.adjustedPrice ? data.adjustedPrice : (data.finalPrice ? data.finalPrice : (data.customerPrice ? data.customerPrice : (data.listPrice ? data.listPrice : 0)))),
                    quantity: data.quantity ? data.quantity : 0,
                    quantityAvailable: data.quantityAvailable ? data.quantityAvailable : (data.QuantityAvailable ? data.QuantityAvailable : 0),
                    verifiedPrice: data.verifiedPrice ? data.verifiedPrice : 0,
                    isSpecialPricing: data.isSpecialPricing ? data.isSpecialPricing : false,
                    vendorCode: data.vendorCode ? data.vendorCode : '',
                    hotFlagCode: data.hotFlagCode ? data.hotFlagCode : ''
                })).replace(/'/g, '"'));
            }
            var result = JSON.stringify(parts, null, '');
            if (result.length > (1024 - remainingDataLength)) {
                result = this.getAppInsightSerializedJson(this.getAppInsightPartNumbers(data, (1024 - remainingDataLength)));
                return result;
            }
            else {
                return this.getAppInsightSerializedJson(parts);
            }
        }
        else {
            return "";
        }
    };
    ApplicationInsightsService.prototype.getAppInsightPartNumbers = function (data, maxlength) {
        var partNumbers = null;
        var partNumberArray = null;
        if (data instanceof Array) {
            partNumbers = _.map(data, function (elem) { return elem.partNumber ? elem.partNumber : (elem.rushPartNumber ? elem.rushPartNumber : ''); }).join(",");
            if (partNumbers.length > maxlength) {
                var truncateMessage = '...';
                partNumbers = partNumbers.substring(0, maxlength - 5);
                var truncatedPartNumber = partNumbers.substring(0, partNumbers.lastIndexOf(',') - (truncateMessage.length));
                partNumberArray = (truncatedPartNumber.substring(0, truncatedPartNumber.lastIndexOf(',')) + ',' + truncateMessage).split(',');
            }
            else {
                partNumberArray = partNumbers.split(',');
            }
        }
        else {
            partNumbers = data.partNumber ? data.partNumber : (data.rushPartNumber ? data.rushPartNumber : '');
            partNumberArray = [partNumbers];
        }
        return partNumberArray;
    };
    ApplicationInsightsService.prototype.getAppInsightCoupon = function (coupon) {
        var couponData = { id: coupon.couponId, code: coupon.couponCode, customerSegmentId: coupon.customerSegmentId };
        return JSON.parse(JSON.stringify(JSON.stringify(couponData).replace(/'/g, '"'), null, ''));
    };
    //getAppInsightVendor(vendor: any): any {
    //    return JSON.parse(JSON.stringify(JSON.stringify(vendor).replace(/'/g, '"'), null, ''));
    //}
    ApplicationInsightsService.prototype.getAppInsightSerializedJson = function (data) {
        return JSON.parse(JSON.stringify(JSON.stringify(data).replace(/'/g, '"'), null, ''));
    };
    ApplicationInsightsService.prototype.getMetricValue = function (metricKey) {
        return this.metricKeyValue[metricKey];
    };
    return ApplicationInsightsService;
}());
ApplicationInsightsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_appinsights_1.AppInsightsService, common_data_service_1.CommonDataService])
], ApplicationInsightsService);
exports.ApplicationInsightsService = ApplicationInsightsService;
var SourceLocationType;
(function (SourceLocationType) {
    SourceLocationType[SourceLocationType["PartSearch"] = 0] = "PartSearch";
    SourceLocationType[SourceLocationType["HeaderSearch"] = 1] = "HeaderSearch";
    SourceLocationType[SourceLocationType["PartSearch_CustomerSearch"] = 2] = "PartSearch_CustomerSearch";
    SourceLocationType[SourceLocationType["HeaderSearch_CustomerSearch"] = 3] = "HeaderSearch_CustomerSearch";
    SourceLocationType[SourceLocationType["PartSearch_AdvancedCustomerSearch"] = 4] = "PartSearch_AdvancedCustomerSearch";
    SourceLocationType[SourceLocationType["HeaderSearch_AdvancedCustomerSearch"] = 5] = "HeaderSearch_AdvancedCustomerSearch";
    SourceLocationType[SourceLocationType["PartSearch_PartSearch"] = 6] = "PartSearch_PartSearch";
    SourceLocationType[SourceLocationType["HeaderSearch_PartSearch"] = 7] = "HeaderSearch_PartSearch";
    SourceLocationType[SourceLocationType["PartListResult"] = 8] = "PartListResult";
    SourceLocationType[SourceLocationType["PartListRefineSearch"] = 9] = "PartListRefineSearch";
    SourceLocationType[SourceLocationType["PartDetailResult"] = 10] = "PartDetailResult";
    SourceLocationType[SourceLocationType["AlternateParts"] = 11] = "AlternateParts";
    SourceLocationType[SourceLocationType["RelatedParts"] = 12] = "RelatedParts";
    SourceLocationType[SourceLocationType["Cart"] = 13] = "Cart";
    SourceLocationType[SourceLocationType["Checkout"] = 14] = "Checkout";
    SourceLocationType[SourceLocationType["OrderConfirmation"] = 15] = "OrderConfirmation";
    SourceLocationType[SourceLocationType["FavouriteCustomer"] = 16] = "FavouriteCustomer";
    SourceLocationType[SourceLocationType["FavouriteVendor"] = 17] = "FavouriteVendor";
    SourceLocationType[SourceLocationType["PriceVerifyCartLineItem"] = 18] = "PriceVerifyCartLineItem";
    SourceLocationType[SourceLocationType["PriceVerifyAllCartLineItems"] = 19] = "PriceVerifyAllCartLineItems";
    SourceLocationType[SourceLocationType["PartDetailPriceVerify"] = 20] = "PartDetailPriceVerify";
    SourceLocationType[SourceLocationType["PartsResult"] = 21] = "PartsResult";
})(SourceLocationType = exports.SourceLocationType || (exports.SourceLocationType = {}));
//# sourceMappingURL=application-insights.service.js.map