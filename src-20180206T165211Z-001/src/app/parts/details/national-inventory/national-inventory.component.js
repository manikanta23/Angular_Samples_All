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
var notification_service_1 = require("./../../../_common/services/notification.service");
var national_inventory_service_1 = require("./national-inventory.service");
var national_inventory_modal_service_1 = require("./national-inventory-modal.service");
var cart_entity_1 = require("./../../../_entities/cart.entity");
var cart_service_1 = require("./../../../cart/cart.service");
var _ = require("lodash");
var vendors_service_1 = require("./../../../search/modal/vendors/vendors.service");
var parts_service_1 = require("./../../parts.service");
var part_search_entity_1 = require("./../../../_entities/part-search.entity");
var app_insight_sto_entity_1 = require("../../../_entities/app-insight-sto.entity");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var NationalInventoryComponent = (function () {
    function NationalInventoryComponent(notification, commonDataService, nationalInventoryService, nationalInventoryModalService, changeDetectorRef, cartService, vendorsService, partsService, applicationInsightsService) {
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.nationalInventoryService = nationalInventoryService;
        this.nationalInventoryModalService = nationalInventoryModalService;
        this.changeDetectorRef = changeDetectorRef;
        this.cartService = cartService;
        this.vendorsService = vendorsService;
        this.partsService = partsService;
        this.applicationInsightsService = applicationInsightsService;
        this.filterKey = "";
        this.partsData = null;
        this.tempPartsData = null;
        this.sortBy = "";
        this.sortAsc = false;
        this.partType = "";
        this.partWithSource = null;
        this.removeLineItem = false;
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredInventories = this.inventories.filter(function (e) {
                    return ((e.branchCode && ("" + e.branchCode).indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.branchName && e.branchName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.milesFromSource && ("" + e.milesFromSource).indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.quantity && ("" + e.quantity).indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
            }
            else {
                this.filteredInventories = this.inventories;
            }
        };
        //this.notification.hideNotification();
    }
    NationalInventoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.nationalInventoryModalService.notifyShowNationalInventoryModalObservable.subscribe(function (res) {
            _this.filterKey = '';
            _this.partWithSource = null;
            _this.inventories = null;
            if (res.hasOwnProperty('partId') && res.partId != null && ((res.hasOwnProperty('rushPartNumber') && res.rushPartNumber != null) || (res.hasOwnProperty('partNumber') && res.partNumber != null))) {
                _this.partsData = res;
                _this.tempPartsData = res;
                if (res.source != undefined && res.source != null && res.source == application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Cart]) {
                    _this.partWithSource = res;
                }
                _this.partId = res.partId;
                _this.partNumber = res.rushPartNumber != undefined && res.rushPartNumber != null ? res.rushPartNumber : res.partNumber;
                _this.getParts();
                _this.partType = "";
                if (res.type != undefined && res.type != null) {
                    _this.partType = res.type;
                }
                _this.showModal();
                console.log("National Inventory subscription data : ", res);
            }
        });
    };
    NationalInventoryComponent.prototype.showModal = function () {
        jQuery("#nationalInventoryModal").modal("show");
    };
    NationalInventoryComponent.prototype.closeModal = function () {
        jQuery("#nationalInventoryModal").modal("hide");
    };
    NationalInventoryComponent.prototype.getInventory = function () {
        var _this = this;
        this.filterKey = '';
        var branchCode = this.commonDataService.Branch.code;
        var customerNumber = this.commonDataService.Customer.customerNumber;
        this.nationalInventoryService.getInventory(this.partId, this.partNumber, branchCode, customerNumber)
            .then(function (getInventoryResult) {
            if (getInventoryResult.ErrorType != undefined && getInventoryResult.ErrorType != null && getInventoryResult.ErrorType != 200) {
                _this.closeModal();
                _this.notification.errorMessage("NationalInventoryComponent", "getInventory", "getInventory", getInventoryResult);
            }
            else {
                if (getInventoryResult != null && getInventoryResult.length > 0) {
                    _this.inventories = _.each(getInventoryResult[0].inventory, function (item) { item.partsQuantity = 1; });
                    if (_this.inventories != undefined && _this.inventories != null) {
                        _this.filteredInventories = _this.inventories;
                    }
                    else {
                        _this.filteredInventories = [];
                    }
                }
            }
            //this.changeDetectorRef.detectChanges();
            console.log("National Inventory data : ", getInventoryResult);
        }, function (error) { _this.closeModal(); });
    };
    NationalInventoryComponent.prototype.sortDataBy = function (sortBy) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;
        this.sortBy = sortBy;
        this.filteredInventories = this.commonDataService.sortData(this.filteredInventories, this.sortBy, this.sortAsc);
    };
    NationalInventoryComponent.prototype.addToCart = function (addToCartItem) {
        var _this = this;
        var trackingParameters = "";
        if (this.partType === "related") {
            trackingParameters = JSON.stringify({
                "AddedFrom": "RelatedPart",
                "PartId": this.partsData.partId,
                "GroupRelatedPartId": this.partsData.groupRelatedpartId,
                "BranchCode": this.commonDataService.Branch.code,
                "MaterialId": this.partsData.rushPartNumber
            });
        }
        else if (this.partType === "alternate") {
            trackingParameters = JSON.stringify({
                "AddedFrom": "AlternatePart",
                "PartId": this.partsData.partId,
                "GroupPartId": this.partsData.groupId,
                "BranchCode": this.commonDataService.Branch.code
            });
        }
        var addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: this.partsData.rushPartNumber,
            description: this.partsData.description,
            customerPrice: this.partsData.customerPrice,
            quantity: addToCartItem.partsQuantity,
            coreOption: "NOCORER",
            corePrice: this.partsData.corePrice,
            corePartNumber: this.partsData.corePartNumber,
            partId: this.partsData.partId,
            listPrice: this.partsData.listPrice,
            adjustedPrice: this.tempPartsData.adjustedPrice,
            rebateField: this.tempPartsData.rebateField,
            isPriceVerified: this.tempPartsData.isPriceVerified,
            verifiedPrice: this.tempPartsData.verifiedPrice,
            priceOverrideReasonId: this.partsData.priceOverrideReasonId,
            PartNumOnly: this.partsData.partNumberOnly,
            vmrsCode: this.partsData.vmrsCode,
            vmrsDescription: this.partsData.vmrsDescription,
            manufacturer: this.partsData.manufacturer,
            cateogory: this.partsData.cateogory,
            binLocation: this.partsData.binLocation,
            deliveryType: "",
            VendorCode: addToCartItem.branchCode,
            VendorBranchCode: addToCartItem.branchCode,
            VendorName: addToCartItem.branchName,
            TrackingParameters: trackingParameters,
            IsSTO: true,
            QuantityAvailable: addToCartItem.quantity
        });
        var sourceName = "NationalInventoryComponent_addToCart__STO";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightSTO = Object.assign(new app_insight_sto_entity_1.AppInsightSTO(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            vendorNumber: addToCartItem.branchCode,
            vendorName: addToCartItem.branchName,
            source: this.tempPartsData.source,
            plMetricName: sourceName
        });
        appInsightSTO.product = this.applicationInsightsService.getAppInsightParts(addtoCartParameters, JSON.stringify(appInsightSTO).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightSTO);
        this.vendorsService.getVendorPrice("", this.partsData.corePartNumber, this.partsData.corePrice > 0, this.partsData.rushPartNumber)
            .then(function (vp) {
            if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                _this.notification.errorMessage("NationalInventoryComponent", "addToCart", "getVendorPrice", vp);
            }
            else {
                addtoCartParameters.PurchasePrice = vp.purchasePrice;
                if (_this.partWithSource != undefined && _this.partWithSource != null && _this.partWithSource.source == application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Cart]) {
                    _this.removeLineItem = _this.partWithSource.isSplit ? _this.partWithSource.isSplit : _this.removeLineItem;
                    if (_this.removeLineItem) {
                        var deleteCartItems = new Array();
                        var _item = {
                            cartItemId: _this.partWithSource.cartItemId,
                        };
                        deleteCartItems.push(_item);
                        var partWithsourceData = {
                            cartId: _this.partWithSource.cartId,
                            isPickupDeliveryType: false,
                            deleteCartItems: deleteCartItems
                        };
                        _this.cartService.DeleteCartItem(partWithsourceData)
                            .then(function (carts) {
                            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                                _this.notification.errorMessage("NationalInventoryComponent", "addToCart", "DeleteCartItem", carts);
                            }
                        }, function (error) { });
                    }
                }
                _this.cartService.addToCart(addtoCartParameters)
                    .then(function (carts) {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        _this.notification.errorMessage("NationalInventoryComponent", "addToCart", "addToCart", carts);
                    }
                    else {
                        _this.notification.showNotification(_this.partsData.rushPartNumber + " " + _this.partsData.description + " with " + addToCartItem.partsQuantity + " quantity added successfully.", notification_service_1.NotificationType.Success);
                    }
                    console.log("Details component add to carts : ", carts);
                }, function (error) { });
            }
        }, function (error) { });
    };
    NationalInventoryComponent.prototype.changeQuntity = function (e, inventory) {
        if (e.which == 38) {
            inventory.partsQuantity = +(inventory.partsQuantity) + 1;
        }
        else if (e.which == 40 && inventory.partsQuantity > 1) {
            inventory.partsQuantity = inventory.partsQuantity - 1;
        }
    };
    NationalInventoryComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    NationalInventoryComponent.prototype.onQuantityFocusout = function (inventory, e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            inventory.partsQuantity = 1;
        }
    };
    NationalInventoryComponent.prototype.getParts = function () {
        var _this = this;
        this.partsData = null;
        var searchData = Object.assign(new part_search_entity_1.PartSearch(), {
            partId: this.partId,
            partSearchTerm: this.partNumber,
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
        //this.changeDetectorRef.detectChanges();
        this.partsService.getParts(searchData)
            .then(function (parts) {
            if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                _this.notification.errorMessage("NationalInventoryComponent", "getParts", "getParts", parts);
            }
            else {
                if (parts == undefined || parts == null || parts.parts.length <= 0) {
                    _this.notification.showNotification("Part not found.", notification_service_1.NotificationType.Error);
                }
                else {
                    _this.partsData = parts.parts[0];
                    _this.removeLineItem = (_this.partsData.quantityAvailable <= 0);
                    _this.getInventory();
                }
            }
            console.log("National Inventory component parts data : ", parts);
            //this.changeDetectorRef.detectChanges();
        }, function (error) { });
    };
    NationalInventoryComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
    };
    return NationalInventoryComponent;
}());
NationalInventoryComponent = __decorate([
    core_1.Component({
        selector: "inventory-modal",
        templateUrl: "./src/app/parts/details/national-inventory/national-inventory.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        national_inventory_service_1.NationalInventoryService,
        national_inventory_modal_service_1.NationalInventoryModalService,
        core_1.ChangeDetectorRef,
        cart_service_1.CartService,
        vendors_service_1.VendorsService,
        parts_service_1.PartsService,
        application_insights_service_1.ApplicationInsightsService])
], NationalInventoryComponent);
exports.NationalInventoryComponent = NationalInventoryComponent;
//# sourceMappingURL=national-inventory.component.js.map