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
var common_data_service_1 = require("./../../_common/services/common-data.service");
var ts_clipboard_1 = require("ts-clipboard");
var notification_service_1 = require("./../../_common/services/notification.service");
var part_search_entity_1 = require("./../../_entities/part-search.entity");
var national_inventory_modal_service_1 = require("./../../parts/details/national-inventory/national-inventory-modal.service");
var application_insights_service_1 = require("../../_common/services/application-insights.service");
var app_insight_customer_change_entity_1 = require("../../_entities/app-insight-customer-change.entity");
var app_insight_billing_entity_1 = require("../../_entities/app-insight-billing.entity");
var PartsListComponent = (function () {
    function PartsListComponent(notification, commonDataService, nationalInventoryModalService, applicationInsightsService) {
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.nationalInventoryModalService = nationalInventoryModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.partsData = null;
        this.searchTerm = null;
        this.sortBy = "";
        this.sortAsc = false;
        this.partsSortDirection = "Price High to Low";
        this.sourceLocationType = application_insights_service_1.SourceLocationType;
        this.callBackRefineSearch = new core_1.EventEmitter();
        this.isCustomerChangedValue = false;
        this.isCustomerChangedChange = new core_1.EventEmitter();
        this.customerDataOnCustomerChange = null;
        this.isBranchChangedValue = false;
        this.isBranchChangedChange = new core_1.EventEmitter();
        this.selectedFacetArray = new Array();
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
    }
    Object.defineProperty(PartsListComponent.prototype, "isCustomerChanged", {
        get: function () {
            return this.isCustomerChangedValue;
        },
        set: function (val) {
            this.isCustomerChangedValue = val;
            this.isCustomerChangedChange.emit(this.isCustomerChangedValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartsListComponent.prototype, "isBranchChanged", {
        get: function () {
            return this.isBranchChangedValue;
        },
        set: function (val) {
            this.isBranchChangedValue = val;
            this.isBranchChangedChange.emit(this.isBranchChangedValue);
        },
        enumerable: true,
        configurable: true
    });
    PartsListComponent.prototype.ngOnInit = function () {
        if (this.isBranchChanged) {
            var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                customerNumber: this.commonDataService.Customer.customerNumber,
                customerName: this.commonDataService.Customer.customerName,
                cartNumber: this.commonDataService.CartId,
                PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartListResult],
                unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
            });
            if (this.branchDataUpdated != undefined && this.branchDataUpdated != null) {
                if (this.branchDataUpdated.previousBranch != undefined && this.branchDataUpdated.previousBranch != null) {
                    appInsightBilling.previousBranch = this.branchDataUpdated.previousBranch.code;
                }
                if (this.branchDataUpdated.newBranch != undefined && this.branchDataUpdated.newBranch != null) {
                    appInsightBilling.currentBranch = this.branchDataUpdated.newBranch.code;
                }
            }
            appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.partsData.parts, JSON.stringify(appInsightBilling).length);
            this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
            this.isBranchChanged = false;
        }
        if (this.isCustomerChanged) {
            var appInsightCustomerChange = Object.assign(new app_insight_customer_change_entity_1.AppInsightCustomerChange(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                branchNumber: this.commonDataService.Branch.code,
                cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartListResult]
            });
            if (this.customerDataOnCustomerChange != undefined && this.customerDataOnCustomerChange != null) {
                if (this.customerDataOnCustomerChange.previousCustomer != undefined && this.customerDataOnCustomerChange.previousCustomer != null) {
                    appInsightCustomerChange.previousCustomerNumber = this.customerDataOnCustomerChange.previousCustomer.customerNumber;
                    appInsightCustomerChange.previousCustomerName = this.customerDataOnCustomerChange.previousCustomer.customerName;
                }
                if (this.customerDataOnCustomerChange.newCustomer != undefined && this.customerDataOnCustomerChange.newCustomer != null) {
                    appInsightCustomerChange.currentCustomerNumber = this.customerDataOnCustomerChange.newCustomer.customerNumber;
                    appInsightCustomerChange.currentCustomerName = this.customerDataOnCustomerChange.newCustomer.customerName;
                }
            }
            appInsightCustomerChange.products = this.applicationInsightsService.getAppInsightParts(this.partsData.parts, JSON.stringify(appInsightCustomerChange).length);
            this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
            this.isCustomerChanged = false;
            this.customerDataOnCustomerChange = null;
        }
    };
    Object.defineProperty(PartsListComponent.prototype, "refineSearch", {
        set: function (refineSearch) {
            if (refineSearch != null && refineSearch.length > 0) {
                var _loop_1 = function (refine) {
                    var facetItems = this_1.selectedFacetArray.filter(function (item) { return item.facetText === refine.facetText && item.facetType === refine.facetType; });
                    if (facetItems.length == 0) {
                        index = this_1.selectedFacetArray.indexOf(facetItems[0]);
                        if (index === -1) {
                            var facet = new part_search_entity_1.Facet();
                            facet.facetText = refine.facetText;
                            facet.facetType = refine.facetType;
                            this_1.selectedFacetArray.push(facet);
                        }
                    }
                    if (refine.facetType == 'Manufacturer') {
                        var manufacturers = this_1.partsData.facets.manufacturer.buckets.filter(function (item) { return item.val === refine.facetText; });
                        if (manufacturers.length > 0) {
                            i = this_1.partsData.facets.manufacturer.buckets.indexOf(manufacturers[0]);
                            this_1.partsData.facets.manufacturer.buckets[i].selected = i != -1;
                        }
                    }
                    else if (refine.facetType == 'Category') {
                        var categories = this_1.partsData.facets.category.buckets.filter(function (item) { return item.val === refine.facetText; });
                        if (categories.length > 0) {
                            j = this_1.partsData.facets.category.buckets.indexOf(categories[0]);
                            this_1.partsData.facets.category.buckets[j].selected = j != -1;
                        }
                    }
                };
                var this_1 = this, index, i, j;
                for (var _i = 0, refineSearch_1 = refineSearch; _i < refineSearch_1.length; _i++) {
                    var refine = refineSearch_1[_i];
                    _loop_1(refine);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    PartsListComponent.prototype.onFacetChange = function (selectedFacet, selectedFacetType, isChecked, arr) {
        var facetItems = this.selectedFacetArray.filter(function (item) { return item.facetText === selectedFacet && item.facetType === selectedFacetType; });
        var index = -1;
        if (facetItems.length > 0)
            index = this.selectedFacetArray.indexOf(facetItems[0]);
        if (isChecked == true && index === -1) {
            this.selectedFacetArray = new Array(); //ToDo: New Array created to keep one facet item selected at a time. When multiple Facet item selection required just remove this line.
            var facet = new part_search_entity_1.Facet();
            facet.facetText = selectedFacet;
            facet.facetType = selectedFacetType;
            this.selectedFacetArray.push(facet);
        }
        else if (isChecked == false && index != -1) {
            // Find and remove item from an array
            this.selectedFacetArray.splice(index, 1);
        }
        this.callBackRefineSearch.emit(this.selectedFacetArray);
    };
    PartsListComponent.prototype.copyToClipBoard = function (contentToCopy) {
        ts_clipboard_1.Clipboard.copy(contentToCopy);
        this.notification.showNotification(contentToCopy + " copied to clipboard.", notification_service_1.NotificationType.Success);
    };
    PartsListComponent.prototype.openNationalInventory = function (part) {
        part.source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartListResult];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
    };
    PartsListComponent.prototype.sortDataBy = function (sortBy, sortAsc) {
        this.sortAsc = sortAsc;
        if (this.sortAsc)
            this.partsSortDirection = "Price Low to High";
        else
            this.partsSortDirection = "Price High to Low";
        this.sortBy = sortBy;
        this.partsData.parts = this.commonDataService.sortData(this.partsData.parts, this.sortBy, this.sortAsc);
    };
    return PartsListComponent;
}());
__decorate([
    core_1.Input("parts"),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "partsData", void 0);
__decorate([
    core_1.Input("partSearchTerm"),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "searchTerm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], PartsListComponent.prototype, "callBackRefineSearch", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "isCustomerChangedChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PartsListComponent.prototype, "isCustomerChanged", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "customerDataOnCustomerChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "isBranchChangedChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PartsListComponent.prototype, "isBranchChanged", null);
__decorate([
    core_1.Input("branchDataUpdated"),
    __metadata("design:type", Object)
], PartsListComponent.prototype, "branchDataUpdated", void 0);
__decorate([
    core_1.Input("refineSearch"),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PartsListComponent.prototype, "refineSearch", null);
PartsListComponent = __decorate([
    core_1.Component({
        selector: "parts-list",
        templateUrl: "./src/app/parts/list/list.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        national_inventory_modal_service_1.NationalInventoryModalService,
        application_insights_service_1.ApplicationInsightsService])
], PartsListComponent);
exports.PartsListComponent = PartsListComponent;
//# sourceMappingURL=list.component.js.map