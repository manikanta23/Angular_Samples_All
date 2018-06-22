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
var vendors_service_1 = require("./vendors.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var VendorsModalComponent = (function () {
    function VendorsModalComponent(loader, notification, pagerService, commonDataService, vendorsService) {
        this.loader = loader;
        this.notification = notification;
        this.pagerService = pagerService;
        this.commonDataService = commonDataService;
        this.vendorsService = vendorsService;
        // pager object
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.filter = function () {
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
        };
        //this.notification.hideNotification();
    }
    VendorsModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.vendorsService.notifyShowVendorModalEventEmitter.subscribe(function (res) {
            _this.vendorsData = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.filterKey = "";
                _this.vendorsData = res.data;
                _this.filteredAdvancedVendors = res.data;
                console.log("Vendors modal component show modal event subscription : ", res.data);
                _this.setPage(1);
                _this.showModal();
            }
        });
    };
    VendorsModalComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredAdvancedVendors.length, page, 6);
        // get current page of items
        this.pagedAdvancedVendors = this.filteredAdvancedVendors.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    VendorsModalComponent.prototype.sortDataBy = function (sortBy) {
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
    };
    VendorsModalComponent.prototype.showModal = function () {
        jQuery("#vendorsModal").modal("show");
    };
    VendorsModalComponent.prototype.closeModal = function () {
        jQuery("#vendorsModal").modal("hide");
    };
    VendorsModalComponent.prototype.onVendorSelect = function (vendor) {
        console.log("Vendors modal component selected vendor : ", vendor);
        this.closeModal();
        this.vendorsService.notifyVendorSelection({ data: vendor });
    };
    VendorsModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return VendorsModalComponent;
}());
VendorsModalComponent = __decorate([
    core_1.Component({
        selector: "vendors-modal",
        templateUrl: "./src/app/search/modal/vendors/vendors.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        pager_service_1.PagerService,
        common_data_service_1.CommonDataService,
        vendors_service_1.VendorsService])
], VendorsModalComponent);
exports.VendorsModalComponent = VendorsModalComponent;
//# sourceMappingURL=vendors.component.js.map