import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, ElementRef } from "@angular/core";
declare var jQuery: any;
import { Router, ActivatedRoute } from '@angular/router';
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { PagerService } from "./../../../_common/services/pager.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { CartService } from "./../../../cart/cart.service";
import { CartSearch, Cart } from "./../../../_entities/cart.entity";
import * as _ from "lodash";

import { VendorsService } from "./../vendors/vendors.service";
import { VendorComponent } from "./../../../vendor/vendor.component";
import { AppInsightPartBuyout } from "../../../_entities/app-insight-part-buyout.entity";
import { ApplicationInsightsService } from "../../../_common/services/application-insights.service";

@Component({
    selector: "partBuyout-modal",
    templateUrl: `./src/app/search/modal/partbuyout/partbuyout.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]
})

export class PartBuyoutModalComponent implements OnInit, OnDestroy {
    partsbuyoutQuantity: any = 1;
    branchCode: string;
    partNo: string = "PARTSBUYOUTTX";
    partNoOnly: string;
    description: string;
    manufacturer: string;
    price: string = "1.5";
    searchData: CartSearch = new CartSearch();
    cartsData: any;
    addToCartItem: any;
    cartId: string;
    selectedPartBuyoutCoreOption: string = "";
    isVendorSelected: boolean = false;
    vendor: any = null;
    buyoutAmount: string = "1";

    @ViewChild('vendorPanel') vendorComponent: VendorComponent;

    addtoCartParameters: Cart = new Cart();
    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private cartService: CartService,
        private router: Router,
        private vendorsService: VendorsService,
        private elementRef: ElementRef,
        private applicationInsightsService: ApplicationInsightsService
    ) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        jQuery('#partBuyoutModal')
            .on('hidden.bs.modal', (e) => {
                jQuery('.nav-tabs a[href="#pnlVendorSearch"]').tab('show');
                this.isVendorSelected = false;
                this.vendor = null;

                this.partNoOnly = "";
                this.description = "";
                this.manufacturer = "";
                this.price = "1.5";
                this.buyoutAmount = "1";
                this.selectedPartBuyoutCoreOption = "";
                this.partsbuyoutQuantity = 1;
            })
            .on('shown.bs.modal', (e) => {
                this.isVendorSelected = false;
                this.vendor = null;
                //this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
            });
    }

    onChangePartBuyout(newValue) {
        console.log("Partbuyout modal component on change : ", newValue);
        this.selectedPartBuyoutCoreOption = newValue;
    }

    CancelPartBuyout() {
        this.partsbuyoutQuantity = 1;
        this.partNo = "PARTSBUYOUTTX";
        this.partNoOnly = null;
        this.description = null;
        this.manufacturer = null;
        this.price = "1.5";
        this.buyoutAmount = "1";
        this.selectedPartBuyoutCoreOption = "";
    }

    addToCart(partNo = "PARTSBUYOUTTX", partNoOnly, description, manufacturer, price, partsbuyoutQuantity, partBuyoutCoreOption) {
        this.addtoCartParameters = Object.assign(new Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: partNo,
            description: description,
            customerPrice: price,
            quantity: partsbuyoutQuantity == "0" ? "1" : partsbuyoutQuantity,
            coreOption: null,
            coreprice: null,
            corePartNumber: null,
            partId: null,
            listPrice: price,
            priceOverrideReasonId: null,
            PartNumOnly: partNoOnly,
            cartId: this.cartId,
            isBuyout: true,
            cateogory: "P0101",
            manufacturer: manufacturer,
            partBuyoutCoreOption: partBuyoutCoreOption,
            VendorCode: this.vendor.number,
            PurchasePrice: this.buyoutAmount
        });

        let sourceName = "PartBuyoutModalComponent_addToCart__UnknownPartBuyout";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightPartBuyout = Object.assign(new AppInsightPartBuyout(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            partNumber: (partNoOnly != null ? (partNoOnly + ",") : "") + (description != null ? (description + ",") : "") + (manufacturer != null ? manufacturer : ""),
            vendor: JSON.stringify(this.vendor).replace(/'/g, '"'),
            defaultVendorPartPurchasePrice: 1,
            defaultCustomerPartPurchasePrice: 1.5,
            vendorPartPurchasePrice: this.buyoutAmount,
            customerPartPurchasePrice: price,
            quantity: this.addtoCartParameters.quantity,
            plMetricName: sourceName
        });
        this.applicationInsightsService.trackMetric(metricName, appInsightPartBuyout);

        this.cartService.addToCart(this.addtoCartParameters)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("PartBuyoutModalComponent", "addToCart", "addToCart", carts);
                }
                else {
                    this.partsbuyoutQuantity = 1;
                    this.partNo = "PARTSBUYOUTTX";
                    this.partNoOnly = null;
                    this.description = "";
                    this.manufacturer = "";
                    this.price = null;
                    this.buyoutAmount = null;
                    this.selectedPartBuyoutCoreOption = "";
                    this.notification.showNotification(`${partNo} ${partNoOnly} ${description != null ? description : ""} with ${partsbuyoutQuantity} quantity added successfully.`, NotificationType.Success);
                    jQuery("#partBuyoutModal").modal("hide");
                    this.router.navigate(['/cart']);

                }
            },
            error => { });
    }

    //Vendor Start
    removeFavouriteVendors(selectedVendor) {
        this.vendorsService.deleteFavouriteVendors(selectedVendor.number)
            .then(favVendors => {
                if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                    this.notification.errorMessage("PartBuyoutModalComponent", "removeFavouriteVendors", "deleteFavouriteVendors", favVendors);
                }
                else {
                    if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                        this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                    }
                    else {
                        this.vendor.isFavourite = false;
                        this.vendorsService.notifyFavouriteVendorChange(selectedVendor);
                    }
                }
            },
            error => { });
    }

    addToFavouriteVendors(selectedVendor) {
        this.vendorsService.createFavouriteVendors(selectedVendor.number)
            .then(favVendors => {
                if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                    this.notification.errorMessage("PartBuyoutModalComponent", "addToFavouriteVendors", "createFavouriteVendors", favVendors);
                }
                else {
                    if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                        this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                    }
                    else {
                        this.vendor.isFavourite = true;
                        this.vendorsService.notifyFavouriteVendorChange(selectedVendor);
                    }
                }
            },
            error => { });
    }

    useDifferentVendor() {
        if (this.vendorComponent) {
            this.vendorComponent.vendorNumber = "";
            this.vendorComponent.advVendorName = "";
            this.vendorComponent.advVendorCity = "";
            this.vendorComponent.advVendorState = "";
            this.vendorComponent.advVendorPostalCode = "";
            this.vendorComponent.advVendorPhoneNumber = "";
        }
        this.isVendorSelected = false;
    }

    vendorSubscription = this.vendorsService.notifyVendorSelectEventEmitter.subscribe((res) => {
        if (res.hasOwnProperty('data') && res.data != null) {
            this.isVendorSelected = true;
            this.vendor = res.data;
            this.elementRef.nativeElement.querySelector('input#txtpartNoOnly').focus();
            console.log("Part search component vendor selection subscription data : ", res.data);
        }
    });

    changeQuntity(e: any) {
        if (e.which == 38) {
            this.partsbuyoutQuantity = +(this.partsbuyoutQuantity) + 1;
        }
        else if (e.which == 40 && this.partsbuyoutQuantity > 1) {
            this.partsbuyoutQuantity = this.partsbuyoutQuantity - 1;
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

    onQuantityFocusout(e: any) {
        let quantity: any = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            this.partsbuyoutQuantity = 1;
        }
    }

    priceKeyPress(e: any) {
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

    priceOnPaste(e: any) {
        let content = e.clipboardData.getData('text/plain');
        this.correctPrice(content);
        return false;
    }

    correctPrice(textPrice: any) {
        let match: any = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        this.price = "1.5";
        if (match && match.length > 0) {
            this.price = match[0];
            this.elementRef.nativeElement.querySelector('input#txtPrice').value = match[0] > 0 ? match[0] : "1.5";
            this.price = textPrice > 0 ? textPrice : "1.5";
        };
    }

    buyoutPriceOnPaste(e: any) {
        let content = e.clipboardData.getData('text/plain');
        this.buyoutCorrectPrice(content);
        return false;
    }

    buyoutCorrectPrice(textPrice: any) {
        let match: any = textPrice.match(/\.?[0-9]\d*(\.\d{1,2})?/g);
        this.buyoutAmount = "1";
        if (match && match.length > 0) {
            this.buyoutAmount = match[0] > 0 ? match[0] : "1";
            this.elementRef.nativeElement.querySelector('input#txtBuyoutAmount').value = match[0] > 0 ? match[0] : "1";
            this.price = textPrice > 0 ? (parseFloat((textPrice * 1.5).toFixed(2))).toString() : "1.5";
        };
    }

    ngOnDestroy() {
        this.vendorSubscription.unsubscribe();
    }
    //Vendor End
}