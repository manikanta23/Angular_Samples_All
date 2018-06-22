//hot-flag.component
import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { LoaderService } from "./../../_common/services/loader.service";
import { VendorsService } from "./../../search/modal/vendors/vendors.service";
import { CartService } from './../cart.service';

import * as _ from "lodash";
declare var jQuery: any;

import { SourceLocationType, ApplicationInsightsService } from "./../../_common/services/application-insights.service";
import { AppInsightPartBuyout } from "./../../_entities/app-insight-part-buyout.entity";

@Component({
    selector: "known-part-buyout",
    templateUrl: `./src/app/cart/procurement-modal/known-part-buyout.component.html?v=${new Date().getTime()}`,
})

export class KnownPartBuyoutComponent implements OnInit {

    selectedCartItems: Array<any> = new Array<any>();
    filteredCartItems: Array<any> = new Array<any>();
    filterKey: string = '';
    partItemTobeChanged: any = null;
    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private commonDataService: CommonDataService,
        private vendorsService: VendorsService,
        private cartService: CartService,
        private applicationInsightsService: ApplicationInsightsService
    ) {

    }
    ngOnInit() {

    }

    showModal(selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems
        this.filteredCartItems = this.selectedCartItems;
        this.partItemTobeChanged = null;
        this.initBuyout();
        jQuery("#knownPartBuyoutModal").modal("show");
    }

    closeModal(): void {
        jQuery("#knownPartBuyoutModal").modal("hide");
    }

    
    vendorSubscription = this.vendorsService.notifyVendorSelectEventEmitter.subscribe((res) => {
        if (res.hasOwnProperty('data') && res.data != null) {
            if (this.partItemTobeChanged.defaultVendorCode.replace(/^0+/, '') == res.data.number.replace(/^0+/, '')) {
                this.partItemTobeChanged.isDefaultVendorSelected = true;
            }
            else {
                this.partItemTobeChanged.isDefaultVendorSelected = false;
            }
            this.partItemTobeChanged.isKnownPartVendorSelected = true;
            this.partItemTobeChanged.knownPartVendor = res.data;

            if (this.partItemTobeChanged) {
                this.partItemTobeChanged.vendorCode = this.partItemTobeChanged.knownPartVendor.number;
                this.vendorsService.getVendorPrice(this.partItemTobeChanged.knownPartVendor.number, this.partItemTobeChanged.corePartNumber, this.partItemTobeChanged.corePrice > 0, this.partItemTobeChanged.partNumber)
                    .then(vp => {
                        if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                            this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", vp);
                            this.loader.loading = false;
                        }
                        else {
                            this.partItemTobeChanged.knownPartBuyoutAmount = vp.purchasePrice > 0 ? vp.purchasePrice : 1;
                            this.partItemTobeChanged.knownPartPrice = !this.partItemTobeChanged.isDefaultVendorSelected ? (vp.purchasePrice > 0 ? (parseFloat((vp.purchasePrice * 1.5).toFixed(2))).toString() : "1.5") : (vp.purchasePrice <= 0 ? "1.5" : this.partItemTobeChanged.DefaultCustomerPrice);
                            this.partItemTobeChanged.coreknownPartBuyoutAmount = vp.hasCore ? (vp.corePurchasePrice > 0 ? vp.corePurchasePrice : "1") : "0";
                            this.partItemTobeChanged.coreknownPartPrice = vp.hasCore ? (!this.partItemTobeChanged.isDefaultVendorSelected ? (vp.corePurchasePrice > 0 ? (vp.corePurchasePrice * 1.33).toFixed(2).toString() : "1.33") : this.partItemTobeChanged.corePrice) : "0";

                            this.partItemTobeChanged.defaultPrices = {
                                vendorPartPurchasePrice: this.partItemTobeChanged.knownPartBuyoutAmount,
                                customerPartPurchasePrice: this.partItemTobeChanged.knownPartPrice,
                                vendorCorePurchasePrice: this.partItemTobeChanged.coreknownPartBuyoutAmount,
                                customerCorePrice: this.partItemTobeChanged.coreknownPartPrice
                            };

                            this.partItemTobeChanged.showVendorPanel = false;
                        }
                    },
                    error => { this.loader.loading = false; });
            }
            console.log("Part search component vendor selection subscription data : ", res.data);
        }
    });

    initBuyout() {
        let branchCode = this.commonDataService.Branch.code;
        _.each(<any[]>this.selectedCartItems, function (row) {
            row.vendorCode = row.vendorCode == null || row.vendorCode == "" ? "" : row.vendorCode;
            row.branchCode = branchCode;
            row.defaultCustomerPrice = row.finalPrice == null ? "" : row.finalPrice;
            row.isKnownPartVendorSelected = false;
            row.knownPartVendor = null;
            row.knownPartBuyoutAmount = null;
            row.continueWithLessSalesPrice = false;
            row.isPartBuyOutCorePart = row.corePrice > 0;
        });

        this.filteredCartItems = this.selectedCartItems;

        this.loader.loading = true;

        //get Price
        this.vendorsService.getPartVendorPrice(this.filteredCartItems)
            .then(resp => {
                if (resp.ErrorType != undefined && resp.ErrorType != null && resp.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", resp);
                    this.loader.loading = false;
                }
                else {

                    this.selectedCartItems.forEach(item => {
                        let partsWithVendorCode = _.filter(<any[]>resp, function (row) {
                            return row.partNumber === item.partNumber;
                        });

                        if (partsWithVendorCode && partsWithVendorCode.length > 0) {

                            let vp : any = partsWithVendorCode[0];

                            item.knownPartBuyoutAmount = vp.purchasePrice > 0 ? vp.purchasePrice : 1;

                            let defaultCustomerPrice = item.finalPrice == null ? "" : item.finalPrice;

                            item.knownPartPrice = !item.isDefaultVendorSelected ? (vp.purchasePrice > 0 ? (parseFloat((vp.purchasePrice * 1.5).toFixed(2))).toString() : "1.5") : (vp.purchasePrice <= 0 ? "1.5" : defaultCustomerPrice);

                            item.coreknownPartBuyoutAmount = vp.hasCore ? (vp.corePurchasePrice > 0 ? vp.corePurchasePrice : "1") : "0";

                            item.coreknownPartPrice = vp.hasCore ? (!item.isDefaultVendorSelected ? (vp.corePurchasePrice > 0 ? (vp.corePurchasePrice * 1.33).toFixed(2).toString() : "1.33") : item.corePrice) : "0";

                            item.defaultPrices = {
                                vendorPartPurchasePrice: item.knownPartBuyoutAmount,
                                customerPartPurchasePrice: item.knownPartPrice,
                                vendorCorePurchasePrice: item.coreknownPartBuyoutAmount,
                                customerCorePrice: item.coreknownPartPrice
                            };

                            item.vendorCode = item.vendorCode == null || item.vendorCode == "" ? vp.vendorNumber : item.vendorCode;
                            item.defaultVendorCode = vp.vendorNumber;

                            //get Vendor details
                            this.vendorsService.getVendors(item.vendorCode, "", "", "", "", "", "", "")
                                .then(v => {
                                    if (v.ErrorType != undefined && v.ErrorType != null && v.ErrorType != 200) {
                                        this.notification.errorMessage("CartComponent", "initBuyout", "getVendorPrice", vp);
                                    }
                                    else {
                                        item.isKnownPartVendorSelected = true;
                                        item.knownPartVendor = v.vendors[0];
                                    }
                                    this.loader.loading = false;
                                },
                                error => { this.loader.loading = false; });
                        }
                    });
                }
            },
            error => { this.loader.loading = false; });
    }
    
    filter = function () {
        console.log(this.filteredCartItems);//["0"].knownPartVendor.number
        if (this.filterKey !== '') {
            this.filteredCartItems = this.selectedCartItems.filter(function (e) {
                return ((e.partNumber && e.partNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.corePartNumber && e.corePartNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.knownPartVendor.name && e.knownPartVendor.name.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.knownPartVendor.name2 && e.knownPartVendor.name2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.knownPartVendor.number && e.knownPartVendor.number.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;

            }.bind(this));
        }
        else {
            this.filteredCartItems = this.selectedCartItems;
        }
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

    confirmPartsBuyout() {
        
        this.filteredCartItems.forEach((row: any) => {
            row.buyoutPrice = +row.knownPartBuyoutAmount,
            row.salesPrice = +row.knownPartPrice,
            row.corePurchasePrice = +row.coreknownPartBuyoutAmount,
            row.corePrice = +row.coreknownPartPrice,
            row.hotFlagCode = null
        });

        let updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsBuyOut",
            updateFlagCartItems: this.filteredCartItems
        };

        this.cartService.UpdateCartItemFlag(updateCartData, true)
            .then(v => {
                console.log(v);
                if (v == true) {
                    jQuery("#knownPartBuyoutModal").modal("hide");
                }
            },
            error => { console.log(error); });

        this.logToAppInsight();
    }

    logToAppInsight() {

        let sourceName = "CartComponent_confirmPartsBuyout__KnownPartBuyout";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);

        this.filteredCartItems.forEach((row: any) => {
            let appInsightPartBuyout = Object.assign(new AppInsightPartBuyout(), {
                userId: this.commonDataService.UserId,
                customerNumber: this.commonDataService.Customer.customerNumber,
                customerName: this.commonDataService.Customer.customerName,
                branchNumber: this.commonDataService.Branch.code,
                cartNumber: this.commonDataService.CartId,

                partId: row.partId,
                partNumber: row.partNumber,
                vendor: JSON.stringify(row.knownPartVendor).replace(/'/g, '"'),
                isDefaultVendor: row.isDefaultVendorSelected,
                defaultVendorPartPurchasePrice: row.defaultPrices != null ? row.defaultPrices.vendorPartPurchasePrice : 0,
                defaultCustomerPartPurchasePrice: row.defaultPrices != null ? row.defaultPrices.customerPartPurchasePrice : 0,
                defaultVendorCorePurchasePrice: row.defaultPrices != null ? row.defaultPrices.vendorCorePurchasePrice : 0,
                defaultCustomerCorePrice: row.defaultPrices != null ? row.defaultPrices.customerCorePrice : 0,
                vendorPartPurchasePrice: row.knownPartBuyoutAmount,
                customerPartPurchasePrice: row.knownPartPrice,
                vendorCorePurchasePrice: row.coreknownPartBuyoutAmount,
                customerCorePrice: row.coreknownPartPrice,
                quantity: row.quantity,
                quantityAvailable: row.quantityAvailable,

                plMetricName: sourceName
            });

            this.applicationInsightsService.trackMetric(metricName, appInsightPartBuyout);
        });
}

    knownPartPriceKeyPress(e: any) {
        let priceVal: any = e.currentTarget.value;

        // allows 0-9, backspace, and decimal
        if (((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 46)) {
            return false;
        }

        // checks to make sure only 1 decimal is allowed
        if (e.which == 46) {
            if (priceVal.indexOf(".") != -1)
                return false;
        }

        //if (/^\d*(\.\d\d)$/.test(priceVal)) {
        //    return false;
        //}
    }

    coreknownPartPriceKeyPress(e: any) {
        let priceVal: any = e.currentTarget.value;

        // allows 0-9, backspace, and decimal
        if (((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 46)) {
            return false;
        }

        // checks to make sure only 1 decimal is allowed
        if (e.which == 46) {
            if (priceVal.indexOf(".") != -1)
                return false;
        }

    }

    knownPartPriceOnPaste(cartItem: any, e: any) {
        let content = e.clipboardData.getData('text/plain');
        this.knownPartBuyoutCorrectPrice(cartItem, content);
        return false;
    }

    coreknownPartPriceOnPaste(cartItem: any, e: any) {
        let content = e.clipboardData.getData('text/plain');
        this.coreknownPartBuyoutCorrectPrice(cartItem, content);
        return false;
    }

    knownPartCorrectPrice(cartItem: any, textPrice: any) {
        let match: any = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.knownPartPrice = "1.5";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.knownPartPrice = match[0] > 0 ? match[0] : "1.5";
        };
    }

    //knownPartBuyoutPriceOnPaste(cartItem: any, e: any) {
    //    let content = e.clipboardData.getData('text/plain');
    //    this.knownPartBuyoutCorrectPrice(cartItem, content);
    //    return false;
    //}

    knownPartBuyoutCorrectPrice(cartItem: any, textPrice: any) {
        let match: any = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.knownPartBuyoutAmount = "1";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.knownPartBuyoutAmount = match[0] > 0 ? match[0] : "1";
            cartItem.knownPartPrice = textPrice > 0 ? (parseFloat((textPrice * 1.5).toFixed(2))).toString() : "1.5";
        };
    }

    coreknownPartBuyoutCorrectPrice(cartItem: any, textPrice: any) {
        let match: any = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        cartItem.coreknownPartBuyoutAmount = "1";
        cartItem.continueWithLessSalesPrice = false;
        if (match && match.length > 0) {
            cartItem.coreknownPartBuyoutAmount = match[0] > 0 ? match[0] : "1";
            cartItem.coreknownPartPrice = textPrice > 0 ? (parseFloat((textPrice * 1.33).toFixed(2))).toString() : "1.33";
        };
    }

    onToggleAccordion(cartItem: any) {
        this.partItemTobeChanged = null;
        this.selectedCartItems.forEach(item => {
            if (item.cartItemId != cartItem.cartItemId) {
                item.isOpened = false;
            }
            item.showVendorPanel = false;
        });

        cartItem.isOpened = cartItem.isOpened ? false : true;
    }

    changeVendor(cartItem)
    {
        cartItem.showVendorPanel = true;
        this.partItemTobeChanged = cartItem;
    }

    onKnownPartVendorSelect(knownPartVendor: any) { }

    ngOnDestroy() {
        this.vendorSubscription.unsubscribe();
    }
}