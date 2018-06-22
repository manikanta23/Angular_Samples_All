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
import { AppInsightHotFlag } from "./../../_entities/app-insight-hot-flag.entity";

@Component({
    selector: "hot-flag",
    templateUrl: `./src/app/cart/procurement-modal/hot-flag.component.html?v=${new Date().getTime()}`,
})

export class HotFlagComponent implements OnInit {

    @Input("hot-flags") hotFlags: any = null;

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
        private applicationInsightsService: ApplicationInsightsService
    ) {

    }
    ngOnInit() {

    }

    showModal(selectedCartItems) {
        this.filterKey = '';
        this.selectedCartItems = selectedCartItems
        this.filteredCartItems = this.selectedCartItems;
        this.initHotFlag();
        jQuery("#hotFlagModal").modal("show");
    }

    closeModal(): void {
        jQuery("#hotFlagModal").modal("hide");
    }

    initHotFlag() {

        let branchCode = this.commonDataService.Branch.code;
        _.each(<any[]>this.filteredCartItems, function (row) {
            row.vendorCode = row.vendorCode == null || row.vendorCode == "" ? "" : row.vendorCode;
            row.branchCode = branchCode;
        });

        this.loader.loading = true;
        //get Price
        this.vendorsService.getPartVendorPrice(this.filteredCartItems)
            .then(vp => {
                this.loader.loading = false;
                if (vp.ErrorType != undefined && vp.ErrorType != null && vp.ErrorType != 200) {
                    this.notification.errorMessage("HotFlagComponent", "initBuyout", "getPartVendorPrice", vp);
                }
                else {
                    this.selectedCartItems.forEach(item => {
                        let partsWithVendorCode = _.filter(<any[]>vp, function (row) {
                            return row.partNumber === item.partNumber;
                        });

                        if (partsWithVendorCode && partsWithVendorCode.length > 0) {
                            item.vendorCode = partsWithVendorCode[0].vendorNumber;
                        }
                    });
                }
                console.log("getPartVendorPrice", vp);
            },
            error => { this.loader.loading = false; });
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
    
    updateCartItemsHotFlag() {

        this.filteredCartItems.forEach((row: any) => {
            row.buyoutPrice = null,
                row.salesPrice = null,
                row.corePurchasePrice = null,
                row.corePrice = null
        });

        let updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsHotFlag",
            updateFlagCartItems: this.filteredCartItems
        };

        this.loader.loading = true;
        this.cartService.UpdateCartItemFlag(updateCartData, true)
            .then(v => {
                this.loader.loading = false;
                console.log(v);
                if (v == true) {
                    this.closeModal();
                    this.notification.showNotification("HotFlag Updated Successfully for selected part(s).", NotificationType.Success);
                }
            },
            error => { this.loader.loading = false; console.log(error); });

        let sourceName = "CartComponent_sendHotFlag";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightHotFlag = Object.assign(new AppInsightHotFlag(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightHotFlag.hotFlagCartItems = this.applicationInsightsService.getAppInsightParts(this.filteredCartItems, JSON.stringify(appInsightHotFlag).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightHotFlag);

    }

    onToggleAccordion(cartItem: any) {
        this.selectedCartItems.forEach(item => {
            if (item.cartItemId != cartItem.cartItemId)
                item.isOpened = false;
        });

        cartItem.isOpened = cartItem.isOpened ? false : true;
    }
}