import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from "@angular/core";
declare var jQuery: any;

import { CommonDataService } from "./../../../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { NationalInventoryService } from "./national-inventory.service";
import { NationalInventory } from "./../../../_entities/national-inventory.entity";
import { NationalInventoryModalService } from "./national-inventory-modal.service";
import { CartSearch, Cart } from "./../../../_entities/cart.entity";
import { CartService } from "./../../../cart/cart.service";
import * as _ from "lodash";

import { VendorsService } from "./../../../search/modal/vendors/vendors.service";

import { PartsService } from "./../../parts.service";
import { PartSearch, Facet } from "./../../../_entities/part-search.entity";
import { AppInsightSTO } from "../../../_entities/app-insight-sto.entity";
import { ApplicationInsightsService, SourceLocationType } from "../../../_common/services/application-insights.service";

@Component({
    selector: "inventory-modal",
    templateUrl: `./src/app/parts/details/national-inventory/national-inventory.component.html?v=${new Date().getTime()}`
})

export class NationalInventoryComponent implements OnInit, OnDestroy {
    inventories: any;
    filteredInventories: any;
    filterKey: string = "";
    partsData: any = null;
    tempPartsData: any = null;
    partId: string;
    partNumber: string;
    subscription: any;
    sortBy: string = "";
    sortAsc: boolean = false;
    partType: string = "";
    partWithSource: any = null;
    removeLineItem = false;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private nationalInventoryService: NationalInventoryService,
        private nationalInventoryModalService: NationalInventoryModalService,
        private changeDetectorRef: ChangeDetectorRef,
        private cartService: CartService,
        private vendorsService: VendorsService,
        private partsService: PartsService,
        private applicationInsightsService: ApplicationInsightsService
    ) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.subscription = this.nationalInventoryModalService.notifyShowNationalInventoryModalObservable.subscribe((res) => {
            this.filterKey = '';
            this.partWithSource = null;
            this.inventories = null;
            if (res.hasOwnProperty('partId') && res.partId != null && ((res.hasOwnProperty('rushPartNumber') && res.rushPartNumber != null) || (res.hasOwnProperty('partNumber') && res.partNumber != null))) {
                this.partsData = res;
                this.tempPartsData = res;
                if (res.source != undefined && res.source != null && res.source == SourceLocationType[SourceLocationType.Cart]) {
                    this.partWithSource = res;
                }
                this.partId = res.partId;
                this.partNumber = res.rushPartNumber != undefined && res.rushPartNumber != null ? res.rushPartNumber : res.partNumber;
                this.getParts();
                this.partType = "";
                if (res.type != undefined && res.type != null) {
                    this.partType = res.type;
                }
                this.showModal();
                console.log("National Inventory subscription data : ", res);
            }
        });
    }

    showModal(): void {
        jQuery("#nationalInventoryModal").modal("show");
    }

    closeModal(): void {
        jQuery("#nationalInventoryModal").modal("hide");
    }

    getInventory(): void {
        this.filterKey = '';
        let branchCode: string = this.commonDataService.Branch.code;
        let customerNumber: string = this.commonDataService.Customer.customerNumber;
        this.nationalInventoryService.getInventory(this.partId, this.partNumber, branchCode, customerNumber)
            .then(getInventoryResult => {
                if (getInventoryResult.ErrorType != undefined && getInventoryResult.ErrorType != null && getInventoryResult.ErrorType != 200) {
                    this.closeModal();
                    this.notification.errorMessage("NationalInventoryComponent", "getInventory", "getInventory", getInventoryResult);
                }
                else {
                    if (getInventoryResult != null && getInventoryResult.length > 0) {
                        this.inventories = _.each(getInventoryResult[0].inventory, function (item) { item.partsQuantity = 1; });
                        if (this.inventories != undefined && this.inventories != null) {
                            this.filteredInventories = this.inventories;
                        } else {
                            this.filteredInventories = [];
                        }
                    }
                }
                //this.changeDetectorRef.detectChanges();
                console.log("National Inventory data : ", getInventoryResult);
            },
            error => { this.closeModal(); });
    }

    filter = function () {
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
    }

    sortDataBy(sortBy: string) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;

        this.sortBy = sortBy;

        this.filteredInventories = this.commonDataService.sortData(this.filteredInventories, this.sortBy, this.sortAsc);
    }

    addToCart(addToCartItem: any) {
        let trackingParameters: any = "";
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

        var addtoCartParameters = Object.assign(new Cart(), {
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
            adjustedPrice: this.tempPartsData.adjustedPrice,//this.partsData.adjustedPrice,
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
            source: this.tempPartsData.source,
            plMetricName: sourceName
        });
        appInsightSTO.product = this.applicationInsightsService.getAppInsightParts(addtoCartParameters, JSON.stringify(appInsightSTO).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightSTO);

        this.vendorsService.getVendorPrice("", this.partsData.corePartNumber, this.partsData.corePrice > 0, this.partsData.rushPartNumber)
            .then(vp => {
                if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                    this.notification.errorMessage("NationalInventoryComponent", "addToCart", "getVendorPrice", vp);
                }
                else {
                    addtoCartParameters.PurchasePrice = vp.purchasePrice;

                    if (this.partWithSource != undefined && this.partWithSource != null && this.partWithSource.source == SourceLocationType[SourceLocationType.Cart]) {
                        this.removeLineItem = this.partWithSource.isSplit ? this.partWithSource.isSplit : this.removeLineItem;
                        if (this.removeLineItem) {

                            let deleteCartItems: Array<any> = new Array<any>();
                            let _item = {
                                cartItemId: this.partWithSource.cartItemId,
                            };
                            deleteCartItems.push(_item);
                            let partWithsourceData = {
                                cartId: this.partWithSource.cartId,
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
                    }

                    this.cartService.addToCart(addtoCartParameters)
                        .then(carts => {
                            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                                this.notification.errorMessage("NationalInventoryComponent", "addToCart", "addToCart", carts);
                            }
                            else {
                                this.notification.showNotification(`${this.partsData.rushPartNumber} ${this.partsData.description} with ${addToCartItem.partsQuantity} quantity added successfully.`, NotificationType.Success);
                            }
                            console.log("Details component add to carts : ", carts);
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
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
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

    getParts(): void {
        this.partsData = null;

        let searchData = Object.assign(new PartSearch(), {
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
            Facet: Object.assign(new Facet(), {})
        });
        //this.changeDetectorRef.detectChanges();
        this.partsService.getParts(searchData)
            .then(parts => {
                if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                    this.notification.errorMessage("NationalInventoryComponent", "getParts", "getParts", parts);
                }
                else {
                    if (parts == undefined || parts == null || parts.parts.length <= 0) {
                        this.notification.showNotification("Part not found.", NotificationType.Error);
                    }
                    else {
                        this.partsData = parts.parts[0];
                        this.removeLineItem = (this.partsData.quantityAvailable <= 0);
                        this.getInventory();
                    }
                }
                console.log("National Inventory component parts data : ", parts);
                //this.changeDetectorRef.detectChanges();
            },
            error => { });
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
    }
}
