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
var loader_service_1 = require("./../../../_common/services/loader.service");
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var notification_service_1 = require("./../../../_common/services/notification.service");
var customer_service_1 = require("./customer.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var app_insight_customer_search_entity_1 = require("../../../_entities/app-insight-customer-search.entity");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var router_1 = require("@angular/router");
var CustomerModalComponent = (function () {
    function CustomerModalComponent(loader, notification, pagerService, commonDataService, customerModalService, applicationInsightsService, router, activatedRoute) {
        this.loader = loader;
        this.notification = notification;
        this.pagerService = pagerService;
        this.commonDataService = commonDataService;
        this.customerModalService = customerModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        // pager object
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.filter = function () {
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
        };
        //this.notification.hideNotification();
    }
    CustomerModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.customerModalService.notifyShowModalEventEmitter.subscribe(function (res) {
            _this.customersData = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.filterKey = "";
                _this.customersData = res.data.customers;
                _this.customerSearchTerm = res.data.customerSearchTerm;
                _this.filteredAdvancedCustomers = res.data.customers;
                console.log("Customer modal component show modal event subscription : ", res.data.customers);
                _this.setPage(1);
                _this.showModal();
            }
        });
    };
    CustomerModalComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredAdvancedCustomers.length, page, 6);
        // get current page of items
        this.pagedAdvancedCustomers = this.filteredAdvancedCustomers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    CustomerModalComponent.prototype.sortDataBy = function (sortBy) {
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
    };
    CustomerModalComponent.prototype.showModal = function () {
        jQuery("#customersModal").modal("show");
    };
    CustomerModalComponent.prototype.closeModal = function () {
        jQuery("#customersModal").modal("hide");
    };
    CustomerModalComponent.prototype.onCustomerSelect = function (customer) {
        console.log("Customer modal component selected customer : ", customer);
        this.closeModal();
        //this.callbackModalCustomerSelect.emit(customer);
        this.customerModalService.notifyCustomerSelection({ data: customer });
        var source = '';
        if (this.router.url == '/' || this.router.url !== '/#') {
            source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch_AdvancedCustomerSearch];
        }
        else {
            source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.HeaderSearch_AdvancedCustomerSearch];
        }
        var searchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
        // only clear the coupon/couponVendors and emit the coupon event if the selected customer.CustomerType is SoldTo ("AG"")
        if (customer.customerType === "AG") {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
            this.commonDataService.showCouponsModalEventEmitter.emit();
        }
        var sourceName = "CustomerModalComponent_onCustomerSelect";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        if (this.customerSearchTerm != undefined && this.customerSearchTerm != null && this.customerSearchTerm != '') {
            var appInsightCustomerSearch = Object.assign(new app_insight_customer_search_entity_1.AppInsightCustomerSearch(), {
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
    };
    CustomerModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return CustomerModalComponent;
}());
CustomerModalComponent = __decorate([
    core_1.Component({
        selector: "customer-modal",
        templateUrl: "./src/app/search/modal/customer/customer.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        pager_service_1.PagerService,
        common_data_service_1.CommonDataService,
        customer_service_1.CustomerModalService,
        application_insights_service_1.ApplicationInsightsService,
        router_1.Router,
        router_1.ActivatedRoute])
], CustomerModalComponent);
exports.CustomerModalComponent = CustomerModalComponent;
//# sourceMappingURL=customer.component.js.map