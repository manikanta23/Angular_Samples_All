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
var router_1 = require("@angular/router");
var common_data_service_1 = require("./../../_common/services/common-data.service");
var loader_service_1 = require("./../../_common/services/loader.service");
var notification_service_1 = require("./../../_common/services/notification.service");
var cart_service_1 = require("./../../cart/cart.service");
var cart_entity_1 = require("./../../_entities/cart.entity");
var customer_component_1 = require("./../../customer/customer.component");
var customer_service_1 = require("./../modal/customer/customer.service");
var parts_search_service_1 = require("./../parts/parts-search.service");
var common_1 = require("@angular/common");
var part_search_entity_1 = require("./../../_entities/part-search.entity");
var application_insights_service_1 = require("./../../_common/services/application-insights.service");
var app_insight_part_search_entity_1 = require("./../../_entities/app-insight-part-search.entity");
//import MyFunc = require('./../../cart/cart.component');
var _ = require("lodash");
var router_2 = require("@angular/router");
var app_insight_quote_entity_1 = require("../../_entities/app-insight-quote.entity");
var HeaderSearchComponent = (function () {
    function HeaderSearchComponent(loader, activatedRoute, router, notification, cartService, partsSearchService, 
        // public cartComponent: CartComponent,
        commonDataService, changeDetectorRef, elementRef, location, customerModalService, applicationInsightsService) {
        var _this = this;
        this.loader = loader;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.notification = notification;
        this.cartService = cartService;
        this.partsSearchService = partsSearchService;
        this.commonDataService = commonDataService;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.location = location;
        this.customerModalService = customerModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.searchTerm = "";
        this.customerName = this.commonDataService.Customer.customerName;
        this.customerNumber = this.commonDataService.Customer.customerNumber;
        this.couponMessage = '';
        this.searchData = new cart_entity_1.CartSearch();
        this.cashCustomer = true;
        this.queryParameterSubscription = null;
        this.subscription = null;
        this.customerModalSubscription = null;
        this.cartCountSubscription = null;
        this.cartMessage = "";
        this.showCartLoader = false;
        this.isSearchChange = false;
        this.enablePartBuyoutLink = false;
        this.sourceLocationType = application_insights_service_1.SourceLocationType;
        this.hasValidCoupon = false;
        this.isshowCouponLoader = false;
        this.couponLoadingMessage = '';
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
        this.couponSubscription = this.commonDataService.onCouponSelectEventEmitter.subscribe(function (coupon) {
            _this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
            _this.couponMessage = _this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
        });
        this.routeChangeSubscription = this.router.events.subscribe(function (event) {
            // this.getCarts();
            _this.navigationInterceptor(event);
        });
        //this.notification.hideNotification();
    }
    // Shows and hides the loading spinner during RouterEvent changes
    HeaderSearchComponent.prototype.navigationInterceptor = function (event) {
        if (event instanceof router_2.NavigationStart) {
        }
        if (event instanceof router_2.NavigationEnd) {
            this.getCarts();
        }
        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof router_2.NavigationCancel) {
        }
        if (event instanceof router_2.NavigationError) {
        }
    };
    HeaderSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCarts();
        this.checkCustomerCouponValidity();
        var customerData = this.commonDataService.Customer;
        if (customerData.customerNumber != this.commonDataService.DefaultCustomer.customerNumber) {
            this.cashCustomer = false;
        }
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            _this.checkCustomerCouponValidity();
            _this.getCarts();
            _this.loader.loading = false;
        });
        this.branchSubscription = this.commonDataService.branchUpdated
            .subscribe(function (d) {
            _this.isCustomerSelected = false;
            _this.customer = null;
            _this.commonDataService.Customer = null;
        });
        this.customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.onCustomerSelect(res.data);
                //this.getCarts();
                console.log("Header search component customer selection subscribed data : ", res.data);
            }
        });
        this.queryParameterSubscription = this.activatedRoute.queryParams.subscribe(function (params) {
            _this.searchTerm = params['searchTerm'];
            //console.log(this.searchTerm);
        });
        this.cartCountSubscription = this.cartService.notifyCartChangeEventEmitter.subscribe(function (d) {
            _this.getCarts();
            _this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
            _this.elementRef.nativeElement.querySelector('input#txtSearchTerm').select();
        });
    };
    HeaderSearchComponent.prototype.checkCustomerCouponValidity = function () {
        this.couponMessage = '';
        var customerData = this.commonDataService.Customer;
        this.customerName = customerData.customerName;
        this.customerNumber = customerData.customerNumber;
        var coupon = this.commonDataService.Coupons;
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
        if (customerData.customerNumber != this.commonDataService.DefaultCustomer.customerNumber) {
            this.cashCustomer = false;
        }
    };
    HeaderSearchComponent.prototype.onSearchTermKeypress = function (event) {
        if (event.keyCode == 13 && this.searchTerm.trim() != '') {
            this.partSearch();
        }
    };
    HeaderSearchComponent.prototype.searchChange = function () {
        this.isSearchChange = true;
        this.commonDataService.headerSearchChange.emit(this.isSearchChange);
    };
    HeaderSearchComponent.prototype.hideNotification = function () {
        this.notification.hideNotification();
    };
    HeaderSearchComponent.prototype.partSearch = function () {
        var _this = this;
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
        this.loader.loading = this.searchTerm != this.activatedRoute.snapshot.queryParams['searchTerm'];
        this.partsSearchService.getPartCount(searchData)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("HeaderSearchComponent", "partSearch", "getPartCount", c);
            }
            else {
                if (c.isExists) {
                    if (_this.searchTerm !== undefined && _this.searchTerm != null && _this.searchTerm != "") {
                        _this.router.navigate(['parts'], { queryParams: { searchTerm: _this.searchTerm, src: application_insights_service_1.SourceLocationType.HeaderSearch } });
                        var sourceName = "HeaderSearchComponent_partSearch_getPartCount";
                        var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                        var appInsightPartSearch = Object.assign(new app_insight_part_search_entity_1.AppInsightPartSearch(), {
                            userId: _this.commonDataService.UserId,
                            searchTerm: _this.searchTerm,
                            results: JSON.stringify(c),
                            customerNumber: _this.commonDataService.Customer.customerNumber,
                            branchNumber: _this.commonDataService.Branch.code,
                            cartNumber: _this.commonDataService.CartId,
                            source: application_insights_service_1.SourceLocationType[_this.sourceLocationType.HeaderSearch],
                            plMetricName: sourceName
                        });
                        _this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);
                    }
                }
                else {
                    _this.notification.showNotification("Part not found.", notification_service_1.NotificationType.Error);
                    _this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
                    _this.enablePartBuyoutLink = true;
                    _this.commonDataService.partCreated.emit(_this.searchTerm);
                }
            }
            console.log("Header search component get part count : ", c);
            _this.loader.loading = false;
        }, function (error) { _this.loader.loading = false; });
    };
    HeaderSearchComponent.prototype.getCarts = function () {
        var _this = this;
        //
        this.cartsData = null;
        this.showCartLoader = true;
        //this.changeDetectorRef.detectChanges();
        this.cartMessage = "loading cart items ...";
        var searchData = Object.assign(new cart_entity_1.CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId
        });
        this.cartService.getCarts(searchData)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("HeaderSearchComponent", "getCarts", "getCarts", c);
            }
            else {
                if (!c || !c.carts || c.carts.length == 0) {
                    _this.cartsData = null;
                    _this.cartCount = 0;
                    _this.cartMessage = "cart item is not available.";
                }
                else {
                    var carts = c.carts;
                    _this.commonDataService.CartId = c.carts[0].cartId;
                    _this.cartsData = _.reject(carts, function (item) {
                        return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    if (c.hasError) {
                        _this.notification.showMultilineNotification(c.errorMessages);
                    }
                    _this.cartCount = _this.cartsData.length;
                    _this.cartId = _this.cartsData.length > 0 ? c.carts[0].cartId : null;
                    _this.commonDataService.CartId = _this.cartId;
                }
            }
            _this.showCartLoader = false;
            //this.changeDetectorRef.detectChanges();
            console.log("Header search component Cart Data : ", c);
        }, function (error) {
            _this.showCartLoader = false;
            _this.cartsData = null;
            _this.cartCount = 0;
            _this.cartMessage = "An error occurred. Please try again later.";
        });
    };
    HeaderSearchComponent.prototype.removeCartItems = function (selectedCartItem) {
        var _this = this;
        var deleteCartItems = new Array();
        var _item = {
            cartItemId: selectedCartItem.cartItemId,
        };
        deleteCartItems.push(_item);
        var removeCartItemsData = {
            cartId: this.commonDataService.CartId,
            isPickupDeliveryType: false,
            deleteCartItems: deleteCartItems
        };
        if (selectedCartItem.couponId != undefined && selectedCartItem.couponId != null && selectedCartItem.couponId != '') {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
        }
        this.cartService.DeleteCartItem(removeCartItemsData)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("HeaderSearchComponent", "removeCartItems", "DeleteCartItem", c);
            }
            else {
                _this.getCarts();
            }
        }, function (error) { });
        var sourceName = "HeaderSearchComponent_removeCartItems";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightQuote = Object.assign(new app_insight_quote_entity_1.AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(selectedCartItem, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
    };
    HeaderSearchComponent.prototype.onDefaultCustomerChange = function (e) {
        this.setCustomer(e.target.checked);
        this.customerComponent.PayerInValidInBranch = false;
    };
    HeaderSearchComponent.prototype.setCustomer = function (isDefaultCustomer) {
        if (isDefaultCustomer == true) {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
            this.loader.loading = true;
            this.cashCustomer = true;
            this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
            this.emptyCustomerSearchCriteria();
            jQuery("#ddlHeaderCustomer").removeClass("open");
            if (this.customerComponent) {
                this.customerComponent.isDefaultCustomerChecked = true;
            }
            this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').placeholder = "Customer number";
        }
        else {
            this.cashCustomer = false;
            //this.commonDataService.Customer = null;
            if (this.customerComponent) {
                this.customerComponent.isDefaultCustomerChecked = false;
                this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').placeholder = "Customer number is required.";
                this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').focus();
            }
        }
        //this.changeDetectorRef.detectChanges();
    };
    HeaderSearchComponent.prototype.onCustomerSelect = function (customer) {
        console.log("Header search component on customer select : ", customer);
        this.customer = customer;
        this.isCustomerSelected = true;
        this.commonDataService.Customer = this.customer;
        jQuery("#ddlHeaderCustomer").removeClass("open");
        this.emptyCustomerSearchCriteria();
        //this.changeDetectorRef.detectChanges();
        this.customerModalService.notifyShowMSCPayerCustomerModal({ data: this.customer });
    };
    HeaderSearchComponent.prototype.onCustomerSearchCriteriaChange = function (data) {
        this.cashCustomer = data;
        if (data == true && (this.customerComponent.customerNumber == this.commonDataService.DefaultCustomer.customerNumber)) {
            this.setCustomer(this.cashCustomer);
        }
        this.customerComponent.PayerInValidInBranch = false;
    };
    HeaderSearchComponent.prototype.emptyCustomerSearchCriteria = function () {
        if (this.customerComponent) {
            this.customerComponent.hasMessage = false;
            this.customerComponent.customerMesssage = "";
            this.customerComponent.customerNumber = "";
            this.customerComponent.advCustomerName = "";
            this.customerComponent.advCity = "";
            this.customerComponent.advState = "";
            this.customerComponent.advPostalCode = "";
            this.customerComponent.advPhoneNumber = "";
        }
    };
    HeaderSearchComponent.prototype.dropDownLinkClick = function (e) {
        console.log("Header search component dropdownlink click : ", e);
    };
    HeaderSearchComponent.prototype.calculateCartTotals = function () {
        var totalPrice = 0;
        this.cartsData.forEach(function (d) {
            if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                //totalPrice += d.quantity * d.finalPrice;
                totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
            }
        });
        return totalPrice;
    };
    HeaderSearchComponent.prototype.onMyCartClick = function () {
        this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "none";
        this.router.navigate(['/cart']);
    };
    HeaderSearchComponent.prototype.disableScrollBar = function () {
        if (this.elementRef.nativeElement.querySelector('.my-cart')) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "block";
        }
    };
    HeaderSearchComponent.prototype.enableScrollBar = function () {
        if (this.elementRef.nativeElement.querySelector('.my-cart')) {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
        this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "none";
    };
    HeaderSearchComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerModalSubscription.unsubscribe();
        this.queryParameterSubscription.unsubscribe();
        this.cartCountSubscription.unsubscribe();
        this.branchSubscription.unsubscribe();
        this.couponSubscription.unsubscribe();
        this.routeChangeSubscription.unsubscribe();
    };
    return HeaderSearchComponent;
}());
__decorate([
    core_1.ViewChild('customerPanel'),
    __metadata("design:type", customer_component_1.CustomerComponent)
], HeaderSearchComponent.prototype, "customerComponent", void 0);
HeaderSearchComponent = __decorate([
    core_1.Component({
        selector: "header-search",
        templateUrl: "./src/app/search/header/header-search.component.html?v=" + new Date().getTime(),
        providers: [parts_search_service_1.PartsSearchService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        router_1.ActivatedRoute,
        router_1.Router,
        notification_service_1.NotificationService,
        cart_service_1.CartService,
        parts_search_service_1.PartsSearchService,
        common_data_service_1.CommonDataService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        common_1.Location,
        customer_service_1.CustomerModalService,
        application_insights_service_1.ApplicationInsightsService])
], HeaderSearchComponent);
exports.HeaderSearchComponent = HeaderSearchComponent;
//# sourceMappingURL=header-search.component.js.map