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
var platform_browser_1 = require("@angular/platform-browser");
var notification_service_1 = require("./../../_common/services/notification.service");
var favourites_service_1 = require("./../modal/favourites/favourites.service");
var common_data_service_1 = require("./../../_common/services/common-data.service");
var parts_search_service_1 = require("./parts-search.service");
//import { FavouritesModalComponent } from "./../modal/favourites/favourites.component";
var part_search_entity_1 = require("./../../_entities/part-search.entity");
var router_1 = require("@angular/router");
var customer_component_1 = require("./../../customer/customer.component");
var customer_service_1 = require("./../modal/customer/customer.service");
var cart_service_1 = require("./../../cart/cart.service");
var loader_service_1 = require("./../../_common/services/loader.service");
var partbuyout_component_1 = require("./../modal/partbuyout/partbuyout.component");
var create_part_component_1 = require("./../modal/create-part/create-part.component");
var extend_part_entity_1 = require("./../../_entities/extend-part.entity");
var application_insights_service_1 = require("./../../_common/services/application-insights.service");
var app_insight_part_search_entity_1 = require("./../../_entities/app-insight-part-search.entity");
var app_insight_customer_change_entity_1 = require("../../_entities/app-insight-customer-change.entity");
var app_insight_billing_entity_1 = require("../../_entities/app-insight-billing.entity");
var PartsSearchComponent = (function () {
    function PartsSearchComponent(loader, title, notification, favouritesService, commonDataService, partsSearchService, changeDetectorRef, cartService, router, customerModalService, elementRef, applicationInsightsService) {
        var _this = this;
        this.loader = loader;
        this.title = title;
        this.notification = notification;
        this.favouritesService = favouritesService;
        this.commonDataService = commonDataService;
        this.partsSearchService = partsSearchService;
        this.changeDetectorRef = changeDetectorRef;
        this.cartService = cartService;
        this.router = router;
        this.customerModalService = customerModalService;
        this.elementRef = elementRef;
        this.applicationInsightsService = applicationInsightsService;
        this.isCustomerSelected = false;
        this.cashCustomer = true;
        //customerNumber: string = "";
        this.searchTerm = "";
        this.enablePartBuyoutLink = false;
        this.hasBranch = false;
        this.enableCreatePartLink = false;
        this.hasMessage = false;
        this.createPartMesssage = "";
        this.showCreatePartLoader = false;
        this.sourceLocationType = application_insights_service_1.SourceLocationType;
        this.hasValidCoupon = false;
        this.couponMessage = '';
        this.isshowCouponLoader = false;
        this.couponLoadingMessage = '';
        this.customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe(function (d) {
            var appInsightCustomerChange = Object.assign(new app_insight_customer_change_entity_1.AppInsightCustomerChange(), {
                userId: _this.commonDataService.UserId,
                searchTerm: _this.searchTerm != undefined && _this.searchTerm != null ? _this.searchTerm : "",
                branchNumber: _this.commonDataService.Branch.code,
                cartNumber: _this.commonDataService.CartId != null ? _this.commonDataService.CartId : "",
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch]
            });
            if (d != undefined && d != null) {
                if (d.previousCustomer != undefined && d.previousCustomer != null) {
                    appInsightCustomerChange.previousCustomerNumber = d.previousCustomer.customerNumber;
                    appInsightCustomerChange.previousCustomerName = d.previousCustomer.customerName;
                }
                if (d.newCustomer != undefined && d.newCustomer != null) {
                    appInsightCustomerChange.currentCustomerNumber = d.newCustomer.customerNumber;
                    appInsightCustomerChange.currentCustomerName = d.newCustomer.customerName;
                }
            }
            appInsightCustomerChange.products = '';
            _this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
        });
        this.couponShowSubscription = this.commonDataService.showCouponsModalEventEmitter.subscribe(function (d) {
            _this.couponLoadingMessage = 'Checking coupon availability...';
            _this.isshowCouponLoader = true;
        });
        this.getCouponCompleteSubscription = this.commonDataService.onGetCouponComplete.subscribe(function (d) {
            _this.couponLoadingMessage = '';
            if (d == 0) {
                _this.couponLoadingMessage = "No coupon available";
            }
            _this.isshowCouponLoader = false;
        });
        this.branchSubscription = this.commonDataService.branchUpdated.subscribe(function (d) {
            _this.isCustomerSelected = false;
            _this.customer = null;
            _this.commonDataService.Customer = null;
            _this.branchDataUpdated = d;
            var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                userId: _this.commonDataService.UserId,
                searchTerm: _this.searchTerm,
                customerNumber: _this.commonDataService.Customer.customerNumber,
                customerName: _this.commonDataService.Customer.customerName,
                cartNumber: _this.commonDataService.CartId != null ? _this.commonDataService.CartId : "",
                PONumber: (_this.commonDataService.PONumberValue == null || _this.commonDataService.PONumberValue == undefined) ? "" : _this.commonDataService.PONumberValue,
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch],
                unitNumber: (_this.commonDataService.UnitNumberValue == null || _this.commonDataService.UnitNumberValue == undefined) ? "" : _this.commonDataService.UnitNumberValue
            });
            if (_this.branchDataUpdated != undefined && _this.branchDataUpdated != null) {
                if (_this.branchDataUpdated.previousBranch != undefined && _this.branchDataUpdated.previousBranch != null) {
                    appInsightBilling.previousBranch = _this.branchDataUpdated.previousBranch.code;
                }
                if (_this.branchDataUpdated.newBranch != undefined && _this.branchDataUpdated.newBranch != null) {
                    appInsightBilling.currentBranch = _this.branchDataUpdated.newBranch.code;
                }
            }
            appInsightBilling.products = "";
            _this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
        });
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            _this.initCustomer();
            _this.hasBranch = _this.commonDataService.Branch != null && _this.commonDataService.Branch != undefined;
            _this.loader.loading = false;
        });
        this.customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.onCustomerSelect(res.data);
                console.log("Part search component customer selection subscription data : ", res.data);
            }
        });
        this.subscriptionCreateExtendedPart = this.partsSearchService.notifyCreatePartSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                var extendPartData = Object.assign(new extend_part_entity_1.ExtendPart(), {
                    partNumber: res.data.materialNumber + ':' + res.data.manufacturerNumber,
                    branchCode: _this.commonDataService.Branch.code,
                    sapUserName: _this.commonDataService.UserName,
                    allowReplacedPart: true,
                    isSimulated: false
                });
                _this.showCreatePartLoader = true;
                _this.partsSearchService.createExtendedPart(extendPartData)
                    .then(function (responseMsgResult) {
                    _this.showCreatePartLoader = false;
                    if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                        _this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
                    }
                    else {
                        _this.notification.showMultilineNotification(responseMsgResult.messages);
                        console.log("On part Select Create Extended Part: ", responseMsgResult);
                        _this.loader.loading = false;
                        var externalPartNumber = responseMsgResult.externalPartNumber;
                        if (externalPartNumber != null && externalPartNumber.length > 0) {
                            _this.router.navigate(['parts'], { queryParams: { searchTerm: externalPartNumber } });
                        }
                        else {
                            _this.enableCreatePartLink = false;
                        }
                    }
                }, function (error) { _this.loader.loading = false; _this.showCreatePartLoader = false; });
            }
            else {
                _this.notification.showNotification("No records found to create part.", notification_service_1.NotificationType.Error);
            }
        });
        this.couponSubscription = this.commonDataService.onCouponSelectEventEmitter.subscribe(function (coupon) {
            _this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
            _this.couponMessage = _this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
        });
        this.title.setTitle("Part Search - Parts Link");
        //this.notification.hideNotification();
    }
    PartsSearchComponent.prototype.initCustomer = function () {
        var currentCustomer = this.commonDataService.Customer;
        var defaultCustomer = this.commonDataService.DefaultCustomer;
        if (currentCustomer != null && currentCustomer.customerNumber !== "" && currentCustomer.customerNumber != defaultCustomer.customerNumber) {
            this.customer = currentCustomer;
            this.isCustomerSelected = true;
            this.cashCustomer = false;
        }
        else if (currentCustomer.customerNumber == defaultCustomer.customerNumber) {
            this.cashCustomer = true;
            this.isCustomerSelected = false;
        }
        this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
        var coupon = this.commonDataService.Coupons;
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
    };
    PartsSearchComponent.prototype.ngOnInit = function () {
        this.isCustomerSelected = false;
        this.hasBranch = this.commonDataService.Branch != null && this.commonDataService.Branch != undefined;
        this.initCustomer();
    };
    PartsSearchComponent.prototype.getCartCount = function (CNumber) {
        var _this = this;
        this.cartCount = 0;
        //this.changeDetectorRef.detectChanges();
        //
        this.cartService.CartCount(CNumber, this.commonDataService.Branch.code, this.commonDataService.UserId)
            .then(function (count) {
            if (count.ErrorType != undefined && count.ErrorType != null && count.ErrorType != 200) {
                _this.notification.errorMessage("PartsSearchComponent", "getCartCount", "CartCount", count);
            }
            else {
                _this.cartCount = count.cartCount;
            }
            console.log("Part search component cart count : ", count);
            //this.changeDetectorRef.detectChanges();
        }, function (error) {
            //
        });
    };
    PartsSearchComponent.prototype.addToFavourites = function (selectedCustomer) {
        var _this = this;
        //
        var favCustomer = {
            UserId: this.commonDataService.UserId,
            CustomerId: selectedCustomer.customerId,
            CustomerName: this.commonDataService.Customer.customerName,
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            StreetAddress: selectedCustomer.streetAddress,
            City: selectedCustomer.city,
            State: selectedCustomer.state,
            PostalCode: selectedCustomer.postalCode,
            PhoneNumber: selectedCustomer.phoneNumber,
            AccountManagerName: selectedCustomer.accountManagerName,
            TruckNumber: "" // currently not available
        };
        this.favouritesService.CreateFavourites(favCustomer)
            .then(function (favCustomers) {
            if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                _this.notification.errorMessage("PartsSearchComponent", "addToFavourites", "CreateFavourites", favCustomers);
            }
            else {
                if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                    _this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                }
                else {
                    //this.favouritesModalComponent.getFavourites();
                    favCustomers.isFavourite = true;
                    _this.commonDataService.Customer = favCustomers;
                }
            }
            console.log("Part search component add to favourite : ", favCustomers);
            //this.getCartCount(favCustomers.customerNumber);
        }, function (error) { });
    };
    PartsSearchComponent.prototype.removeFavourites = function (selectedCustomer) {
        var _this = this;
        this.favouritesService.DeleteFavourites(selectedCustomer.customerNumber)
            .then(function (favCustomers) {
            if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                _this.notification.errorMessage("PartsSearchComponent", "removeFavourites", "DeleteFavourites", favCustomers);
            }
            else {
                if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                    _this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                }
                else {
                    //this.favouritesModalComponent.getFavourites();
                    var customer = _this.commonDataService.Customer;
                    customer.isFavourite = false;
                    _this.commonDataService.Customer = customer;
                }
            }
            console.log("Part search component remove favourite : ", favCustomers);
        }, function (error) { });
    };
    PartsSearchComponent.prototype.useDifferentCustomer = function () {
        this.cashCustomer = true;
        if (this.customerComponent) {
            this.customerComponent.customerNumber = "";
            this.customerComponent.advCustomerName = "";
            this.customerComponent.advCity = "";
            this.customerComponent.advState = "";
            this.customerComponent.advPostalCode = "";
            this.customerComponent.advPhoneNumber = "";
        }
        this.isCustomerSelected = false;
        this.commonDataService.Customer = null;
        this.commonDataService.Coupons = null;
        this.commonDataService.CouponVendors = null;
        //this.changeDetectorRef.detectChanges();
        //this.getCartCount("0000200000");
    };
    PartsSearchComponent.prototype.onDefaultCustomerChange = function (e) {
        this.setCustomer(e.target.checked);
        this.customerComponent.PayerInValidInBranch = false;
    };
    PartsSearchComponent.prototype.setCustomer = function (isDefaultCustomer) {
        if (isDefaultCustomer == true) {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
            this.loader.loading = true;
            this.cashCustomer = true;
            this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
            if (this.customerComponent) {
                this.customerComponent.hasMessage = false;
                this.customerComponent.customerMesssage = "";
                this.customerComponent.customerNumber = "";
                this.customerComponent.advCustomerName = "";
                this.customerComponent.advCity = "";
                this.customerComponent.advState = "";
                this.customerComponent.advPostalCode = "";
                this.customerComponent.advPhoneNumber = "";
                this.customerComponent.isDefaultCustomerChecked = true;
                this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').placeholder = "Customer number";
            }
        }
        else {
            if (this.customerComponent) {
                this.customerComponent.isDefaultCustomerChecked = false;
                this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').placeholder = "Customer number is required.";
                this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').focus();
            }
        }
        //this.changeDetectorRef.detectChanges();
    };
    PartsSearchComponent.prototype.partSearch = function () {
        var _this = this;
        this.enablePartBuyoutLink = false;
        this.enableCreatePartLink = false;
        if (this.searchTerm !== undefined && this.searchTerm != null && this.searchTerm != "") {
            if (this.cashCustomer) {
                this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
            }
            var searchData = Object.assign(new part_search_entity_1.PartSearch(), {
                partSearchTerm: this.searchTerm,
                branchCode: this.commonDataService.Branch.code,
                customerNumber: this.commonDataService.Customer.customerNumber,
                includePriceAndAvailability: false,
                isCountCheck: true,
                pageNumber: 1,
                pageSize: 100,
                includeFacets: false,
                userId: this.commonDataService.UserId,
                Facet: Object.assign(new part_search_entity_1.Facet(), {})
            });
            this.loader.loading = true;
            this.partsSearchService.getPartCount(searchData)
                .then(function (c) {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    _this.notification.errorMessage("PartsSearchComponent", "partSearch", "getPartCount", c);
                }
                else {
                    if (c.isExists) {
                        _this.router.navigate(['parts'], { queryParams: { searchTerm: _this.searchTerm, src: application_insights_service_1.SourceLocationType.PartSearch } });
                        var sourceName = "PartsSearchComponent_partSearch_getPartCount";
                        var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                        var appInsightPartSearch = Object.assign(new app_insight_part_search_entity_1.AppInsightPartSearch(), {
                            userId: _this.commonDataService.UserId,
                            searchTerm: _this.searchTerm,
                            results: JSON.stringify(c),
                            customerNumber: _this.commonDataService.Customer.customerNumber,
                            branchNumber: _this.commonDataService.Branch.code,
                            cartNumber: _this.commonDataService.CartId,
                            source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch],
                            plMetricName: sourceName
                        });
                        _this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);
                    }
                    else {
                        _this.notification.showNotification("Part not found.", notification_service_1.NotificationType.Error);
                        _this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
                        _this.enablePartBuyoutLink = true;
                        _this.enableCreatePartLink = true;
                    }
                }
                console.log("Part search component get part count : ", c);
                _this.loader.loading = false;
            }, function (error) { _this.loader.loading = false; });
        }
        //else {
        //    this.notification.showNotification("Please provide part search term.", NotificationType.Info);
        //}
    };
    PartsSearchComponent.prototype.createPart = function () {
        var _this = this;
        var extendPartData = Object.assign(new extend_part_entity_1.ExtendPart(), {
            partNumber: this.searchTerm,
            branchCode: this.commonDataService.Branch.code,
            sapUserName: this.commonDataService.UserName,
            allowReplacedPart: true,
            isSimulated: false
        });
        this.showCreatePartLoader = true;
        this.partsSearchService.createExtendedPart(extendPartData)
            .then(function (responseMsgResult) {
            _this.showCreatePartLoader = false;
            if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                _this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
            }
            else {
                _this.partsSearchService.notifyShowCreateModal({ data: responseMsgResult });
                console.log("Create Extended Part: ", responseMsgResult);
                _this.loader.loading = false;
            }
        }, function (error) { _this.loader.loading = false; _this.showCreatePartLoader = false; });
    };
    PartsSearchComponent.prototype.hideNotification = function () {
        this.notification.hideNotification();
        this.partBuyoutModalComponent.isVendorSelected = false;
        this.partBuyoutModalComponent.vendor = null;
    };
    PartsSearchComponent.prototype.onCustomerSelect = function (customer) {
        console.log("Part search component on customer select : ", customer);
        this.customer = customer;
        this.isCustomerSelected = true;
        this.commonDataService.Customer = this.customer;
        this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
        //this.changeDetectorRef.detectChanges();
        this.customerModalService.notifyShowMSCPayerCustomerModal({ data: this.customer });
    };
    PartsSearchComponent.prototype.onVendorSelect = function (vendor) { };
    PartsSearchComponent.prototype.onCustomerSearchCriteriaChange = function (data) {
        this.cashCustomer = data;
        if (data == true && (this.customerComponent.customerNumber == this.commonDataService.DefaultCustomer.customerNumber)) {
            this.setCustomer(this.cashCustomer);
        }
        this.customerComponent.PayerInValidInBranch = false;
    };
    PartsSearchComponent.prototype.onSearchTermKeypress = function (event) {
        if (event.keyCode == 13 && this.searchTerm.trim() != "") {
            this.partSearch();
        }
        this.enableCreatePartLink = false;
    };
    PartsSearchComponent.prototype.searchChange = function () {
        this.enableCreatePartLink = false;
        this.enablePartBuyoutLink = false;
    };
    PartsSearchComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerModalSubscription.unsubscribe();
        this.branchSubscription.unsubscribe();
        this.subscriptionCreateExtendedPart.unsubscribe();
        this.couponSubscription.unsubscribe();
        this.couponShowSubscription.unsubscribe();
        this.getCouponCompleteSubscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
    };
    return PartsSearchComponent;
}());
__decorate([
    core_1.ViewChild('customerPanel'),
    __metadata("design:type", customer_component_1.CustomerComponent)
], PartsSearchComponent.prototype, "customerComponent", void 0);
__decorate([
    core_1.ViewChild('partBuyoutModal'),
    __metadata("design:type", partbuyout_component_1.PartBuyoutModalComponent)
], PartsSearchComponent.prototype, "partBuyoutModalComponent", void 0);
__decorate([
    core_1.ViewChild('createPartModal'),
    __metadata("design:type", create_part_component_1.CreatePartModalComponent)
], PartsSearchComponent.prototype, "createPartModalComponent", void 0);
PartsSearchComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/search/parts/parts-search.component.html?v=" + new Date().getTime(),
        providers: [favourites_service_1.FavouritesService, parts_search_service_1.PartsSearchService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        platform_browser_1.Title,
        notification_service_1.NotificationService,
        favourites_service_1.FavouritesService,
        common_data_service_1.CommonDataService,
        parts_search_service_1.PartsSearchService,
        core_1.ChangeDetectorRef,
        cart_service_1.CartService,
        router_1.Router,
        customer_service_1.CustomerModalService,
        core_1.ElementRef,
        application_insights_service_1.ApplicationInsightsService])
], PartsSearchComponent);
exports.PartsSearchComponent = PartsSearchComponent;
//# sourceMappingURL=parts-search.component.js.map