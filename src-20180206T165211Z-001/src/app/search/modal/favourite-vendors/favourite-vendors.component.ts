import { Component, OnInit, Input } from "@angular/core";
declare var jQuery: any;

import { CommonDataService } from "./../../../_common/services/common-data.service";
import { PagerService } from "./../../../_common/services/pager.service";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { VendorsService } from "./../vendors/vendors.service";
import { AuthGuard } from "./../../../_common/auth-guard";

@Component({
    selector: "favourite-vendors-modal",
    templateUrl: `./src/app/search/modal/favourite-vendors/favourite-vendors.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]
})

export class FavouriteVendorsModalComponent implements OnInit {

    favouriteVendors: any;
    // pager object
    pager: any = {};
    // paged items
    pagedFavouriteVendors: any[];
    filteredFavouriteVendors: any[];
    filterKey: string = "";
    authGuardsubscription: any = null;
    vendorsServicesubscription: any = null;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private vendorsService: VendorsService,
        private authGuard: AuthGuard
    ) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.authGuardsubscription = this.authGuard.AuthenticationCheckUpdated.subscribe((d: any) => {
            if (d && (this.filteredFavouriteVendors == null || this.filteredFavouriteVendors == undefined)) {
                this.getFavouriteVendors();
            }
            //this.changeDetectorRef.detectChanges();
        });
        this.vendorsServicesubscription = this.vendorsService.notifyFavouriteVendorChangeEventEmitter.subscribe((res) => {
            this.getFavouriteVendors();
        });
    }

    getFavouriteVendors(): void {
        this.filterKey = "";
        this.favouriteVendors = null;
        this.vendorsService.getFavouriteVendors()
            .then(favVendors => {
                if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                    this.notification.errorMessage("FavouriteVendorsModalComponent", "getFavouriteVendors", "getFavouriteVendors", favVendors);
                }
                else {
                    if (favVendors != undefined && favVendors != null && favVendors.length > 0) {
                        this.favouriteVendors = favVendors;
                        this.filteredFavouriteVendors = favVendors;
                        this.setPage(1);
                    }
                    else {
                        this.favouriteVendors = [];
                    }
                }
                console.log("Favourite Vendors modal component data : ", favVendors);
            },
            error => { });
    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFavouriteVendors.length, page, 6);

        // get current page of items
        this.pagedFavouriteVendors = this.filteredFavouriteVendors.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {
        if (this.filterKey !== '') {
            this.filteredFavouriteVendors = this.favouriteVendors.filter(function (e) {
                return ((e.name && e.name.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.name2 && e.name2.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.number && e.number.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.address && e.address.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.city && e.city.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.state && e.state.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.phone && e.phone.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.zipCode && e.zipCode.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;

            }.bind(this));

            this.setPage(1);
        }
        else {
            this.filteredFavouriteVendors = this.favouriteVendors;
            this.setPage(1);
        }

    }

    removeFavouriteVendors(selectedVendor) {
        this.vendorsService.deleteFavouriteVendors(selectedVendor.number)
            .then(favVendors => {
                if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                    this.notification.errorMessage("FavouriteVendorsModalComponent", "removeFavouriteVendors", "deleteFavouriteVendors", favVendors);
                }
                else {
                    if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                        this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                    }
                    else {
                        this.getFavouriteVendors();
                    }
                }
            },
            error => { });
    }

    onSelectFavouriteVendor(vendor) {
        jQuery("#favoriteVendorsModal").modal("hide");
        this.vendorsService.notifyVendorSelection({ data: vendor });
    }

    ngOnDestroy() {
        this.authGuardsubscription.unsubscribe();
        this.vendorsServicesubscription.unsubscribe();
    }
}