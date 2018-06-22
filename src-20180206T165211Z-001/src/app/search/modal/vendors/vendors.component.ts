import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from "@angular/core";
declare var jQuery: any;

import { LoaderService } from "./../../../_common/services/loader.service";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { VendorsService } from "./vendors.service";
import { PagerService } from "./../../../_common/services/pager.service";

@Component({
    selector: "vendors-modal",
    templateUrl: `./src/app/search/modal/vendors/vendors.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]
})

export class VendorsModalComponent implements OnInit, OnDestroy {

    vendorsData: any;
    //@Output() callbackModalCustomerSelect: EventEmitter<any> = new EventEmitter();
    subscription: any;
    // pager object
    pager: any = {};
    // paged items
    pagedAdvancedVendors: any[];
    filteredAdvancedVendors: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private pagerService: PagerService,
        private commonDataService: CommonDataService,
        private vendorsService: VendorsService) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.subscription = this.vendorsService.notifyShowVendorModalEventEmitter.subscribe((res) => {
            this.vendorsData = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                this.filterKey = "";
                this.vendorsData = res.data;
                this.filteredAdvancedVendors = res.data;
                console.log("Vendors modal component show modal event subscription : ", res.data);
                this.setPage(1);
                this.showModal();
            }
        });
    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredAdvancedVendors.length, page, 6);

        // get current page of items
        this.pagedAdvancedVendors = this.filteredAdvancedVendors.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {

        if (this.filterKey !== '') {
            this.filteredAdvancedVendors = this.vendorsData.filter(function (e) {
                return ((e.name && e.name.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.name2 && e.name2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.number && e.number.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.address && e.address.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.city && e.city.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.state && e.state.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.zipCode && e.zipCode.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.currency && e.currency.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.status && e.status.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.phone && e.phone.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.terms && e.terms.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;

            }.bind(this));

            this.setPage(1);
        }
        else {
            this.filteredAdvancedVendors = this.vendorsData;
            this.setPage(1);
        }
    }

    sortDataBy(sortBy: string) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;

        this.sortBy = sortBy;

        this.filteredAdvancedVendors = this.commonDataService.sortData(this.filteredAdvancedVendors, this.sortBy, this.sortAsc);

        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    }

    showModal(): void {
        jQuery("#vendorsModal").modal("show");
    }

    closeModal(): void {
        jQuery("#vendorsModal").modal("hide");
    }

    onVendorSelect(vendor: any): void {
        console.log("Vendors modal component selected vendor : ", vendor);
        this.closeModal();
        this.vendorsService.notifyVendorSelection({ data: vendor });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}