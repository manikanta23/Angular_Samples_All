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
var parts_service_1 = require("./parts.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var notification_service_1 = require("./../_common/services/notification.service");
var part_search_entity_1 = require("./../_entities/part-search.entity");
var common_data_service_1 = require("./../_common/services/common-data.service");
var app_insight_part_search_entity_1 = require("../_entities/app-insight-part-search.entity");
var application_insights_service_1 = require("../_common/services/application-insights.service");
var app_insight_billing_entity_1 = require("../_entities/app-insight-billing.entity");
var PartsComponent = (function () {
    function PartsComponent(activatedRoute, partsService, title, commonDataService, notification, changeDetectorRef, applicationInsightsService) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.partsService = partsService;
        this.title = title;
        this.commonDataService = commonDataService;
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.applicationInsightsService = applicationInsightsService;
        this.partsData = null;
        this.refineSearchData = null;
        this.searchData = new part_search_entity_1.PartSearch();
        this.subscription = null;
        this.partSearchTerm = "";
        this.partId = "";
        this.isRefineSearchSource = false;
        this.isCustomerChanged = false;
        this.customerDataOnCustomerChange = null;
        this.customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe(function (d) {
            _this.isCustomerChanged = true;
            _this.customerDataOnCustomerChange = d;
        });
        this.isBranchChanged = false;
        this.branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe(function (d) {
            _this.isBranchChanged = true;
            _this.branchDataUpdated = d;
        });
        title.setTitle("Parts - Parts Link");
        //this.notification.hideNotification();
    }
    PartsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.activatedRoute
            .queryParams
            .subscribe(function (params) {
            _this.refineSearchData = null;
            _this.partId = "";
            _this.partSearchTerm = "";
            var searchTerm = params['searchTerm'];
            var partId = params['partId'];
            _this.partSearchTerm = searchTerm;
            if (partId != undefined && partId != null && partId != "") {
                _this.partId = partId;
            }
            _this.getPartOnChange();
            console.log("Parts component search term : ", searchTerm);
        });
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            _this.partSearchTerm = _this.activatedRoute.snapshot.queryParams['searchTerm'];
            _this.getPartOnChange();
        });
    };
    PartsComponent.prototype.getPartOnChange = function () {
        this.searchData.partId = "";
        this.searchData = Object.assign(new part_search_entity_1.PartSearch(), {
            partId: this.partId,
            partSearchTerm: this.partSearchTerm,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: true,
            isCountCheck: false,
            pageNumber: 1,
            pageSize: 100,
            includeFacets: true,
            userId: this.commonDataService.UserId,
            Facet: Object.assign(new part_search_entity_1.Facet(), {})
        });
        this.getParts();
    };
    PartsComponent.prototype.getParts = function () {
        var _this = this;
        this.partsData = null;
        //this.changeDetectorRef.detectChanges();
        this.partsService.getParts(this.searchData)
            .then(function (parts) {
            if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                _this.notification.errorMessage("PartsComponent", "getParts", "getParts", parts);
            }
            else {
                var source = _this.isRefineSearchSource ? application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartListRefineSearch] : application_insights_service_1.SourceLocationType[_this.activatedRoute.snapshot.queryParams['src']];
                var sourceName = "PartsComponent_getParts_getParts";
                var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                var appInsightPartSearch = Object.assign(new app_insight_part_search_entity_1.AppInsightPartSearch(), {
                    userId: _this.commonDataService.UserId,
                    searchTerm: _this.partSearchTerm,
                    customerNumber: _this.commonDataService.Customer.customerNumber,
                    branchNumber: _this.commonDataService.Branch.code,
                    cartNumber: _this.commonDataService.CartId,
                    source: source,
                    plMetricName: sourceName
                });
                appInsightPartSearch.results = _this.applicationInsightsService.getAppInsightParts(parts.parts, JSON.stringify(appInsightPartSearch).length);
                _this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);
                if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                    parts.parts.forEach(function (t) {
                        t.hasCoupon = _this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                    });
                }
                _this.partsData = parts;
                _this.isBranchChanged = true;
                if (_this.partsData == undefined || _this.partsData == null || _this.partsData.parts.length <= 0) {
                    _this.notification.showNotification("Part not found.", notification_service_1.NotificationType.Error);
                    var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                        userId: _this.commonDataService.UserId,
                        searchTerm: _this.partSearchTerm,
                        customerNumber: _this.commonDataService.Customer.customerNumber,
                        customerName: _this.commonDataService.Customer.customerName,
                        cartNumber: _this.commonDataService.CartId,
                        PONumber: (_this.commonDataService.PONumberValue == null || _this.commonDataService.PONumberValue == undefined) ? "" : _this.commonDataService.PONumberValue,
                        source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartsResult],
                        unitNumber: (_this.commonDataService.UnitNumberValue == null || _this.commonDataService.UnitNumberValue == undefined) ? "" : _this.commonDataService.UnitNumberValue
                    });
                    if (_this.branchDataUpdated != undefined && _this.branchDataUpdated != null) {
                        if (_this.branchDataUpdated.previousBranch != undefined && _this.branchDataUpdated.previousBranch != null) {
                            appInsightBilling.previousBranch = _this.branchDataUpdated.previousBranch.code;
                        }
                        if (_this.branchDataUpdated.newBranch != undefined && _this.branchDataUpdated.newBranch != null) {
                            appInsightBilling.currentBranch = _this.branchDataUpdated.newBranch.code;
                        }
                    }
                    appInsightBilling.products = "";
                    _this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                    _this.isBranchChanged = false;
                }
            }
            console.log("Parts component parts data : ", parts);
            _this.isRefineSearchSource = false;
            //this.changeDetectorRef.detectChanges();
        }, function (error) { });
    };
    PartsComponent.prototype.onRefineSearchCheck = function (inputData) {
        this.isRefineSearchSource = true;
        var searchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
        console.log("Parts component refine search check parameter : ", inputData);
        this.refineSearchData = inputData;
        this.searchData = Object.assign(new part_search_entity_1.PartSearch(), {
            partSearchTerm: searchTerm,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: true,
            isCountCheck: false,
            pageNumber: 1,
            pageSize: 100,
            includeFacets: true,
            Facet: inputData,
            userId: this.commonDataService.UserId
        });
        this.getParts();
    };
    PartsComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
    };
    return PartsComponent;
}());
PartsComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/parts/parts.component.html?v=" + new Date().getTime(),
        providers: [parts_service_1.PartsService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        parts_service_1.PartsService,
        platform_browser_1.Title,
        common_data_service_1.CommonDataService,
        notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        application_insights_service_1.ApplicationInsightsService])
], PartsComponent);
exports.PartsComponent = PartsComponent;
//# sourceMappingURL=parts.component.js.map