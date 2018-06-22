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
var vendors_service_1 = require("./../vendors/vendors.service");
var auth_guard_1 = require("./../../../_common/auth-guard");
var FavouriteVendorsModalComponent = (function () {
    function FavouriteVendorsModalComponent(notification, commonDataService, pagerService, vendorsService, authGuard) {
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.vendorsService = vendorsService;
        this.authGuard = authGuard;
        // pager object
        this.pager = {};
        this.filterKey = "";
        this.authGuardsubscription = null;
        this.vendorsServicesubscription = null;
        this.filter = function () {
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
        };
        //this.notification.hideNotification();
    }
    FavouriteVendorsModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authGuardsubscription = this.authGuard.AuthenticationCheckUpdated.subscribe(function (d) {
            if (d && (_this.filteredFavouriteVendors == null || _this.filteredFavouriteVendors == undefined)) {
                _this.getFavouriteVendors();
            }
            //this.changeDetectorRef.detectChanges();
        });
        this.vendorsServicesubscription = this.vendorsService.notifyFavouriteVendorChangeEventEmitter.subscribe(function (res) {
            _this.getFavouriteVendors();
        });
    };
    FavouriteVendorsModalComponent.prototype.getFavouriteVendors = function () {
        var _this = this;
        this.filterKey = "";
        this.favouriteVendors = null;
        this.vendorsService.getFavouriteVendors()
            .then(function (favVendors) {
            if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                _this.notification.errorMessage("FavouriteVendorsModalComponent", "getFavouriteVendors", "getFavouriteVendors", favVendors);
            }
            else {
                if (favVendors != undefined && favVendors != null && favVendors.length > 0) {
                    _this.favouriteVendors = favVendors;
                    _this.filteredFavouriteVendors = favVendors;
                    _this.setPage(1);
                }
                else {
                    _this.favouriteVendors = [];
                }
            }
            console.log("Favourite Vendors modal component data : ", favVendors);
        }, function (error) { });
    };
    FavouriteVendorsModalComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFavouriteVendors.length, page, 6);
        // get current page of items
        this.pagedFavouriteVendors = this.filteredFavouriteVendors.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    FavouriteVendorsModalComponent.prototype.removeFavouriteVendors = function (selectedVendor) {
        var _this = this;
        this.vendorsService.deleteFavouriteVendors(selectedVendor.number)
            .then(function (favVendors) {
            if (favVendors.ErrorType != undefined && favVendors.ErrorType != null && favVendors.ErrorType != 200) {
                _this.notification.errorMessage("FavouriteVendorsModalComponent", "removeFavouriteVendors", "deleteFavouriteVendors", favVendors);
            }
            else {
                if (favVendors.errorMessage != null && favVendors.errorMessage != undefined) {
                    _this.notification.showNotification(favVendors.errorMessage.message, favVendors.errorMessage.type);
                }
                else {
                    _this.getFavouriteVendors();
                }
            }
        }, function (error) { });
    };
    FavouriteVendorsModalComponent.prototype.onSelectFavouriteVendor = function (vendor) {
        jQuery("#favoriteVendorsModal").modal("hide");
        this.vendorsService.notifyVendorSelection({ data: vendor });
    };
    FavouriteVendorsModalComponent.prototype.ngOnDestroy = function () {
        this.authGuardsubscription.unsubscribe();
        this.vendorsServicesubscription.unsubscribe();
    };
    return FavouriteVendorsModalComponent;
}());
FavouriteVendorsModalComponent = __decorate([
    core_1.Component({
        selector: "favourite-vendors-modal",
        templateUrl: "./src/app/search/modal/favourite-vendors/favourite-vendors.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        vendors_service_1.VendorsService,
        auth_guard_1.AuthGuard])
], FavouriteVendorsModalComponent);
exports.FavouriteVendorsModalComponent = FavouriteVendorsModalComponent;
//# sourceMappingURL=favourite-vendors.component.js.map