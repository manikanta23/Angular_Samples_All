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
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var notification_service_1 = require("./../../../_common/services/notification.service");
var favourites_service_1 = require("./favourites.service");
var customer_service_1 = require("../customer/customer.service");
var app_insight_customer_search_entity_1 = require("../../../_entities/app-insight-customer-search.entity");
var application_insights_service_1 = require("../../../_common/services/application-insights.service");
var app_insight_customer_search_term_entity_1 = require("../../../_entities/app-insight-customer-search-term.entity");
var FavouritesModalComponent = (function () {
    function FavouritesModalComponent(notification, commonDataService, pagerService, favouritesService, customerModalService, applicationInsightsService) {
        var _this = this;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.favouritesService = favouritesService;
        this.customerModalService = customerModalService;
        this.applicationInsightsService = applicationInsightsService;
        // pager object
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.subscription = this.commonDataService.branchUpdated
            .subscribe(function (d) {
            _this.getFavourites();
        });
        this.favouriteUpdateSubscription = this.commonDataService.favouriteUpdateEventEmitter
            .subscribe(function (d) {
            _this.getFavourites();
        });
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredFavouriteCustomers = this.favouriteCustomers.filter(function (e) {
                    return ((e.customerName && e.customerName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.customerName2 && e.customerName2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.customerNumber && e.customerNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.streetAddress && e.streetAddress.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.city && e.city.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.state && e.state.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.postalCode && e.postalCode.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.phoneNumber && e.phoneNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.accountManagerName && e.accountManagerName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.accountManager && e.accountManager.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
                this.setPage(1);
            }
            else {
                this.filteredFavouriteCustomers = this.favouriteCustomers;
                this.setPage(1);
            }
        };
        //this.notification.hideNotification();
    }
    FavouritesModalComponent.prototype.ngOnInit = function () { this.getFavourites(); };
    FavouritesModalComponent.prototype.getFavourites = function () {
        var _this = this;
        this.filterKey = "";
        this.favouriteCustomers = null;
        this.favouritesService.getFavourites()
            .then(function (favCustomers) {
            if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                _this.notification.errorMessage("FavouritesModalComponent", "getFavourites", "getFavourites", favCustomers);
            }
            else {
                _this.favouriteCustomers = favCustomers;
                _this.filteredFavouriteCustomers = favCustomers;
                _this.setPage(1);
            }
            console.log("Favourites modal component customers data : ", favCustomers);
        }, function (error) { });
    };
    FavouritesModalComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFavouriteCustomers.length, page, 10);
        // get current page of items
        this.pagedFavouriteCustomers = this.filteredFavouriteCustomers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    FavouritesModalComponent.prototype.sortDataBy = function (sortBy) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;
        this.sortBy = sortBy;
        this.filteredFavouriteCustomers = this.commonDataService.sortData(this.filteredFavouriteCustomers, this.sortBy, this.sortAsc);
        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    };
    FavouritesModalComponent.prototype.removeFavourites = function (selectedCustomer) {
        var _this = this;
        //
        this.favouritesService.DeleteFavourites(selectedCustomer.customerNumber)
            .then(function (favCustomers) {
            if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                _this.notification.errorMessage("FavouritesModalComponent", "removeFavourites", "DeleteFavourites", favCustomers);
            }
            else {
                if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                    _this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                }
                else {
                    _this.getFavourites();
                    jQuery('#searchFavouriteId').focus();
                }
            }
        }, function (error) { });
    };
    FavouritesModalComponent.prototype.onSelectFavouriteCustomer = function (favourite) {
        jQuery("#favoritesModal").modal("hide");
        favourite.isFavourite = true;
        this.commonDataService.Customer = favourite;
        this.commonDataService.Coupons = null;
        this.commonDataService.CouponVendors = null;
        this.commonDataService.showCouponsModalEventEmitter.emit();
        this.customerModalService.notifyShowMSCPayerCustomerModal({ data: favourite });
        var sourceName = "FavouritesModalComponent_onSelectFavouriteCustomer";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightCustomerSearchTerm = Object.assign(new app_insight_customer_search_term_entity_1.AppInsightCustomerSearchTerm(), {
            isFavourite: favourite.isFavourite
        });
        var appInsightCustomerSearch = Object.assign(new app_insight_customer_search_entity_1.AppInsightCustomerSearch(), {
            userId: this.commonDataService.UserId,
            branchNumber: this.commonDataService.Branch.code,
            searchTerm: "",
            customerSearchTerm: this.applicationInsightsService.getAppInsightSerializedJson(appInsightCustomerSearchTerm),
            source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.FavouriteCustomer],
            //clickingFavorites: true,
            //clickingAdvancedSearch: false,
            result: this.applicationInsightsService.getAppInsightSerializedJson(favourite),
            customerNotFound: false,
            plMetricName: sourceName
        });
        this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
    };
    FavouritesModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.favouriteUpdateSubscription.unsubscribe();
    };
    return FavouritesModalComponent;
}());
FavouritesModalComponent = __decorate([
    core_1.Component({
        selector: "favourites-modal",
        templateUrl: "./src/app/search/modal/favourites/favourites.component.html?v=" + new Date().getTime(),
        providers: [favourites_service_1.FavouritesService, pager_service_1.PagerService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        favourites_service_1.FavouritesService,
        customer_service_1.CustomerModalService,
        application_insights_service_1.ApplicationInsightsService])
], FavouritesModalComponent);
exports.FavouritesModalComponent = FavouritesModalComponent;
//# sourceMappingURL=favourites.component.js.map