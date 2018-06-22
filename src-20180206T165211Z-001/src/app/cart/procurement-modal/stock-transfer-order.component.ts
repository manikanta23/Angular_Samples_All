//stock-transfer-order.component
import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { LoaderService } from "./../../_common/services/loader.service";
import { VendorsService } from "./../../search/modal/vendors/vendors.service";
import { CartService } from './../cart.service';
import { NationalInventory } from "./../../_entities/national-inventory.entity";
import { NationalInventoryModalService } from "./../../parts/details/national-inventory/national-inventory-modal.service";

import * as _ from "lodash";
declare var jQuery: any;

import { SourceLocationType, ApplicationInsightsService } from "./../../_common/services/application-insights.service";
import { AppInsightHotFlag } from "./../../_entities/app-insight-hot-flag.entity";
import { Facet, PartSearch } from "../../_entities/part-search.entity";
import { PartsService } from "../../parts/parts.service";
import { NationalInventoryService } from "../../parts/details/national-inventory/national-inventory.service";
import { AppInsightSTO } from "../../_entities/app-insight-sto.entity";
import { Cart } from "../../_entities/cart.entity";

@Component({
    selector: "stock-transfer",
    templateUrl: `./src/app/cart/procurement-modal/stock-transfer-order.component.html?v=${new Date().getTime()}`,
})

export class StockTransferOrderComponent implements OnInit {

    inventories: any;
    filteredInventories: any;
    partId: string;
    partNumber: string;
    sortBy: string = "";
    sortAsc: boolean = false;
    partWithSource: any = null;
    removeLineItem = false;

