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
//stock-transfer-order.component
var core_1 = require("@angular/core");
var notification_service_1 = require("./../../_common/services/notification.service");
var common_data_service_1 = require("./../../_common/services/common-data.service");
var loader_service_1 = require("./../../_common/services/loader.service");
var vendors_service_1 = require("./../../search/modal/vendors/vendors.service");
var cart_service_1 = require("./../cart.service");
var national_inventory_modal_service_1 = require("./../../parts/details/national-inventory/national-inventory-modal.service");
var _ = require("lodash");
var application_insights_service_1 = require("./../../_common/services/application-insights.service");
var parts_service_1 = require("../../parts/parts.service");
var national_inventory_service_1 = require("../../parts/details/national-inventory/national-inventory.service");
var app_insight_sto_entity_1 = require("../../_entities/app-insight-sto.entity");
var cart_entity_1 = require("../../_entities/cart.entity");
var StockTransferOrderComponent = (function () {
    function StockTransferOrderComponent(loader, notification, changeDetectorRef, elementRef, commonDataService, vendorsService, cartService, nationalInventoryModalService, applicationInsightsService, nationalInventoryService, partsService) {
        this.loader = loader;
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.commonDataService = commonDataService;
        this.vendorsService = vendorsService;
        this.cartService = cartService;
        this.nationalInventoryModalService = nationalInventoryModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.nationalInventoryService = nationalInventoryService;
        this.partsService = partsService;
        this.sortBy = "";
        this.sortAsc = false;
        this.partWithSource = null;
        this.removeLineItem = false;
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
    StockTransferOrderComponent.prototype.ngOnInit = function () {
    };
    StockTransferOrderComponent.prototype.showModal = function (selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems;
        this.filteredCartItems = this.selectedCartItems;
        this.getInventory();
        jQuery("#stockTransferModal").modal("show");
    };
    StockTransferOrderComponent.prototype.closeModal = function () {
        jQuery("#stockTransferModal").modal("hide");
    };
    StockTransferOrderComponent.prototype.getInventory = function () {
        var _this = this;
        this.filterKey = '';
        var branchCode = this.commonDataService.Branch.code;
        var customerNumber = this.commonDataService.Customer.customerNumber;
        var partInventory = new Array();
        this.selectedCartItems.forEach(function (row) {
            if (row.couponId == null) {
                var _item = {
                    partId: row.partId == null || row.partId == "" ? "" : row.partId,
                    partNumber: row.partNumber,
                };
                partInventory.push(_item);
            }
        });
        var requestData = {
            branchCode: branchCode,
            customerNumber: customerNumber,
            partInventories: partInventory
        };
        this.loader.loading = true;
        this.nationalInventoryService.getInventoryResponse(requestData)
            .then(function (getInventoryResult) {
            _this.loader.loading = false;
            if (getInventoryResult.ErrorType != undefined && getInventoryResult.ErrorType != null && getInventoryResult.ErrorType != 200) {
                //this.closeModal();
                _this.notification.errorMessage("StockTransferOrderComponent", "getInventory", "getInventory", getInventoryResult);
            }
            else {
                _this.selectedCartItems.forEach(function (item) {
                    var inventories = _.filter(getInventoryResult, function (row) {
                        return row.partNumber == item.partNumber;
                    })[0];
                    if (inventories != undefined && inventories != null) {
                        item.inventories = inventories.inventory;
                        _.each(item.inventories, function (row) { row.partsQuantity = 1; });
                        if (item.inventories != undefined && item.inventories != null) {
                            item.filteredInventories = item.inventories;
                        }
                        else {
                            item.filteredInventories = [];
                        }
                    }
                });
                console.log(_this.selectedCartItems);
            }
            console.log("National Inventory data : ", getInventoryResult);
        }, function (error) {
            _this.loader.loading = false;
        });
    };
    StockTransferOrderComponent.prototype.sortDataBy = function (cartItem, sortBy) {
        if (cartItem.sortBy == sortBy)
            cartItem.sortAsc = !cartItem.sortAsc;
        else
            cartItem.sortAsc = true;
        cartItem.sortBy = sortBy;
        cartItem.filteredInventories = this.commonDataService.sortData(cartItem.filteredInventories, cartItem.sortBy, cartItem.sortAsc);
    };
    StockTransferOrderComponent.prototype.addToCart = function (addToCartItem, cartItem) {
        var _this = this;
        var trackingParameters = "";
        var addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: cartItem.partNumber,
            description: cartItem.description,
            customerPrice: cartItem.customerPrice,
            quantity: addToCartItem.partsQuantity,
            coreOption: "NOCORER",
            corePrice: cartItem.corePrice,
            corePartNumber: cartItem.corePartNumber,
            partId: cartItem.partId,
            listPrice: cartItem.listPrice,
            adjustedPrice: cartItem.adjustedPrice,
            rebateField: cartItem.rebateField,
            isPriceVerified: cartItem.isPriceVerified,
            verifiedPrice: cartItem.verifiedPrice,
            priceOverrideReasonId: cartItem.priceOverrideReasonId,
            partNumOnly: cartItem.partNumOnly,
            vmrsCode: cartItem.vmrsCode,
            vmrsDescription: cartItem.vmrsDescription,
            manufacturer: cartItem.manufacturer,
            cateogory: cartItem.cateogory,
            binLocation: cartItem.binLocation,
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
            source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Cart],
            plMetricName: sourceName
        });
        appInsightSTO.product = this.applicationInsightsService.getAppInsightParts(addtoCartParameters, JSON.stringify(appInsightSTO).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightSTO);
        this.vendorsService.getVendorPrice("", cartItem.corePartNumber, cartItem.corePrice > 0, cartItem.rushPartNumber)
            .then(function (vp) {
            if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                _this.notification.errorMessage("StockTransferOrderComponent", "addToCart", "getVendorPrice", vp);
            }
            else {
                addtoCartParameters.PurchasePrice = vp.purchasePrice;
                _this.removeLineItem = cartItem.isSplit ? cartItem.isSplit : (cartItem.quantityAvailable <= 0);
                if (_this.removeLineItem) {
                    var deleteCartItems = new Array();
                    var _item = {
                        cartItemId: cartItem.cartItemId,
                    };
                    deleteCartItems.push(_item);
                    var partWithsourceData = {
                        cartId: cartItem.cartId,
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
                _this.cartService.addToCart(addtoCartParameters)
                    .then(function (carts) {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        _this.notification.errorMessage("StockTransferOrderComponent", "addToCart", "addToCart", carts);
                    }
                    else {
                        _this.notification.showNotification(cartItem.partNumber + " " + cartItem.description + " with " + addToCartItem.partsQuantity + " quantity added successfully.", notification_service_1.NotificationType.Success);
                    }
                    console.log("StockTransferOrderComponent  add to carts : ", carts);
                }, function (error) { });
            }
        }, function (error) { });
    };
    StockTransferOrderComponent.prototype.changeQuntity = function (e, inventory) {
        if (e.which == 38) {
            inventory.partsQuantity = +(inventory.partsQuantity) + 1;
        }
        else if (e.which == 40 && inventory.partsQuantity > 1) {
            inventory.partsQuantity = inventory.partsQuantity - 1;
        }
    };
    StockTransferOrderComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    StockTransferOrderComponent.prototype.onQuantityFocusout = function (inventory, e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            inventory.partsQuantity = 1;
        }
    };
    StockTransferOrderComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
    };
    StockTransferOrderComponent.prototype.removeCartItem = function (cartItem) {
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
    StockTransferOrderComponent.prototype.onToggleAccordion = function (cartItem) {
        this.selectedCartItems.forEach(function (item) {
            if (item.cartItemId != cartItem.cartItemId)
                item.isOpened = false;
        });
        cartItem.isOpened = cartItem.isOpened ? false : true;
    };
    return StockTransferOrderComponent;
}());
StockTransferOrderComponent = __decorate([
    core_1.Component({
        selector: "stock-transfer",
        templateUrl: "./src/app/cart/procurement-modal/stock-transfer-order.component.html?v=" + new Date().getTime(),
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        common_data_service_1.CommonDataService,
        vendors_service_1.VendorsService,
        cart_service_1.CartService,
        national_inventory_modal_service_1.NationalInventoryModalService,
        application_insights_service_1.ApplicationInsightsService,
        national_inventory_service_1.NationalInventoryService,
        parts_service_1.PartsService])
], StockTransferOrderComponent);
exports.StockTransferOrderComponent = StockTransferOrderComponent;
//# sourceMappingURL=stock-transfer-order.component.js.map