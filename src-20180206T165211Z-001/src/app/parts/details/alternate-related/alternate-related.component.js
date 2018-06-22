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
var parts_service_1 = require("./../../parts.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var notification_service_1 = require("./../../../_common/services/notification.service");
var part_search_entity_1 = require("./../../../_entities/part-search.entity");
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var ts_clipboard_1 = require("ts-clipboard");
var national_inventory_modal_service_1 = require("./../national-inventory/national-inventory-modal.service");
var cart_service_1 = require("./../../../cart/cart.service");
var cart_entity_1 = require("./../../../_entities/cart.entity");
var pager_service_1 = require("./../../../_common/services/pager.service");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var app_insight_add_to_cart_entity_1 = require("../../../_entities/app-insight-add-to-cart.entity");
var AlternateRelatedComponent = (function () {
    function AlternateRelatedComponent(activatedRoute, partsService, title, commonDataService, pagerService, cartService, notification, nationalInventoryModalService, applicationInsightsService) {
        this.activatedRoute = activatedRoute;
        this.partsService = partsService;
        this.title = title;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.cartService = cartService;
        this.notification = notification;
        this.nationalInventoryModalService = nationalInventoryModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.searchData = new part_search_entity_1.PartSearch();
        this.partsData = null;
        this.isRelatedFlag = true;
        this.detailPart = null;
        this.addtoCartParameters = new cart_entity_1.Cart();
        // pager object
        this.pager = {};
        this.alternaterelatedCoreOption = "NOCORER";
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
    }
    AlternateRelatedComponent.prototype.ngOnInit = function () {
        if (this.isRelatedFlag) {
            this.assignChartOptions();
        }
        this.source = this.isRelatedFlag ? application_insights_service_1.SourceLocationType.RelatedParts : application_insights_service_1.SourceLocationType.AlternateParts;
        console.log("Alternate-Related component parts data : ", this.partsData);
        this.setPage(1);
    };
    AlternateRelatedComponent.prototype.copyToClipBoard = function (contentToCopy) {
        ts_clipboard_1.Clipboard.copy(contentToCopy);
        this.notification.showNotification(contentToCopy + " copied to clipboard.", notification_service_1.NotificationType.Success);
    };
    AlternateRelatedComponent.prototype.openNationalInventory = function (part) {
        part.type = this.isRelatedFlag ? 'related' : 'alternate';
        part.source = this.isRelatedFlag ? application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.RelatedParts] : application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.AlternateParts];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
    };
    AlternateRelatedComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    AlternateRelatedComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.partsData.parts.length, page, 4);
        // get current page of items
        this.pagedAlternateRelatedParts = this.partsData.parts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    AlternateRelatedComponent.prototype.alternaterelatedCoreOptionChange = function (alternaterelatedCoreOption) {
        this.alternaterelatedCoreOption = alternaterelatedCoreOption;
    };
    AlternateRelatedComponent.prototype.addToCart = function (addToCartItem) {
        var _this = this;
        var trackingParameters;
        var source = '';
        if (this.isRelatedFlag) {
            trackingParameters = JSON.stringify({
                "AddedFrom": "RelatedPart",
                "PartId": this.detailPart.partId,
                "GroupRelatedPartId": this.detailPart.groupRelatedpartId,
                "BranchCode": this.commonDataService.Branch.code,
                "MaterialId": this.detailPart.rushPartNumber
            });
            source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.RelatedParts];
        }
        else {
            trackingParameters = JSON.stringify({
                "AddedFrom": "AlternatePart",
                "PartId": this.detailPart.partId,
                "GroupPartId": this.detailPart.groupId,
                "BranchCode": this.commonDataService.Branch.code
            });
            source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.AlternateParts];
        }
        var sourceName = "AlternateRelatedComponent_addToCart";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightAddToCart = Object.assign(new app_insight_add_to_cart_entity_1.AppInsightAddToCart(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            source: source,
            plMetricName: sourceName
        });
        appInsightAddToCart.product = this.applicationInsightsService.getAppInsightParts(addToCartItem, JSON.stringify(appInsightAddToCart).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightAddToCart);
        this.addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.branchCode,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: addToCartItem.rushPartNumber,
            description: addToCartItem.description,
            customerPrice: addToCartItem.customerPrice,
            quantity: addToCartItem.quantity,
            coreOption: this.alternaterelatedCoreOption,
            coreprice: addToCartItem.corePrice,
            corePartNumber: addToCartItem.corePart,
            partId: addToCartItem.partId,
            listPrice: addToCartItem.listPrice,
            adjustedPrice: addToCartItem.adjustedPrice,
            priceOverrideReasonId: addToCartItem.priceOverrideReasonId,
            PartNumOnly: addToCartItem.partNumberOnly,
            vmrsCode: addToCartItem.vmrsCode,
            vmrsDescription: addToCartItem.vmrsDescription,
            manufacturer: addToCartItem.manufacturer,
            cateogory: addToCartItem.cateogory,
            TrackingParameters: trackingParameters,
            binLocation: addToCartItem.binLocation,
            QuantityAvailable: addToCartItem.quantityAvailable,
            CorePurchasePrice: addToCartItem.corePrice,
            isSpecialPricing: addToCartItem.isSpecialPricing
        });
        this.cartService.addToCart(this.addtoCartParameters)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("AlternateRelatedComponent", "addToCart", "addToCart", carts);
            }
            else {
                _this.notification.showNotification(addToCartItem.rushPartNumber + " " + addToCartItem.description + " with " + addToCartItem.quantity + " quantity added successfully.", notification_service_1.NotificationType.Success);
            }
            console.log("Alternate-Related component AddtoCart : ", addToCartItem);
        }, function (error) { });
    };
    AlternateRelatedComponent.prototype.changeQuntity = function (part, e) {
        if (e.which == 38)
            part.quantity = +(part.quantity) + 1;
        else if (e.which == 40 && part.quantity > 1)
            part.quantity = part.quantity - 1;
        //else if ((e.which == 8 || e.which == 46) && !part.quantity)
        //    part.quantity = 1;
        //else if (part.quantity == 0)
        //    part.quantity = 1;
    };
    AlternateRelatedComponent.prototype.onQuantityFocusout = function (part, e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            part.quantity = 1;
        }
    };
    AlternateRelatedComponent.prototype.assignChartOptions = function () {
        if (this.partsData != undefined && this.partsData != null && this.partsData.parts.length > 0) {
            for (var i = 0; i < this.partsData.parts.length; i++) {
                var relevancePercent = this.partsData.parts[i].confidence;
                this.partsData.parts[i].chartOptions = this.getChartOptions(relevancePercent);
            }
        }
    };
    AlternateRelatedComponent.prototype.getChartOptions = function (relevancePercent) {
        var relevance = this.getRelevance(relevancePercent);
        return {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                margin: [-8, -8, -8, -8],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
            },
            exporting: {
                enabled: false
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    size: '80%',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    animation: false,
                    borderWidth: 1,
                    borderColor: '#EEB111',
                    showInLegend: false,
                    type: 'pie',
                    data: [{
                            y: relevance,
                            color: '#EEB111'
                        }, {
                            y: (100 - relevance),
                            color: '#FAE894'
                        }]
                }],
            credits: {
                enabled: false
            }
        };
    };
    AlternateRelatedComponent.prototype.getRelevance = function (relevancePercent) {
        if (relevancePercent <= 10) {
            return 10;
        }
        else if (relevancePercent <= 20) {
            return 20;
        }
        else if (relevancePercent <= 30) {
            return 30;
        }
        else if (relevancePercent <= 40) {
            return 40;
        }
        else if (relevancePercent <= 50) {
            return 50;
        }
        else if (relevancePercent <= 60) {
            return 60;
        }
        else if (relevancePercent <= 70) {
            return 70;
        }
        else if (relevancePercent <= 80) {
            return 80;
        }
        else if (relevancePercent <= 90) {
            return 90;
        }
        else {
            return 100;
        }
    };
    return AlternateRelatedComponent;
}());
__decorate([
    core_1.Input("parts-data"),
    __metadata("design:type", Object)
], AlternateRelatedComponent.prototype, "partsData", void 0);
__decorate([
    core_1.Input("is-related-flag"),
    __metadata("design:type", Boolean)
], AlternateRelatedComponent.prototype, "isRelatedFlag", void 0);
__decorate([
    core_1.Input("detail-part"),
    __metadata("design:type", Object)
], AlternateRelatedComponent.prototype, "detailPart", void 0);
AlternateRelatedComponent = __decorate([
    core_1.Component({
        selector: "alternate-related-parts",
        templateUrl: "./src/app/parts/details/alternate-related/alternate-related.component.html?v=" + new Date().getTime(),
        providers: [parts_service_1.PartsService, pager_service_1.PagerService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        parts_service_1.PartsService,
        platform_browser_1.Title,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        cart_service_1.CartService,
        notification_service_1.NotificationService,
        national_inventory_modal_service_1.NationalInventoryModalService,
        application_insights_service_1.ApplicationInsightsService])
], AlternateRelatedComponent);
exports.AlternateRelatedComponent = AlternateRelatedComponent;
//# sourceMappingURL=alternate-related.component.js.map