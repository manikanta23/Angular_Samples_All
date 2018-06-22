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
var cart_service_1 = require("./cart.service");
var router_1 = require("@angular/router");
var common_data_service_1 = require("./../_common/services/common-data.service");
var customer_search_entity_1 = require("./../_entities/customer-search.entity");
var parts_search_service_1 = require("./../search/parts/parts-search.service");
var customer_service_1 = require("./../search/modal/customer/customer.service");
var pager_service_1 = require("./../_common/services/pager.service");
var loader_service_1 = require("./../_common/services/loader.service");
var notification_service_1 = require("./../_common/services/notification.service");
var _ = require("lodash");
var OpenCartComponent = (function () {
    function OpenCartComponent(loader, notification, commonDataService, pagerService, cartService, partsSearchService, customerModalService, router, activatedRoute) {
        var _this = this;
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.cartService = cartService;
        this.partsSearchService = partsSearchService;
        this.customerModalService = customerModalService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.openCarts = null;
        this.showOpenCartLoader = false;
        // pager object
        this.pager = {};
        this.filterByBranch = false;
        this.filterByCustomer = false;
        this.selectedBranchCode = this.commonDataService.Branch.code;
        this.selectedCustomerNumber = this.commonDataService.Customer.customerNumber;
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            _this.selectedBranchCode = _this.commonDataService.Branch.code;
            _this.selectedCustomerNumber = _this.commonDataService.Customer.customerNumber;
            //Once user logged in then show all open carts for user (i.e. at logged/first time dont apply any filter).
            //And if user searches any customer, then apply customer search filter.
            if ((_this.selectedCustomerNumber != _this.commonDataService.DefaultCustomer.customerNumber) && _this.filterByCustomer == false) {
                _this.filterByCustomer = true;
            }
            if (_this.filterByCustomer || _this.filterByBranch) {
                _this.filterCart();
            }
        });
        //this.notification.hideNotification();
    }
    OpenCartComponent.prototype.ngOnInit = function () {
        this.getOpenCarts();
    };
    OpenCartComponent.prototype.getOpenCarts = function () {
        var _this = this;
        this.showOpenCartLoader = true;
        this.cartService.getOpenCarts(this.commonDataService.UserId)
            .then(function (oc) {
            _this.showOpenCartLoader = false;
            if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                _this.notification.errorMessage("OpenCartComponent", "getOpenCarts", "getOpenCarts", oc);
            }
            else {
                _this.openCarts = oc.openCarts;
                _this.filteredOpenCarts = oc.openCarts;
                console.log("filteredOpenCarts Data : ", _this.filteredOpenCarts);
                _this.setPage(1);
            }
            console.log("Open Carts Data : ", oc);
        }, function (error) { _this.showOpenCartLoader = false; });
    };
    OpenCartComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredOpenCarts.length, page, 10);
        // get current page of items
        this.pagedOpenCarts = this.filteredOpenCarts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    // filtering by branch and customer number 
    OpenCartComponent.prototype.filterCart = function () {
        var branchCode = this.commonDataService.Branch.code;
        var customerNumber = this.commonDataService.Customer.customerNumber;
        var paddedCustomerNumber = _.padStart(customerNumber, 10, '0');
        var trimmedCustomerNumber = _.trimStart(customerNumber, '0');
        if (this.filterByBranch && this.filterByCustomer) {
            this.filteredOpenCarts = _.filter(this.openCarts, function (row) {
                return row.branchCode == branchCode && (row.customerNumber == trimmedCustomerNumber || row.customerNumber == paddedCustomerNumber);
            });
        }
        else if (this.filterByBranch) {
            this.filteredOpenCarts = _.filter(this.openCarts, function (row) {
                return row.branchCode == branchCode;
            });
        }
        else if (this.filterByCustomer) {
            this.filteredOpenCarts = _.filter(this.openCarts, function (row) {
                return row.customerNumber == trimmedCustomerNumber || row.customerNumber == paddedCustomerNumber;
            });
        }
        else {
            this.filteredOpenCarts = this.openCarts;
        }
        this.setPage(1);
    };
    OpenCartComponent.prototype.goToCart = function (cart) {
        //To check current customer and selected carts customer is same or not
        var customer = this.commonDataService.Customer;
        var mscPayer = this.commonDataService.MscPayer;
        if (cart.branchCode == this.commonDataService.Branch.code) {
            this.navigateTocart(cart, customer, mscPayer);
        }
        else {
            //1. change branch
            this.loader.loading = true;
            var allOriginalBranches = this.commonDataService.AllOriginalBranches;
            if (allOriginalBranches != null) {
                var branch = _.filter(allOriginalBranches, function (row) {
                    return row.code == cart.branchCode;
                })[0];
                console.log("Branch component selected branch : ", branch);
                this.commonDataService.Branch = branch;
                if (branch != null && branch != undefined) {
                    this.navigateTocart(cart, customer, mscPayer);
                }
                else {
                    this.notification.showNotification("Branch of selected cart is not available.", notification_service_1.NotificationType.Error);
                }
            }
            else {
                this.notification.showNotification("Branches not available. Please try refreshing the page.", notification_service_1.NotificationType.Error);
            }
        }
    };
    OpenCartComponent.prototype.navigateTocart = function (cart, customer, mscPayer) {
        //If current customer and selected carts customer is same or not
        if (cart.customerNumber == customer.customerNumber) {
            this.commonDataService.cleanCheckoutData();
            this.commonDataService.Customer = customer;
            this.commonDataService.MscPayer = mscPayer;
            this.commonDataService.CartId = cart.cartId;
            //navigate....
            this.router.navigate(['/cart']);
        }
        else {
            //search and change customer
            this.customerSearch(cart);
        }
    };
    OpenCartComponent.prototype.customerSearch = function (cart) {
        var _this = this;
        if (cart.customerNumber) {
            this.loader.loading = true;
            var customerSearch = Object.assign(new customer_search_entity_1.CustomerSearch(), {
                CustomerType: "AG",
                CustomerNumber: cart.customerNumber,
                BranchCode: cart.branchCode,
                AccountGroups: ["Z001", "Z002"],
                CustomerName: "",
                City: "",
                State: "",
                PostalCode: "",
                PhoneNumber: "",
                UserId: this.commonDataService.UserId
            });
            this.partsSearchService.getCustomers(customerSearch)
                .then(function (c) {
                var searchterm = _this.activatedRoute.snapshot.queryParams['searchTerm'];
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    _this.notification.errorMessage("OpenCartComponent", "customerSearch", "getCustomers", c);
                }
                else {
                    if (c.customers.length == 1) {
                        _this.commonDataService.Coupons = null;
                        _this.commonDataService.CouponVendors = null;
                        //set customer
                        _this.commonDataService.Customer = c.customers[0];
                        //set cart number
                        _this.commonDataService.CartId = cart.cartId;
                        //set mscPayerchange
                        _this.customerModalService.notifyShowMSCPayerCustomerModal({ data: c.customers[0] });
                        //navigate....
                        _this.router.navigate(['/cart']);
                    }
                }
                _this.loader.loading = false;
                //this.changeDetectorRef.detectChanges();
                console.log("Customer component : ", c);
            }, function (error) { _this.loader.loading = false; });
        }
    };
    OpenCartComponent.prototype.ngOnDestroy = function () {
    };
    return OpenCartComponent;
}());
OpenCartComponent = __decorate([
    core_1.Component({
        selector: "open-cart-panel",
        templateUrl: "./src/app/cart/open.cart.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        cart_service_1.CartService,
        parts_search_service_1.PartsSearchService,
        customer_service_1.CustomerModalService,
        router_1.Router,
        router_1.ActivatedRoute])
], OpenCartComponent);
exports.OpenCartComponent = OpenCartComponent;
//# sourceMappingURL=open.cart.component.js.map