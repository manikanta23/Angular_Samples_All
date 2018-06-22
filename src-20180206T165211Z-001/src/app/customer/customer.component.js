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
var loader_service_1 = require("./../_common/services/loader.service");
var notification_service_1 = require("./../_common/services/notification.service");
var customer_search_entity_1 = require("./../_entities/customer-search.entity");
var common_data_service_1 = require("./../_common/services/common-data.service");
var parts_search_service_1 = require("./../search/parts/parts-search.service");
var customer_component_1 = require("./../search/modal/customer/customer.component");
var customer_service_1 = require("./../search/modal/customer/customer.service");
var cart_service_1 = require("./../cart/cart.service"); // for notification
var app_insight_customer_search_entity_1 = require("../_entities/app-insight-customer-search.entity");
var app_insight_customer_search_term_entity_1 = require("../_entities/app-insight-customer-search-term.entity");
var application_insights_service_1 = require("../_common/services/application-insights.service");
var router_1 = require("@angular/router");
var coupon_service_1 = require("./../search/modal/coupon/coupon.service");
var CustomerComponent = (function () {
    function CustomerComponent(loader, notification, commonDataService, partsSearchService, changeDetectorRef, customerModalService, cartService, elementRef, applicationInsightsService, activatedRoute, couponService) {
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.partsSearchService = partsSearchService;
        this.changeDetectorRef = changeDetectorRef;
        this.customerModalService = customerModalService;
        this.cartService = cartService;
        this.elementRef = elementRef;
        this.applicationInsightsService = applicationInsightsService;
        this.activatedRoute = activatedRoute;
        this.couponService = couponService;
        this.source = "";
        this.customerNumber = "";
        this.advCustomerName = "";
        this.advCity = "";
        this.advState = "";
        this.advPostalCode = "";
        this.advPhoneNumber = "";
        //customers: any;
        //customer: any;
        this.hasMessage = false;
        this.PayerInValidInBranch = false;
        this.customerMesssage = "";
        this.isDefaultCustomerChecked = true;
        this.onCustomerSearchDataChange = new core_1.EventEmitter();
        this.callbackCustomerSelect = new core_1.EventEmitter();
        //this.notification.hideNotification();
    }
    CustomerComponent.prototype.ngOnInit = function () { };
    CustomerComponent.prototype.customerSearch = function () {
        var _this = this;
        if (this.customerNumber || this.advCustomerName || this.advCity || this.advState || this.advPostalCode || this.advPhoneNumber) {
            this.hasMessage = false;
            this.customerMesssage = "";
            this.loader.loading = true;
            this.PayerInValidInBranch = false;
            console.log("Customer component customer number: ", this.customerNumber);
            var customerSearch = Object.assign(new customer_search_entity_1.CustomerSearch(), {
                CustomerType: "AG",
                CustomerNumber: this.customerNumber,
                BranchCode: this.commonDataService.Branch.code,
                AccountGroups: ["Z001", "Z002"],
                CustomerName: this.advCustomerName.toUpperCase(),
                City: this.advCity.toUpperCase(),
                State: this.advState.toUpperCase(),
                PostalCode: this.advPostalCode.length < 9 ? this.advPostalCode.replace(/-/g, '*') + '*' : this.advPostalCode.replace(/-/g, '*'),
                PhoneNumber: this.advPhoneNumber,
                UserId: this.commonDataService.UserId
            });
            var customerSearchTerm_1 = Object.assign(new app_insight_customer_search_term_entity_1.AppInsightCustomerSearchTerm(), {
                customerNumber: this.customerNumber,
                customerName: this.advCustomerName,
                city: this.advCity,
                state: this.advState,
                postalCode: this.advPostalCode,
                phoneNumber: this.advPhoneNumber
            });
            var isCustomerNumberSearch = this.customerNumber !== undefined && this.customerNumber !== null && this.customerNumber !== "";
            var sourceValue_1 = '';
            if (isCustomerNumberSearch) {
                if (application_insights_service_1.SourceLocationType[this.source] == application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch]) {
                    sourceValue_1 = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch_CustomerSearch];
                }
                else {
                    sourceValue_1 = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.HeaderSearch_CustomerSearch];
                }
            }
            else {
                if (application_insights_service_1.SourceLocationType[this.source] == application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch]) {
                    sourceValue_1 = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartSearch_AdvancedCustomerSearch];
                }
                else {
                    sourceValue_1 = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.HeaderSearch_AdvancedCustomerSearch];
                }
            }
            this.partsSearchService.getCustomers(customerSearch)
                .then(function (c) {
                var searchTerm = _this.activatedRoute.snapshot.queryParams['searchTerm'];
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    _this.notification.errorMessage("CustomerComponent", "customerSearch", "getCustomers", c);
                }
                else {
                    var sourceName = application_insights_service_1.SourceLocationType[_this.source] + "_" + "CustomerComponent_customerSearch_getCustomers";
                    var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                    if (c.customers == null || c.customers.length == 0) {
                        //this.notification.showNotification("No record found", NotificationType.Info);
                        _this.hasMessage = true;
                        _this.customerMesssage = "No customer found";
                        var appInsightCustomerSearch = Object.assign(new app_insight_customer_search_entity_1.AppInsightCustomerSearch(), {
                            userId: _this.commonDataService.UserId,
                            branchNumber: _this.commonDataService.Branch.code,
                            searchTerm: searchTerm != undefined && searchTerm != null ? searchTerm : "",
                            customerSearchTerm: _this.applicationInsightsService.getAppInsightSerializedJson(customerSearchTerm_1),
                            source: sourceValue_1,
                            //clickingFavorites: false,
                            //clickingAdvancedSearch: false,
                            result: _this.applicationInsightsService.getAppInsightSerializedJson(c),
                            customerNotFound: true,
                            plMetricName: sourceName
                        });
                        _this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
                    }
                    else {
                        _this.hasMessage = false;
                        _this.customerMesssage = "";
                        if (c.customers.length == 1) {
                            if (c.customers[0].payerNotValidInBranch == false) {
                                _this.callbackCustomerSelect.emit(c.customers[0]);
                                _this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                            }
                            else if (c.customers[0].payerNotValidInBranch == true) {
                                _this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                            }
                            _this.commonDataService.Coupons = null;
                            _this.commonDataService.CouponVendors = null;
                            _this.commonDataService.showCouponsModalEventEmitter.emit();
                            var appInsightCustomerSearch = Object.assign(new app_insight_customer_search_entity_1.AppInsightCustomerSearch(), {
                                userId: _this.commonDataService.UserId,
                                branchNumber: _this.commonDataService.Branch.code,
                                searchTerm: searchTerm != undefined && searchTerm != null ? searchTerm : "",
                                customerSearchTerm: _this.applicationInsightsService.getAppInsightSerializedJson(customerSearchTerm_1),
                                source: sourceValue_1,
                                //clickingFavorites: false,
                                //clickingAdvancedSearch: false,
                                result: _this.applicationInsightsService.getAppInsightSerializedJson(c),
                                customerNotFound: false,
                                plMetricName: sourceName
                            });
                            _this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
                        }
                        else if (c.customers.length > 1) {
                            //this.customers = c.customers;                        
                            //this.customerModalComponent.showModal();
                            _this.customerModalService.notifyShowCustomerModal({ data: { customers: c.customers, customerSearchTerm: customerSearchTerm_1 } });
                        }
                    }
                }
                _this.loader.loading = false;
                //this.changeDetectorRef.detectChanges();
                console.log("Customer component : ", c);
            }, function (error) {
                _this.loader.loading = false;
                _this.hasMessage = false;
                _this.customerMesssage = "";
                _this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').focus();
            });
            //if (this.customerMesssage != "No customer found")
            //{                
            //    this.couponService.getCoupons(null, this.commonDataService.UserId, this.customerNumber, this.commonDataService.Branch.code)
            //        .then(cp => {
            //            if (cp.ErrorType != undefined && cp.ErrorType != null && cp.ErrorType != 200) {
            //                this.notification.errorMessage("CustomerComponent", "customerSearch", "getCoupons", cp);
            //            }
            //            else {
            //                if (cp != null && cp.length >= 1) {
            //                    this.isCouponApply = true;
            //                    this.couponDiscount = cp[0].couponDiscountFlatAmount;
            //                }
            //            }
            //        },
            //        error => {
            //        });
            //}
        }
    };
    CustomerComponent.prototype.onCustomerKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    };
    CustomerComponent.prototype.onCustomerKeydown = function (event) {
        if (event.keyCode == 9) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.onCustomerNameKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.onPhoneNoKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.onPostalCodeKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.onCityKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.onStateKeypress = function (event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    };
    CustomerComponent.prototype.change = function () {
        if (!this.customerNumber && !this.advCustomerName && !this.advCity && !this.advState && !this.advPostalCode && !this.advPhoneNumber) {
            this.onCustomerSearchDataChange.emit(true);
        }
        else if (this.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            //this.customerNumber = "";
            this.onCustomerSearchDataChange.emit(true);
        }
        else {
            this.onCustomerSearchDataChange.emit(false);
            this.PayerInValidInBranch = false;
        }
    };
    CustomerComponent.prototype.viewFavorites = function () {
        jQuery('body').on('shown.bs.modal', '#favoritesModal', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    };
    CustomerComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
    };
    return CustomerComponent;
}());
__decorate([
    core_1.ViewChild('customerModal'),
    __metadata("design:type", customer_component_1.CustomerModalComponent)
], CustomerComponent.prototype, "customerModalComponent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CustomerComponent.prototype, "source", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CustomerComponent.prototype, "onCustomerSearchDataChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], CustomerComponent.prototype, "callbackCustomerSelect", void 0);
CustomerComponent = __decorate([
    core_1.Component({
        selector: "customer-panel",
        templateUrl: "./src/app/customer/customer.component.html?v=" + new Date().getTime(),
        providers: [application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        parts_search_service_1.PartsSearchService,
        core_1.ChangeDetectorRef,
        customer_service_1.CustomerModalService,
        cart_service_1.CartService,
        core_1.ElementRef,
        application_insights_service_1.ApplicationInsightsService,
        router_1.ActivatedRoute,
        coupon_service_1.CouponService])
], CustomerComponent);
exports.CustomerComponent = CustomerComponent;
//# sourceMappingURL=customer.component.js.map