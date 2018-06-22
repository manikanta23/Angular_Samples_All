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
var notification_service_1 = require("./../../../_common/services/notification.service");
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var loader_service_1 = require("./../../../_common/services/loader.service");
var parts_service_1 = require("./../../parts.service");
var app_insight_add_to_cart_entity_1 = require("../../../_entities/app-insight-add-to-cart.entity");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var _ = require("lodash");
var PriceVerifyComponent = (function () {
    function PriceVerifyComponent(loader, notification, changeDetectorRef, elementRef, commonDataService, partsService, applicationInsightsService) {
        this.loader = loader;
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.commonDataService = commonDataService;
        this.partsService = partsService;
        this.applicationInsightsService = applicationInsightsService;
        this.searchTerm = "";
        this.callbackMscPriceVerified = new core_1.EventEmitter();
    }
    PriceVerifyComponent.prototype.ngOnInit = function () {
        this.assignAccountandCardNumbers();
    };
    PriceVerifyComponent.prototype.showModal = function (source) {
        this.source = source;
        jQuery("#priceVerify").modal("show");
        jQuery('.price-verify-msc').show();
    };
    PriceVerifyComponent.prototype.closeModal = function () {
        jQuery("#priceVerify").modal("hide");
        jQuery('.price-verify-msc').hide();
    };
    PriceVerifyComponent.prototype.assignAccountandCardNumbers = function () {
        this.mscCardAccountNo = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.mscCardNumber : "";
        this.payerAccountNumber = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.payerNumber : "";
    };
    PriceVerifyComponent.prototype.mscPriceVerification = function () {
        var _this = this;
        var mscPriceVerifyData = {
            mscPriceVerifyParts: this.mscPriceVerifyParts,
            payerAccountNumber: this.payerAccountNumber,
            mscCardNumber: this.mscCardAccountNo,
            branchCode: this.commonDataService.Branch.code,
            cartId: this.commonDataService.CartId
        };
        this.loader.loading = true;
        this.partsService.getMscPriceVerification(mscPriceVerifyData)
            .then(function (p) {
            _this.loader.loading = false;
            if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                _this.notification.errorMessage("PriceVerifyComponent", "mscPriceVerification", "getMscPriceVerification", p);
            }
            else {
                if (p.priceVerifyItems != null && p.priceVerifyItems != undefined && p.priceVerifyItems.length > 0) {
                    var _mscPriceVerifiedData = {
                        isPriceVerified: p.priceVerifyItems["0"].isPriceVerified,
                        itemCategory: p.priceVerifyItems["0"].itemCategory,
                        partNumber: p.priceVerifyItems["0"].partNumber,
                        quantity: p.priceVerifyItems["0"].quantity,
                        rebate: p.priceVerifyItems["0"].rebate,
                        unitPrice: p.priceVerifyItems["0"].unitPrice
                    };
                    var isPriceVerified = _.filter(p.priceVerifyItems, function (row) {
                        return row.isPriceVerified == true;
                    });
                    if (isPriceVerified.length > 0) {
                        /*******/
                        _.each(_this.parts, function (row) {
                            var verifiedItem = _.filter(p.priceVerifyItems, function (verifiedItemRow) {
                                return verifiedItemRow.partNumber == row.rushPartNumber || verifiedItemRow.partNumber == row.partNumber;
                            })[0];
                            row.verifiedPrice = verifiedItem.unitPrice;
                        });
                        /*******/
                        var appInsightAddToCart = Object.assign(new app_insight_add_to_cart_entity_1.AppInsightAddToCart(), {
                            userId: _this.commonDataService.UserId,
                            customerNumber: _this.commonDataService.Customer.customerNumber,
                            customerName: _this.commonDataService.Customer.customerName,
                            branchNumber: _this.commonDataService.Branch.code,
                            cartNumber: _this.commonDataService.CartId,
                            source: application_insights_service_1.SourceLocationType[_this.source]
                        });
                        appInsightAddToCart.product = _this.applicationInsightsService.getAppInsightParts(_this.parts, JSON.stringify(appInsightAddToCart).length);
                        _this.applicationInsightsService.trackMetric("PriceVerifyComponent_priceVerify_mscPriceVerification", appInsightAddToCart);
                    }
                    _this.showResponseMessage(isPriceVerified, p.messages);
                    _this.callbackMscPriceVerified.emit(_mscPriceVerifiedData);
                }
            }
            console.log("PriceVerify Component: ", p);
        }, function (error) { _this.loader.loading = false; });
        jQuery("#priceVerify").modal("hide");
    };
    PriceVerifyComponent.prototype.showResponseMessage = function (isPriceVerified, messages) {
        var successMessageObject = { message: "The Price has been verified and adjusted.", type: notification_service_1.NotificationType.Success };
        if (isPriceVerified && isPriceVerified.length > 0 && messages.length <= 0) {
            this.notification.showNotification(successMessageObject.message, successMessageObject.type);
        }
        else if (isPriceVerified && isPriceVerified.length > 0 && messages.length > 0) {
            messages.push(successMessageObject);
            this.notification.showMultilineNotification(messages);
        }
        else if (messages.length > 1) {
            this.notification.showMultilineNotification(messages);
        }
        else if (messages.length == 1) {
            this.notification.showNotification(messages[0].message, messages[0].type);
        }
    };
    return PriceVerifyComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], PriceVerifyComponent.prototype, "callbackMscPriceVerified", void 0);
PriceVerifyComponent = __decorate([
    core_1.Component({
        selector: "price-verify",
        templateUrl: "./src/app/parts/details/price-verify/price-verify.component.html?v=" + new Date().getTime(),
        providers: [application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        common_data_service_1.CommonDataService,
        parts_service_1.PartsService,
        application_insights_service_1.ApplicationInsightsService])
], PriceVerifyComponent);
exports.PriceVerifyComponent = PriceVerifyComponent;
//# sourceMappingURL=price-verify.component.js.map