    selectedCartItems: Array<any> = new Array<any>();
    filteredCartItems: Array<any> = new Array<any>();
    filterKey: string = '';

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private commonDataService: CommonDataService,
        private vendorsService: VendorsService,
        private cartService: CartService,
        private nationalInventoryModalService: NationalInventoryModalService,
        private applicationInsightsService: ApplicationInsightsService,
        private nationalInventoryService: NationalInventoryService,
        private partsService: PartsService,
    ) {

    }
    ngOnInit() {

    }

    showModal(selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems
        this.filteredCartItems = this.selectedCartItems;
        this.getInventory();
        jQuery("#stockTransferModal").modal("show");
    }

    closeModal(): void {
        jQuery("#stockTransferModal").modal("hide");
    }


    getInventory(): void {
        this.filterKey = '';

        let branchCode = this.commonDataService.Branch.code;
        let customerNumber: string = this.commonDataService.Customer.customerNumber;
        let partInventory: Array<any> = new Array<any>();

        this.selectedCartItems.forEach((row: any) => {
            if (row.couponId == null) {
                let _item = {
                    partId: row.partId == null || row.partId == "" ? "" : row.partId,
                    partNumber: row.partNumber,
                };
                partInventory.push(_item);
            }
        });

        let requestData = {
            branchCode: branchCode,
            customerNumber: customerNumber,
            partInventories: partInventory
        };
        this.loader.loading = true;
        this.nationalInventoryService.getInventoryResponse(requestData)
            .then(getInventoryResult => {
                this.loader.loading = false;
                if (getInventoryResult.ErrorType != undefined && getInventoryResult.ErrorType != null && getInventoryResult.ErrorType != 200) {
                    //this.closeModal();
                    this.notification.errorMessage("StockTransferOrderComponent", "getInventory", "getInventory", getInventoryResult);
                }
                else {
                    this.selectedCartItems.forEach(item => {

                        var inventories = _.filter(<any[]>getInventoryResult, function (row) {
                            return row.partNumber == item.partNumber;
                        })[0];

                        if (inventories != undefined && inventories != null) {
                            item.inventories = inventories.inventory;
                            _.each(item.inventories, function (row) { row.partsQuantity = 1; });
                            if (item.inventories != undefined && item.inventories != null) {
                                item.filteredInventories = item.inventories;
                            } else {
                                item.filteredInventories = [];
                            }
                        }
                    });
                    console.log(this.selectedCartItems);
                }
                console.log("National Inventory data : ", getInventoryResult);
            },
            error => {
                this.loader.loading = false;
            });
    }


    filter = function () {
        if (this.filterKey !== '') {
            this.filteredCartItems = this.selectedCartItems.filter(function (e) {
                return ((e.partNumber && e.partNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.corePartNumber && e.corePartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;

            }.bind(this));
        }
        else {
            this.filteredCartItems = this.selectedCartItems;
        }
    }

    sortDataBy(cartItem, sortBy: string) {
        if (cartItem.sortBy == sortBy)
            cartItem.sortAsc = !cartItem.sortAsc;
        else
            cartItem.sortAsc = true;

        cartItem.sortBy = sortBy;

        cartItem.filteredInventories = this.commonDataService.sortData(cartItem.filteredInventories, cartItem.sortBy, cartItem.sortAsc);
    }

    addToCart(addToCartItem: any, cartItem: any) {
        let trackingParameters: any = "";

        var addtoCartParameters = Object.assign(new Cart(), {
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

        let sourceName = "NationalInventoryComponent_addToCart__STO";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightSTO = Object.assign(new AppInsightSTO(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            vendorNumber: addToCartItem.branchCode,
            vendorName: addToCartItem.branchName,
            source: SourceLocationType[SourceLocationType.Cart],
            plMetricName: sourceName
        });
        appInsightSTO.product = this.applicationInsightsService.getAppInsightParts(addtoCartParameters, JSON.stringify(appInsightSTO).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightSTO);

        this.vendorsService.getVendorPrice("", cartItem.corePartNumber, cartItem.corePrice > 0, cartItem.rushPartNumber)
            .then(vp => {
                if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                    this.notification.errorMessage("StockTransferOrderComponent", "addToCart", "getVendorPrice", vp);
                }
                else {
                    addtoCartParameters.PurchasePrice = vp.purchasePrice;
                    
                    this.removeLineItem = cartItem.isSplit ? cartItem.isSplit : (cartItem.quantityAvailable <= 0);
                    if (this.removeLineItem) {
                        let deleteCartItems: Array<any> = new Array<any>();
                        let _item = {
                            cartItemId: cartItem.cartItemId,
                        };
                        deleteCartItems.push(_item);
                        let partWithsourceData = {
                            cartId: cartItem.cartId,
                            isPickupDeliveryType: false,
                            deleteCartItems: deleteCartItems
                        }
                        this.cartService.DeleteCartItem(partWithsourceData)
                            .then(carts => {
                                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                                    this.notification.errorMessage("NationalInventoryComponent", "addToCart", "DeleteCartItem", carts);
                                }
                            },
                            error => { });
                    }


                    this.cartService.addToCart(addtoCartParameters)
                        .then(carts => {
                            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                                this.notification.errorMessage("StockTransferOrderComponent", "addToCart", "addToCart", carts);
                            }
                            else {
                                this.notification.showNotification(`${cartItem.partNumber} ${cartItem.description} with ${addToCartItem.partsQuantity} quantity added successfully.`, NotificationType.Success);
                            }
                            console.log("StockTransferOrderComponent  add to carts : ", carts);
                        },
                        error => { });
                }
            },
            error => { });
    }


    changeQuntity(e: any, inventory: any) {
        if (e.which == 38) {
            inventory.partsQuantity = +(inventory.partsQuantity) + 1;
        }
        else if (e.which == 40 && inventory.partsQuantity > 1) {
            inventory.partsQuantity = inventory.partsQuantity - 1;
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    onQuantityFocusout(inventory: any, e: any) {
        let quantity: any = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            inventory.partsQuantity = 1;
        }
    }


    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }

    removeCartItem(cartItem) {
        let selectedItems = this.selectedCartItems.filter(
            (item: any) => item.cartItemId === cartItem.cartItemId);

        var index = -1;
        if (selectedItems.length > 0)
            index = this.selectedCartItems.indexOf(selectedItems[0]);

        if (index != -1) {
            // Find and remove item from an array
            this.selectedCartItems.splice(index, 1);

            this.filteredCartItems = this.selectedCartItems;
            this.filter();
        }
    }


    onToggleAccordion(cartItem: any) {
        this.selectedCartItems.forEach(item => {
            if (item.cartItemId != cartItem.cartItemId)
                item.isOpened = false;
        });

        cartItem.isOpened = cartItem.isOpened ? false : true;
    }
}