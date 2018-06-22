import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from "@angular/core";
declare var jQuery: any;

import { LoaderService } from "./../../../_common/services/loader.service";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { CustomerModalService } from "./customer.service";
import { PagerService } from "./../../../_common/services/pager.service";
import { AppInsightCustomerSearch } from "../../../_entities/app-insight-customer-search.entity";
import { ApplicationInsightsService, SourceLocationType } from "../../../_common/services/application-insights.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "customer-modal",
    templateUrl: `./src/app/search/modal/customer/customer.component.html?v=${new Date().getTime()}`,
    providers: [PagerService, ApplicationInsightsService]
})

export class CustomerModalComponent implements OnInit, OnDestroy {

    customersData: any;
    customerSearchTerm: any;
    //@Output() callbackModalCustomerSelect: EventEmitter<any> = new EventEmitter();
    subscription: any;
    // pager object
    pager: any = {};
    // paged items
    pagedAdvancedCustomers: any[];
    filteredAdvancedCustomers: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private pagerService: PagerService,
        private commonDataService: CommonDataService,
        private customerModalService: CustomerModalService,
        private applicationInsightsService: ApplicationInsightsService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.subscription = this.customerModalService.notifyShowModalEventEmitter.subscribe((res) => {
            this.customersData = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                this.filterKey = "";
                this.customersData = res.data.customers;
                this.customerSearchTerm = res.data.customerSearchTerm;
                this.filteredAdvancedCustomers = res.data.customers;
                console.log("Customer modal component show modal event subscription : ", res.data.customers);
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
        this.pager = this.pagerService.getPager(this.filteredAdvancedCustomers.length, page, 6);

        // get current page of items
        this.pagedAdvancedCustomers = this.filteredAdvancedCustomers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {

        if (this.filterKey !== '') {
            this.filteredAdvancedCustomers = this.customersData.filter(function (e) {
                return ((e.customerName && e.customerName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.customerName2 && e.customerName2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.customerNumber && ("" + e.customerNumber).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.streetAddress && e.streetAddress.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.city && e.city.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.state && e.state.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.postalCode && ("" + e.postalCode).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.phoneNumber && ("" + e.phoneNumber).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.orderCount && ("" + e.orderCount).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.accountManagerName && e.accountManagerName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.accountManager && ("" + e.accountManager).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.mscAccountNumber && ("" + e.mscAccountNumber).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;


            }.bind(this));

            this.setPage(1);
        }
        else {
            this.filteredAdvancedCustomers = this.customersData;
            this.setPage(1);
        }
    }

    sortDataBy(sortBy: string) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;

        this.sortBy = sortBy;

        this.filteredAdvancedCustomers = this.commonDataService.sortData(this.filteredAdvancedCustomers, this.sortBy, this.sortAsc);

        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    }

    showModal(): void {
        jQuery("#customersModal").modal("show");
    }

    closeModal(): void {
        jQuery("#customersModal").modal("hide");
    }

    onCustomerSelect(customer: any): void {
        console.log("Customer modal component selected customer : ", customer);
        this.closeModal();
        //this.callbackModalCustomerSelect.emit(customer);
        this.customerModalService.notifyCustomerSelection({ data: customer });

        let source = '';
        if (this.router.url == '/' || this.router.url !== '/#') {
            source = SourceLocationType[SourceLocationType.PartSearch_AdvancedCustomerSearch]
        } else {
            source = SourceLocationType[SourceLocationType.HeaderSearch_AdvancedCustomerSearch]
        }
        let searchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];

        // only clear the coupon/couponVendors and emit the coupon event if the selected customer.CustomerType is SoldTo ("AG"")
        if (customer.customerType === "AG") {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
            this.commonDataService.showCouponsModalEventEmitter.emit();
        }

        let sourceName = "CustomerModalComponent_onCustomerSelect";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        if (this.customerSearchTerm != undefined && this.customerSearchTerm != null && this.customerSearchTerm != '') {
            let appInsightCustomerSearch = Object.assign(new AppInsightCustomerSearch(), {
                userId: this.commonDataService.UserId,
                branchNumber: this.commonDataService.Branch.code,
                searchTerm: searchTerm != undefined && searchTerm != null ? searchTerm : "",
                customerSearchTerm: this.applicationInsightsService.getAppInsightSerializedJson(this.customerSearchTerm),
                source: source,
                result: this.applicationInsightsService.getAppInsightSerializedJson(customer),
                customerNotFound: false,
                plMetricName: sourceName
            });
            this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}