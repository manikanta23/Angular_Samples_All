import { Component, OnInit, Input, OnDestroy } from "@angular/core";
declare var jQuery: any;

import { CommonDataService } from "./../../../_common/services/common-data.service";
import { PagerService } from "./../../../_common/services/pager.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { FavouritesService } from "./favourites.service";
import { CustomerModalService } from "../customer/customer.service";
import { AppInsightCustomerSearch } from "../../../_entities/app-insight-customer-search.entity";
import { ApplicationInsightsService, SourceLocationType } from "../../../_common/services/application-insights.service";
import { AppInsightCustomerSearchTerm } from "../../../_entities/app-insight-customer-search-term.entity";


@Component({
    selector: "favourites-modal",
    templateUrl: `./src/app/search/modal/favourites/favourites.component.html?v=${new Date().getTime()}`,
    providers: [FavouritesService, PagerService, ApplicationInsightsService]
})

export class FavouritesModalComponent implements OnInit, OnDestroy {

    favouriteCustomers: any;
    // pager object
    pager: any = {};
    // paged items
    pagedFavouriteCustomers: any[];
    filteredFavouriteCustomers: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private favouritesService: FavouritesService,
        private customerModalService: CustomerModalService,
        private applicationInsightsService: ApplicationInsightsService) {
        //this.notification.hideNotification();
    }

    subscription: any = this.commonDataService.branchUpdated
        .subscribe(
        (d: any) => {
            this.getFavourites();
        });

    favouriteUpdateSubscription: any = this.commonDataService.favouriteUpdateEventEmitter
        .subscribe(
        (d: any) => {
            this.getFavourites();
        });

    ngOnInit() { this.getFavourites(); }

    getFavourites(): void {
        this.filterKey = "";
        this.favouriteCustomers = null;
        this.favouritesService.getFavourites()
            .then(favCustomers => {
                if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                    this.notification.errorMessage("FavouritesModalComponent", "getFavourites", "getFavourites", favCustomers);
                }
                else {
                    this.favouriteCustomers = favCustomers;
                    this.filteredFavouriteCustomers = favCustomers;
                    this.setPage(1);
                }
                console.log("Favourites modal component customers data : ", favCustomers);
            },
            error => { });
    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFavouriteCustomers.length, page, 10);

        // get current page of items
        this.pagedFavouriteCustomers = this.filteredFavouriteCustomers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {
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

    }

    sortDataBy(sortBy: string) {
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
    }

    removeFavourites(selectedCustomer) {
        //
        this.favouritesService.DeleteFavourites(selectedCustomer.customerNumber)
            .then(favCustomers => {
                if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                    this.notification.errorMessage("FavouritesModalComponent", "removeFavourites", "DeleteFavourites", favCustomers);
                }
                else {
                    if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                        this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                    }
                    else {                       
                        this.getFavourites();
                        jQuery('#searchFavouriteId').focus();                       
                    }
                }
            },
            error => { });
    }

    onSelectFavouriteCustomer(favourite) {
        jQuery("#favoritesModal").modal("hide");
            favourite.isFavourite = true;
            this.commonDataService.Customer = favourite;
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
            this.commonDataService.showCouponsModalEventEmitter.emit();
            this.customerModalService.notifyShowMSCPayerCustomerModal({ data: favourite });
            let sourceName = "FavouritesModalComponent_onSelectFavouriteCustomer";
            let metricName = this.applicationInsightsService.getMetricValue(sourceName);
            let appInsightCustomerSearchTerm: AppInsightCustomerSearchTerm = Object.assign(new AppInsightCustomerSearchTerm(), {
                isFavourite: favourite.isFavourite
            });
            let appInsightCustomerSearch = Object.assign(new AppInsightCustomerSearch(), {
                userId: this.commonDataService.UserId,
                branchNumber: this.commonDataService.Branch.code,
                searchTerm: "",
                customerSearchTerm: this.applicationInsightsService.getAppInsightSerializedJson(appInsightCustomerSearchTerm),
                source: SourceLocationType[SourceLocationType.FavouriteCustomer],
                //clickingFavorites: true,
                //clickingAdvancedSearch: false,
                result: this.applicationInsightsService.getAppInsightSerializedJson(favourite),
                customerNotFound: false,
                plMetricName: sourceName
            });
            this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);       
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.favouriteUpdateSubscription.unsubscribe();
    }
}