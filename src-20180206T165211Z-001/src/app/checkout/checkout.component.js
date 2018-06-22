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
var common_data_service_1 = require("./../_common/services/common-data.service");
var router_1 = require("@angular/router");
var notification_service_1 = require("./../_common/services/notification.service");
var parts_search_service_1 = require("./../search/parts/parts-search.service");
var cart_service_1 = require("./../cart/cart.service");
var customer_search_entity_1 = require("./../_entities/customer-search.entity");
var cart_entity_1 = require("./../_entities/cart.entity");
var _ = require("lodash");
var customer_service_1 = require("./../search/modal/customer/customer.service");
var order_info_entity_1 = require("./../_entities/order-info.entity");
var platform_browser_1 = require("@angular/platform-browser");
var loader_service_1 = require("./../_common/services/loader.service");
var app_insight_quote_entity_1 = require("../_entities/app-insight-quote.entity");
var app_insight_unused_coupon_entity_1 = require("../_entities/app-insight-unused-coupon.entity");
var app_insight_billing_entity_1 = require("../_entities/app-insight-billing.entity");
var application_insights_service_1 = require("../_common/services/application-insights.service");
var app_insight_order_entity_1 = require("../_entities/app-insight-order.entity");
var update_cart_entity_1 = require("../_entities/update-cart-entity");
var coupon_service_1 = require("../search/modal/coupon/coupon.service");
var CheckoutComponent = (function () {
    //Matches the following US numbers
    //123-456-7890    //(123)-456-7890    //1234567890    //123 456 7890    //123.456.7890    //+91 (123)-456-7890
    function CheckoutComponent(notification, loader, commonDataService, title, router, changeDetectorRef, partsSearchService, cartService, elementRef, customerModalService, applicationInsightsService, couponService) {
        var _this = this;
        this.notification = notification;
        this.loader = loader;
        this.commonDataService = commonDataService;
        this.title = title;
        this.router = router;
        this.changeDetectorRef = changeDetectorRef;
        this.partsSearchService = partsSearchService;
        this.cartService = cartService;
        this.elementRef = elementRef;
        this.customerModalService = customerModalService;
        this.applicationInsightsService = applicationInsightsService;
        this.couponService = couponService;
        this.orderType = "SalesOrder";
        this.customerName = this.commonDataService.Customer.customerName;
        this.customerNumber = this.commonDataService.Customer.customerNumber;
        this.defaultBillingType = "";
        this.showAlternateShipingAddressLoader = false;
        this.isValidAlternateShipingAddress = false;
        this.isBillingTypeCustomers = false;
        this.AlternateShipingAddressErrorMessage = "Alternate shipping address is required.";
        this.checkDefaultCustomerAddressValidation = false;
        this.isAlternateShipingAddressSelected = false;
        this.selectedAlternateShipingAddress = null;
        this.editAlternateAddressFlag = false;
        this.editedAlternateShipingAddress = null;
        this.isPONumberRequired = false;
        this.PONumber = "";
        this.UnitNumber = "";
        this.deliveryType = cart_entity_1.DeliveryType;
        this.estimatedFrieght = null;
        this.estimatedDelivery = null;
        this.specialInstructions = "";
        this.total = 0;
        this.defaultBranchValue = 0;
        this.IsAlternateAddressEdited = false;
        this.showDeliveryLoader = false;
        this.showFrieghtLoader = false;
        this.showFrieghtRow = false;
        this.showDeliveryRow = false;
        this.subscription = null;
        this.PayerInValidInBranch = false;
        this.hasUnprocuredZeroQtyItems = false;
        this.includePurchaseOrder = true;
        this.completeCartData = null;
        this.isBranchChanged = false;
        this.Name1 = "";
        this.Name2 = "";
        this.SalesPerson = "";
        this.MSC = "";
        this.Address = "";
        this.City = "";
        this.State = "";
        this.Zip = "";
        this.Phone = "";
        this.storeBillingType = "";
        this.storeShipTOAddressNO = "";
        this.storeBilliTOAddressNO = "";
        this.branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe(function (d) {
            _this.isBranchChanged = true;
            _this.branchDataUpdated = d;
        });
        //If you want a match on US numbers use  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
        this.phoneRegexPattern = /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
        this.customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe(function (res) {
            var payerNotValidInBranch = _this.commonDataService.Customer.payerNotValidInBranch;
            if (res.data != null && res.data.length == 1 && res.data[0].payerNotValidInBranch == false && _this.commonDataService.Customer.customerNumber == _this.commonDataService.DefaultCustomer.customerNumber) {
                res.data = res.data[0];
                _this.PayerInValidInBranch = payerNotValidInBranch != undefined && payerNotValidInBranch != null ? payerNotValidInBranch : res.data.payerNotValidInBranch;
            }
            else if (res.data != null && res.data.length == 1 && res.data[0].payerNotValidInBranch && _this.commonDataService.Customer.customerNumber == _this.commonDataService.DefaultCustomer.customerNumber) {
                _this.PayerInValidInBranch = payerNotValidInBranch != undefined && payerNotValidInBranch != null ? payerNotValidInBranch : res.data.payerNotValidInBranch;
            }
            _this.selectedAlternateShipingAddress = null;
            _this.editedAlternateShipingAddress = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.isAlternateShipingAddressSelected = true;
                _this.selectedAlternateShipingAddress = res.data;
                _this.editedAlternateShipingAddress = res.data;
                _this.updateAdditionalCartInfo();
                if (_this.commonDataService.Customer.customerNumber == _this.commonDataService.DefaultCustomer.customerNumber) {
                    _this.editAlternateAddressFlag = true;
                    if (_this.commonDataService.SelectedAlternateShipingAddress == null) {
                        _this.editedAlternateShipingAddress.customerName = "";
                        _this.editedAlternateShipingAddress.phoneNumber = "";
                    }
                }
                _this.validAlternateShipingAddress();
                console.log("Checkout Customer Modal Event Subscription : ", res);
            }
            //this.setAlternateShipingAddressFromSession();
            _this.commonDataService.SelectedAlternateShipingAddress = _this.selectedAlternateShipingAddress;
        });
        title.setTitle("Checkout - Parts Link");
        //this.notification.hideNotification();        
    }
    CheckoutComponent.prototype.checkoutInit = function () {
        this.getBillingTypeCustomers();
        this.getCarts();
        if (this.commonDataService.SelectedAlternateShipingAddress == null)
            this.getAlternateShippingCustomers(true);
        //else
        // this.setAlternateShipingAddressFromSession();
        var ponumbervalue = this.commonDataService.PONumberValue;
        var unitNumberValue = this.commonDataService.UnitNumberValue;
        if (unitNumberValue != null && unitNumberValue != "") {
            this.UnitNumber = unitNumberValue;
        }
        var customerPONumber = this.commonDataService.Customer.customerPONumber;
        if (ponumbervalue != null && ponumbervalue != "") {
            this.PONumber = ponumbervalue;
        }
        else if (customerPONumber != null && customerPONumber != "") {
            this.PONumber = this.commonDataService.Customer.customerPONumber;
        }
        var specialInstructions = this.commonDataService.SpecialInstructions;
        if (specialInstructions != null && specialInstructions != "") {
            this.specialInstructions = specialInstructions;
        }
        if (this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            this.checkDefaultCustomerAddressValidation = true;
            this.getCustomerDetails();
        }
        else {
            this.isPONumberRequired = this.commonDataService.Customer.isPONumberRequired;
        }
        this.elementRef.nativeElement.querySelector('input#txtPONumber').focus();
    };
    CheckoutComponent.prototype.viewCoupons = function () {
        //this.commonDataService.getCouponevent.emit(this.orderType);
    };
    CheckoutComponent.prototype.setAlternateShipingAddressFromDatabase = function (cart) {
        if (cart != null && cart != "" && cart.message != "cart is not defined") {
            if ((cart.name1 != "" && cart.name1 != null) || (cart.salesPerson != "" && cart.salesPerson != null) || (cart.msc != "" && cart.msc != null) || (cart.address != "" && cart.address != null) || (cart.city != "" && cart.city != null) || (cart.state != "" && cart.state != null) || (cart.zip != "" && cart.zip != null) || (cart.phone != "" && cart.phone != null)) {
                this.commonDataService.SelectedAlternateShipingAddress =
                    {
                        customerName: cart.name1 != "" && cart.name1 != null ? cart.name1 : null,
                        accountManagerName: cart.salesPerson != "" && cart.salesPerson != null ? cart.salesPerson : null,
                        mscAccountNumber: cart.msc != "" && cart.msc != null ? cart.msc : null,
                        streetAddress: cart.address != "" && cart.address != null ? cart.address : null,
                        city: cart.city != "" && cart.city != null ? cart.city : null,
                        state: cart.state != "" && cart.state != null ? cart.state : null,
                        postalCode: cart.zip != "" && cart.zip != null ? cart.zip : null,
                        phoneNumber: cart.phone != "" && cart.phone != null ? cart.phone : null,
                        addressNumber: cart.shipToAddressNo != "" && cart.shipToAddressNo != null ? cart.shipToAddressNo : null
                    };
                this.selectedAlternateShipingAddress = this.commonDataService.SelectedAlternateShipingAddress != "" && this.commonDataService.SelectedAlternateShipingAddress != null ? this.commonDataService.SelectedAlternateShipingAddress : this.selectedAlternateShipingAddress;
                this.editedAlternateShipingAddress = this.commonDataService.SelectedAlternateShipingAddress != "" && this.commonDataService.SelectedAlternateShipingAddress != null ? this.commonDataService.SelectedAlternateShipingAddress : this.editedAlternateShipingAddress;
                this.isAlternateShipingAddressSelected = true;
                this.validAlternateShipingAddress();
            }
            if ((cart.billingType != "" && cart.billingType != null) || (cart.shipToAddressNo != "" && cart.shipToAddressNo != null) || (cart.billToAddressNo != "" && cart.billToAddressNo != null)) {
                this.commonDataService.SelectedBillingType = {
                    addressNumber: cart.billToAddressNo,
                    customerName: cart.billtingType
                };
                this.defaultBillingType = this.commonDataService.SelectedBillingType != "" && this.commonDataService.SelectedBillingType != null && this.commonDataService.SelectedBillingType != "undefined" ? this.commonDataService.SelectedBillingType.addressNumber : this.defaultBillingType;
                this.selectedBillingType = this.commonDataService.SelectedBillingType != "" && this.commonDataService.SelectedBillingType != null && this.commonDataService.SelectedBillingType != "undefined" ? this.commonDataService.SelectedBillingType : this.selectedBillingType;
            }
        }
    };
    CheckoutComponent.prototype.setPONumber = function () {
        this.commonDataService.PONumberValue = this.PONumber;
    };
    CheckoutComponent.prototype.setUnitNumber = function () {
        this.commonDataService.UnitNumberValue = this.UnitNumber;
    };
    CheckoutComponent.prototype.setSpecialInstructions = function () {
        this.commonDataService.SpecialInstructions = this.specialInstructions;
    };
    CheckoutComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.checkoutInit();
        this.subscription = this.commonDataService.commonDataUpdated.subscribe(function (d) {
            _this.checkoutInit();
            _this.loader.loading = false;
        });
    };
    CheckoutComponent.prototype.getCustomerDetails = function () {
        var _this = this;
        var customerSearch = Object.assign(new customer_search_entity_1.CustomerSearch(), {
            CustomerType: "AG",
            CustomerNumber: this.customerNumber,
            BranchCode: this.commonDataService.Branch.code,
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
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "getCustomerDetails", "getCustomers", c);
            }
            else {
                if (c.customers != null && c.customers.length > 0) {
                    _this.isPONumberRequired = c.customers[0].isPONumberRequired;
                }
            }
            console.log("Checkout component Customer details : ", c);
        }, function (error) { });
    };
    CheckoutComponent.prototype.getCarts = function () {
        var _this = this;
        this.cartsData = null;
        this.cartMessage = "loading cart items ...";
        this.defaultBranchValue = this.commonDataService.Branch.defaultDeliveryFee;
        var searchData = Object.assign(new cart_entity_1.CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId
        });
        this.cartService.getCarts(searchData)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "getCarts", "getCarts", c);
            }
            else {
                if (!c || c.carts == undefined || c.carts == null || c.carts.length == 0) {
                    _this.cartsData = [];
                    _this.cartMessage = "cart item is not available.";
                }
                else {
                    var carts = c.carts;
                    _this.completeCartData = c.carts;
                    _this.commonDataService.CartId = carts[0].cartId;
                    _this.cartsData = _.reject(carts, function (item) {
                        return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    if (c.hasError) {
                        _this.notification.showMultilineNotification(c.errorMessages);
                    }
                    _this.PONumber = carts[0].poNumber == "" || carts[0].poNumber == null ? _this.PONumber : carts[0].poNumber;
                    _this.UnitNumber = carts[0].unitNumber == "" || carts[0].unitNumber == null ? _this.commonDataService.UnitNumberValue : carts[0].unitNumber;
                    _this.specialInstructions = carts[0].specialInstruction == "" || carts[0].specialInstruction == null ? _this.commonDataService.SpecialInstructions : carts[0].specialInstruction;
                    if (c.carts.length >= 1) {
                        _this.setAlternateShipingAddressFromDatabase(carts[0]);
                    }
                    var regularCartItems = _.reject(_this.cartsData, function (item) {
                        return item.couponId != null || item.isBuyout == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    _this.hasUnprocuredZeroQtyItems = _.filter(regularCartItems, function (item) {
                        return item.quantityAvailable == 0 || (item.isSplit == true && item.isSTO == false);
                    }).length > 0;
                    //this.hasUnprocuredZeroQtyItems = _.filter(<any[]>regularCartItems, function (item) {
                    //    return item.quantityAvailable == 0;
                    //}).length > 0;   
                    _this.total = _this.calculateCartTotals();
                    _this.freight = _.filter(carts, function (row) {
                        return row.isFreight == true;
                    });
                    if (_this.freight && _this.freight.length > 0) {
                        _this.estimatedFrieght = _this.freight[0].finalPrice;
                        _this.total = _this.total + _this.estimatedFrieght;
                        _this.showFrieghtRow = true;
                    }
                    else {
                        _this.estimatedFrieght = 0;
                        _this.showFrieghtRow = false;
                    }
                    _this.delivery = _.filter(carts, function (row) {
                        return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                    });
                    if (_this.delivery && _this.delivery.length > 0) {
                        _this.estimatedDelivery = c.carts[0].deliveryType == cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup] ? 0 : _this.delivery[0].finalPrice;
                        _this.total = _this.total + _this.estimatedDelivery;
                        _this.showDeliveryRow = true;
                    }
                    else {
                        _this.estimatedDelivery = 0;
                        _this.showDeliveryRow = false;
                    }
                    _this.selectedDelivery = c.carts[0].deliveryType;
                }
            }
            //this.changeDetectorRef.detectChanges();
            console.log("Checkout Cart Data : ", c);
            _this.validAlternateShipingAddress();
            if (_this.isBranchChanged) {
                var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                    userId: _this.commonDataService.UserId,
                    searchTerm: '',
                    customerNumber: _this.commonDataService.Customer.customerNumber,
                    customerName: _this.commonDataService.Customer.customerName,
                    cartNumber: _this.commonDataService.CartId,
                    PONumber: _this.PONumber,
                    source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.Checkout],
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
                appInsightBilling.products = _this.applicationInsightsService.getAppInsightParts(_this.completeCartData, JSON.stringify(appInsightBilling).length);
                _this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                _this.isBranchChanged = false;
            }
        }, function (error) { });
    };
    CheckoutComponent.prototype.editFreight = function (editedPrice) {
        var _this = this;
        if (editedPrice.toString() == "") {
            this.estimatedFrieght = "0";
            editedPrice = "0";
            this.freight[0].listPrice = 0;
            this.freight[0].finalPrice = 0;
        }
        var decimalCheckResult = this.checkIsDecimal(editedPrice);
        if (decimalCheckResult) {
            this.freight[0].listPrice = +editedPrice;
            this.freight[0].finalPrice = +editedPrice;
            this.showFrieghtLoader = true;
            this.cartService.UpdateCartFreightAndDelivery(this.freight[0].cartId, this.freight[0].cartItemId, editedPrice)
                .then(function (carts) {
                //  this.getCarts();
                _this.showFrieghtLoader = false;
            }, function (error) { _this.showFrieghtLoader = false; });
        }
    };
    CheckoutComponent.prototype.editDelivery = function (editedPrice) {
        var _this = this;
        if (editedPrice.toString() == "") {
            this.estimatedDelivery = "0";
            editedPrice = "0";
            this.delivery[0].listPrice = 0;
            this.delivery[0].finalPrice = 0;
        }
        var decimalCheckResult = this.checkIsDecimal(editedPrice);
        if (decimalCheckResult) {
            this.delivery[0].listPrice = +editedPrice;
            this.delivery[0].finalPrice = +editedPrice;
            this.showDeliveryLoader = true;
            this.cartService.UpdateCartFreightAndDelivery(this.delivery[0].cartId, this.delivery[0].cartItemId, editedPrice)
                .then(function (carts) {
                // this.getCarts();
                _this.showDeliveryLoader = false;
            }, function (error) { _this.showDeliveryLoader = false; });
        }
    };
    CheckoutComponent.prototype.checkIsDecimal = function (input) {
        return (/^(\d+\.?\d*|\.\d+)$/).test(input);
    };
    CheckoutComponent.prototype.getAlternateShippingCustomers = function (hasSingleAddressCheck) {
        var _this = this;
        if (hasSingleAddressCheck === void 0) { hasSingleAddressCheck = false; }
        this.alertnateAddressMessage = "loading alternate shipping addresses ...";
        var customerSearch = Object.assign(new customer_search_entity_1.CustomerSearch(), {
            CustomerType: "WE",
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            BranchCode: this.commonDataService.Branch.code,
            UserId: this.commonDataService.UserId
            //AccountGroups: ["Z001", "Z002"]
        });
        this.showAlternateShipingAddressLoader = true;
        this.partsSearchService.getCustomers(customerSearch)
            .then(function (c) {
            _this.showAlternateShipingAddressLoader = false;
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "getAlternateShippingCustomers", "getCustomers", c);
            }
            else {
                if (!c || !c.customers || c.customers.length == 0) {
                    _this.alternateShippingCustomers = null;
                    _this.billingMessage = "alternate shipping address is not available.";
                }
                else {
                    if (hasSingleAddressCheck && c.customers.length == 1 && c.customers[0].payerNotValidInBranch == false) {
                        _this.isAlternateShipingAddressSelected = true;
                        _this.selectedAlternateShipingAddress = c.customers[0];
                        _this.editedAlternateShipingAddress = c.customers[0];
                        _this.editAlternateAddressFlag = false;
                        if (_this.commonDataService.Customer.customerNumber == _this.commonDataService.DefaultCustomer.customerNumber) {
                            _this.editAlternateAddressFlag = true;
                            if (_this.commonDataService.SelectedAlternateShipingAddress == null) {
                                _this.editedAlternateShipingAddress.customerName = "";
                                _this.editedAlternateShipingAddress.phoneNumber = "";
                            }
                        }
                        _this.validAlternateShipingAddress();
                        _this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                    }
                    else if (hasSingleAddressCheck && c.customers.length == 1 && c.customers[0].payerNotValidInBranch == true) {
                        _this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                    }
                    else if (!hasSingleAddressCheck) {
                        if (c.customers.length == 1 && _this.commonDataService.Customer.customerNumber == _this.commonDataService.DefaultCustomer.customerNumber) {
                            _this.customerModalService.notifyCustomerSelection({ data: c.customers });
                        }
                        else {
                            _this.customerModalService.notifyShowCustomerModal({ data: { customers: c.customers, customerSearchTerm: '' } });
                        }
                    }
                }
            }
            //this.changeDetectorRef.detectChanges();
            console.log("Checkout Alternate Shipping Address : ", c);
        }, function (error) { _this.showAlternateShipingAddressLoader = false; });
    };
    CheckoutComponent.prototype.getBillingTypeCustomers = function () {
        var _this = this;
        this.billingMessage = "loading billing types ...";
        var customerSearch = Object.assign(new customer_search_entity_1.CustomerSearch(), {
            CustomerType: "RG",
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            BranchCode: this.commonDataService.Branch.code,
            UserId: this.commonDataService.UserId
        });
        this.partsSearchService.getCustomers(customerSearch)
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "getBillingTypeCustomers", "getCustomers", c);
            }
            else {
                if (!c || !c.customers || c.customers.length == 0) {
                    _this.billingTypeCustomers = null;
                    _this.billingMessage = "billing type is not available.";
                }
                else {
                    //if (c.customers.length == 1 && this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
                    //    this.getAlternateShippingCustomers();
                    //}
                    _this.billingTypeCustomers = c.customers;
                    _this.isBillingTypeCustomers = true;
                    var defaultselected = _.filter(_this.billingTypeCustomers, function (row) {
                        return row.isDefault == true && row.payerNotValidInBranch == false;
                    });
                    var selectedBillingType = _this.commonDataService.SelectedBillingType;
                    if (selectedBillingType != null) {
                        _this.selectedBillingType = selectedBillingType;
                        _this.defaultBillingType = selectedBillingType.addressNumber;
                    }
                    else if (defaultselected && defaultselected.length == 1) {
                        _this.selectedBillingType = defaultselected[0];
                        _this.defaultBillingType = defaultselected[0].addressNumber;
                        _this.PayerInValidInBranch = defaultselected[0].payerNotValidInBranch;
                    }
                    else if (defaultselected && defaultselected.length > 0) {
                        _this.selectedBillingType = defaultselected;
                        _this.defaultBillingType = defaultselected[0].addressNumber;
                        _this.PayerInValidInBranch = defaultselected[0].payerNotValidInBranch;
                    }
                    else if (_this.billingTypeCustomers.length == 1) {
                        //This else part added to make billing type selected in case default is not set from SAP and when there is only 1 billing type
                        _this.selectedBillingType = _this.billingTypeCustomers[0];
                        _this.defaultBillingType = _this.billingTypeCustomers[0].addressNumber;
                        _this.PayerInValidInBranch = _this.billingTypeCustomers[0].payerNotValidInBranch;
                    }
                }
            }
            //this.changeDetectorRef.detectChanges();
            console.log("Checkout BillingTypes : ", c);
        }, function (error) { });
    };
    CheckoutComponent.prototype.calculateCartTotals = function () {
        var totalPrice = 0;
        if (this.cartsData) {
            this.cartsData.forEach(function (d) {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                    //totalPrice += d.quantity * d.finalPrice;
                    totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
                }
            });
        }
        return totalPrice;
    };
    CheckoutComponent.prototype.selectDifferentAddress = function () {
        this.isAlternateShipingAddressSelected = false;
        this.editAlternateAddressFlag = false;
        this.IsAlternateAddressEdited = false;
        this.selectedAlternateShipingAddress = null;
        this.editedAlternateShipingAddress = null;
        this.commonDataService.SelectedAlternateShipingAddress = this.selectedAlternateShipingAddress;
        //this.changeDetectorRef.detectChanges();
        this.getAlternateShippingCustomers();
    };
    CheckoutComponent.prototype.validAlternateShipingAddress = function () {
        this.AlternateShipingAddressErrorMessage = "";
        if (this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            this.isValidAlternateShipingAddress =
                this.selectedAlternateShipingAddress.customerName.length > 0
                    && this.selectedAlternateShipingAddress.phoneNumber.length > 0;
            if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery.toString() == cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup] && this.selectedAlternateShipingAddress.customerName.length <= 0 && this.selectedAlternateShipingAddress.phoneNumber.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Customer name and phone number is required";
            else if (this.selectedAlternateShipingAddress.customerName.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Customer name is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery.toString() != cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup] && this.selectedAlternateShipingAddress.streetAddress.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Street Address is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery != cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup] && this.selectedAlternateShipingAddress.city.length <= 0)
                this.AlternateShipingAddressErrorMessage = "City is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery != cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup] && this.selectedAlternateShipingAddress.postalCode.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Postal Code is required";
            else if (this.selectedAlternateShipingAddress.phoneNumber.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Phone number is required";
            if (this.selectedAlternateShipingAddress.phoneNumber.length > 0) {
                var isCorrectPhoneFormat = this.phoneRegexPattern.test(this.selectedAlternateShipingAddress.phoneNumber);
                if (!isCorrectPhoneFormat) {
                    this.isValidAlternateShipingAddress = false;
                    this.AlternateShipingAddressErrorMessage = this.AlternateShipingAddressErrorMessage.length > 0 ?
                        this.AlternateShipingAddressErrorMessage + " and enter valid phone number" : " Enter valid phone number";
                }
                if (this.AlternateShipingAddressErrorMessage != "") {
                    this.isValidAlternateShipingAddress = false;
                }
            }
            this.AlternateShipingAddressErrorMessage = this.AlternateShipingAddressErrorMessage.length > 0 ?
                this.AlternateShipingAddressErrorMessage + " in alternate shipping address." : "";
        }
        else {
            this.isValidAlternateShipingAddress = this.selectedAlternateShipingAddress != null;
            if (!this.isValidAlternateShipingAddress)
                this.AlternateShipingAddressErrorMessage = "Alternate shipping address is required.";
        }
    };
    CheckoutComponent.prototype.updateAlternateAddress = function () {
        this.selectedAlternateShipingAddress.customerName = this.editedAlternateShipingAddress.customerName;
        this.selectedAlternateShipingAddress.streetAddress = this.editedAlternateShipingAddress.streetAddress;
        this.selectedAlternateShipingAddress.city = this.editedAlternateShipingAddress.city;
        this.selectedAlternateShipingAddress.state = this.editedAlternateShipingAddress.state;
        this.selectedAlternateShipingAddress.postalCode = this.editedAlternateShipingAddress.postalCode;
        this.selectedAlternateShipingAddress.phoneNumber = this.editedAlternateShipingAddress.phoneNumber;
        this.selectedAlternateShipingAddress.addressNumber = this.editedAlternateShipingAddress.addressNumber;
        this.editAlternateAddressFlag = this.AlternateShipingAddressErrorMessage == "" ? false : true;
        this.IsAlternateAddressEdited = true;
        this.commonDataService.SelectedAlternateShipingAddress = this.selectedAlternateShipingAddress;
        this.validAlternateShipingAddress();
        this.updateAdditionalCartInfo();
    };
    CheckoutComponent.prototype.padRight = function (num, size) {
        var s = num + "";
        while (s.length < size)
            s = s + "0";
        return s;
    };
    CheckoutComponent.prototype.placeOrder = function () {
        var _this = this;
        this.loader.loading = true;
        var alternateShipingAddress = this.selectedAlternateShipingAddress;
        var zipcode = alternateShipingAddress.postalCode;
        zipcode = zipcode.replace("-", "");
        zipcode = this.padRight(zipcode, 9);
        var b = "-";
        var position = 5;
        zipcode = [zipcode.slice(0, position), b, zipcode.slice(position)].join('');
        var salesPerson = alternateShipingAddress.accountManagerName != null && alternateShipingAddress.accountManagerName != "" ? alternateShipingAddress.accountManagerName : "";
        salesPerson = salesPerson + (alternateShipingAddress.accountManager != null && alternateShipingAddress.accountManager != "" ? " (" + alternateShipingAddress.accountManager + ")" : "");
        var orderInfo = Object.assign(new order_info_entity_1.OrderInfo(), {
            OrderType: this.orderType,
            BillingTypeNumber: this.selectedBillingType.addressNumber,
            BillingTypeName: this.selectedBillingType.customerName,
            DeliveryType: this.selectedDelivery,
            PONumber: this.PONumber,
            AlternateShippingAddress: alternateShipingAddress.addressNumber,
            SpecialInstructions: this.specialInstructions,
            UserId: this.commonDataService.UserId,
            BranchCode: this.commonDataService.Branch.code,
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            CustomerName1: alternateShipingAddress.customerName,
            CustomerName2: alternateShipingAddress.customerName2,
            Address: alternateShipingAddress.streetAddress,
            City: alternateShipingAddress.city,
            State: alternateShipingAddress.state,
            Zip: zipcode,
            Phone: alternateShipingAddress.phoneNumber,
            SalesPerson: salesPerson,
            MSC: alternateShipingAddress.mscAccountNumber,
            Total: (this.calculateCartTotals() + (this.estimatedFrieght * 1 == null ? 0 : this.estimatedFrieght * 1) + (this.estimatedDelivery * 1 == null ? 0 : this.estimatedDelivery * 1)),
            IsAlternateAddressEdited: this.IsAlternateAddressEdited,
            includePurchaseOrder: this.includePurchaseOrder,
            UnitNumber: this.UnitNumber
        });
        this.cartService.placeOrder(orderInfo)
            .then(function (result) {
            if (result.ErrorType != undefined && result.ErrorType != null && result.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "placeOrder", "placeOrder", result);
                //this.removeCouponCartItems(couponCartItem);                    
            }
            else {
                // this.notification.showNotification(`Order placed successfully. SAP order number is <b>${result.sapOrderNumber}</b>.`, NotificationType.Success);
                if (result.sapOrderNumber != 0 && result.sapOrderNumber != "" && result.sapOrderNumber != null && !result.errorMessage) {
                    if (orderInfo.OrderType == "Quote") {
                        var sourceName = "CheckoutComponent_placeOrder_placeOrder_Quote";
                        var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                        var appInsightQuote = Object.assign(new app_insight_quote_entity_1.AppInsightQuote(), {
                            userId: _this.commonDataService.UserId,
                            customerNumber: _this.commonDataService.Customer.customerNumber,
                            customerName: _this.commonDataService.Customer.customerName,
                            branchNumber: _this.commonDataService.Branch.code,
                            cartNumber: _this.commonDataService.CartId,
                            PONumber: _this.PONumber,
                            orderNumber: result.sapOrderNumber,
                            plMetricName: sourceName,
                            unitNumber: (_this.commonDataService.UnitNumberValue == null || _this.commonDataService.UnitNumberValue == undefined) ? "" : _this.commonDataService.UnitNumberValue
                        });
                        appInsightQuote.lineItems = _this.applicationInsightsService.getAppInsightParts(_this.completeCartData, JSON.stringify(appInsightQuote).length);
                        _this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
                    }
                    else {
                        var sourceName = "CheckoutComponent_placeOrder_placeOrder_Order";
                        var metricName = _this.applicationInsightsService.getMetricValue(sourceName);
                        var appInsightOrder = Object.assign(new app_insight_order_entity_1.AppInsightOrder(), {
                            userId: _this.commonDataService.UserId,
                            customerNumber: _this.commonDataService.Customer.customerNumber,
                            customerName: _this.commonDataService.Customer.customerName,
                            branchNumber: _this.commonDataService.Branch.code,
                            cartNumber: _this.commonDataService.CartId,
                            PONumber: _this.PONumber,
                            orderNumber: result.sapOrderNumber,
                            plMetricName: sourceName,
                            unitNumber: (_this.commonDataService.UnitNumberValue == null || _this.commonDataService.UnitNumberValue == undefined) ? "" : _this.commonDataService.UnitNumberValue
                        });
                        appInsightOrder.lineItems = _this.applicationInsightsService.getAppInsightParts(_this.completeCartData, JSON.stringify(appInsightOrder).length);
                        _this.applicationInsightsService.trackMetric(metricName, appInsightOrder);
                    }
                    _this.updateCouponRedeemCount();
                    _this.router.navigate(['orderconfirmation'], { queryParams: { orderId: result.orderId } });
                }
                else {
                    //this.removeCouponCartItems(couponCartItem);
                    _this.notification.showNotificationWithoutTimeout("Your order was not Processed into sap: " + (result.errorMessage ? result.errorMessage : result.message) + ".", notification_service_1.NotificationType.Error);
                }
                _this.commonDataService.SelectedAlternateShipingAddress = null;
            }
            console.log("Checkout Place order : ", result);
            _this.loader.loading = false;
        }, function (error) { _this.loader.loading = false; });
    };
    CheckoutComponent.prototype.updateCouponRedeemCount = function () {
        var _this = this;
        if (this.commonDataService.Coupons != null) {
            if (this.cartsData.filter(function (cartItem) { return cartItem.partNumber === _this.commonDataService.Coupons.couponSAPPartNumber; }).length > 0) {
                this.couponService.createCouponRedemption(this.commonDataService.Coupons.couponId, this.commonDataService.Coupons.customerSegmentId)
                    .then(function (carts) {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        _this.notification.errorMessage("CouponModalComponent", "addCouponToCart", "addCouponToCart", carts);
                    }
                    else {
                        _this.commonDataService.Coupons = null;
                        _this.commonDataService.CouponVendors = null;
                    }
                    console.log("Coupon added : ", carts);
                }, function (error) { });
            }
            else {
                var unusedCoupon = Object.assign(new app_insight_unused_coupon_entity_1.AppInsightUnusedCoupon(), {
                    userId: this.commonDataService.UserId,
                    customerNumber: this.commonDataService.Customer.customerNumber,
                    customerName: this.commonDataService.Customer.customerName,
                    branchNumber: this.commonDataService.Branch.code,
                    cartId: this.commonDataService.CartId,
                    //coupon: { id: this.commonDataService.Coupons.couponId, code: this.commonDataService.Coupons.couponCode, customerSegmentId: this.commonDataService.Coupons.customerSegmentId },
                    //lineItems: this.completeCartData.map((cartItem) => { return { partNumber: cartItem.partNumber, quantity: cartItem.quantity, finalPrice: cartItem.finalPrice }; })
                    coupon: this.applicationInsightsService.getAppInsightCoupon(this.commonDataService.Coupons)
                });
                unusedCoupon.lineItems = this.applicationInsightsService.getAppInsightParts(this.completeCartData, JSON.stringify(unusedCoupon).length);
                this.applicationInsightsService.trackMetric("CheckoutComponent_placeOrder_updateCouponRedemption_UnusedCoupon", unusedCoupon);
            }
        }
    };
    CheckoutComponent.prototype.onBillingTypeChange = function (billingType) {
        this.selectedBillingType = billingType;
        this.storeBillingType = billingType.customerName;
        this.storeBilliTOAddressNO = billingType.addressNumber;
        this.commonDataService.SelectedBillingType = billingType;
        this.updateAdditionalCartInfo();
        if (billingType != null && billingType.payerNotValidInBranch) {
            this.PayerInValidInBranch = true;
        }
    };
    CheckoutComponent.prototype.onDeliveryOptionChange = function (cartItem, deliveryOption) {
        console.log("============== DeliveryType Enum ==============");
        console.log(cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup]);
        console.log(cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Delivery]);
        console.log(cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.ShipTo]);
        console.log("============== DeliveryType Enum ==============");
        this.validAlternateShipingAddress();
        if (deliveryOption != cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup]) {
            //  this.editAlternateAddressFlag = this.editAlternateAddressFlag == false ? true : this.editAlternateAddressFlag;          
            if (cartItem && cartItem.length > 0) {
                this.UpdateCartItem(cartItem[0]);
            }
            else {
                this.addToCart();
            }
        }
        else {
            if (cartItem != null && cartItem.length > 0) {
                this.DeleteCartItem(cartItem[0].cartId, cartItem[0].cartItemId, false, true);
            }
            else {
                this.SetDelivery(this.cartsData[0].cartId, 1);
            }
        }
    };
    CheckoutComponent.prototype.addToCart = function () {
        var _this = this;
        var deliveryPrice = 0;
        var isRTCDelivery = false;
        var isCustomerDelivery = false;
        switch (this.selectedDelivery) {
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup]:
                deliveryPrice = 0; //cartItem.listPrice != null ? cartItem.listPrice : 0; 
                isRTCDelivery = false;
                isCustomerDelivery = false;
                break;
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Delivery]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; //(cartItem.listPrice != null ? cartItem.listPrice : 0) + this.commonDataService.RTC_Delivery_Value; break;
                isRTCDelivery = true;
                isCustomerDelivery = false;
                break;
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.ShipTo]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; // this.commonDataService.RTC_Freight_Delivery_Value + (cartItem.listPrice != null ? cartItem.listPrice : 0); break;
                isRTCDelivery = false;
                isCustomerDelivery = true;
        }
        ;
        var addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: "DELIVERY:90",
            description: "Delivery:90",
            customerPrice: 0,
            quantity: 1,
            corePrice: 0,
            partId: "",
            listPrice: deliveryPrice,
            finalPrice: deliveryPrice,
            extendedPrice: deliveryPrice,
            adjustedPrice: 0,
            priceOverrideReasonId: 0,
            PartNumOnly: "DELIVERY:90",
            deliveryType: "",
            IsRTCDelivery: isRTCDelivery,
            IsCustomerDelivery: isCustomerDelivery,
            isSpecialPricing: false,
            PONumber: this.PONumber,
            SpecialInstruction: this.specialInstructions,
            UnitNumber: this.UnitNumber
        });
        this.cartService.addToCart(addtoCartParameters)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "addToCart", "addToCart", carts);
            }
            else {
                _this.delivery = [carts];
                _this.estimatedDelivery = deliveryPrice;
                _this.showDeliveryRow = true;
            }
            console.log("Checkout component add to carts : ", carts);
        }, function (error) { });
    };
    CheckoutComponent.prototype.UpdateCartItem = function (cartItem) {
        var _this = this;
        var deliveryPrice = 0;
        this.showDeliveryLoader = true;
        switch (this.selectedDelivery) {
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Pickup]:
                deliveryPrice = 0; //cartItem.listPrice != null ? cartItem.listPrice : 0; 
                break;
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.Delivery]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; //(cartItem.listPrice != null ? cartItem.listPrice : 0) + this.commonDataService.RTC_Delivery_Value; break;
            case cart_entity_1.DeliveryType[cart_entity_1.DeliveryType.ShipTo]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; // this.commonDataService.RTC_Freight_Delivery_Value + (cartItem.listPrice != null ? cartItem.listPrice : 0); break;
        }
        var updateCartItemData = Object.assign(new update_cart_entity_1.UpdateCart(), {
            cartItemId: cartItem.cartItemId,
            cartId: cartItem.cartId,
            price: deliveryPrice,
            quantity: 1,
            corePrice: deliveryPrice,
            coreOption: null,
            partBuyoutCoreOption: null,
            deliveryType: this.selectedDelivery
        });
        this.cartService.UpdateCartItem(updateCartItemData)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "UpdateCartItem", "UpdateCartItem", carts);
            }
            else {
                //this.getCarts();
                _this.estimatedDelivery = deliveryPrice;
            }
            _this.showDeliveryLoader = false;
        }, function (error) { _this.showDeliveryLoader = false; });
    };
    CheckoutComponent.prototype.updateAdditionalCartInfo = function () {
        var _this = this;
        if (this.commonDataService.CartId != null && this.commonDataService.CartId != "") {
            this.Name1 = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" ? this.selectedAlternateShipingAddress.customerName : "";
            this.Name2 = "";
            this.SalesPerson = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.accountManagerName : "";
            this.MSC = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.mscAccountNumber : "";
            this.Address = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.streetAddress : "";
            this.City = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.city : "";
            this.State = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.state : "";
            this.Zip = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.postalCode : "";
            this.Phone = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.phoneNumber : "";
            this.storeBillingType = this.selectedBillingType != "" && this.selectedBillingType != null && this.selectedBillingType != "undefined" ? this.selectedBillingType.customerName : this.storeBillingType;
            this.storeShipTOAddressNO = this.selectedAlternateShipingAddress != null && this.selectedAlternateShipingAddress != "" && this.selectedAlternateShipingAddress != "undefined" ? this.selectedAlternateShipingAddress.addressNumber : this.storeShipTOAddressNO;
            this.storeBilliTOAddressNO = this.selectedBillingType != "" && this.selectedBillingType != null && this.selectedBillingType != "undefined" ? this.selectedBillingType.addressNumber : this.storeBilliTOAddressNO;
            this.cartService.updateAdditionalCartInfo(this.commonDataService.CartId, this.Name1, null, this.SalesPerson, this.MSC, this.Address, this.City, this.State, this.Zip, this.Phone, this.storeBillingType, this.storeShipTOAddressNO, this.storeBilliTOAddressNO, this.IsAlternateAddressEdited)
                .then(function (carts) {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    _this.notification.errorMessage("CheckoutComponent", "updateUnitNumber", "UpdateUnitNumber", carts);
                }
                else {
                }
            }, function (error) { });
        }
    };
    CheckoutComponent.prototype.updateUnitNOPOSI = function () {
        var _this = this;
        if (this.commonDataService.CartId != null && this.commonDataService.CartId != "") {
            this.cartService.updateUnitNOPOSI(this.UnitNumber, this.PONumber, this.specialInstructions, this.commonDataService.CartId)
                .then(function (carts) {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    _this.notification.errorMessage("CheckoutComponent", "updateUnitNumber", "UpdateUnitNumber", carts);
                }
                else {
                }
            }, function (error) { });
        }
    };
    CheckoutComponent.prototype.onOrderTypeChange = function (newValue) {
        this.orderType = newValue;
        console.log("Checkout ordertype change : ", newValue);
    };
    CheckoutComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\.]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    CheckoutComponent.prototype.SetDelivery = function (cartId, flag) {
        var _this = this;
        this.cartService.SetDelivery(cartId, flag)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "DeleteCartItem", "DeleteCartItem", carts);
            }
            else { }
        }, function (error) { });
    };
    CheckoutComponent.prototype.DeleteCartItem = function (cartId, cartItemId, isFrieght, isPickupDeliveryType) {
        var _this = this;
        var sourceName = "CheckoutComponent_DeleteCartItem";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightQuote = Object.assign(new app_insight_quote_entity_1.AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(isFrieght ? this.freight[0] : this.delivery[0], JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
        var deleteCartItems = new Array();
        var _item = {
            cartItemId: cartItemId,
        };
        deleteCartItems.push(_item);
        var deleteCartItemParameters = {
            cartId: cartId,
            isPickupDeliveryType: isPickupDeliveryType,
            deleteCartItems: deleteCartItems
        };
        this.cartService.DeleteCartItem(deleteCartItemParameters)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("CheckoutComponent", "DeleteCartItem", "DeleteCartItem", carts);
            }
            else {
                //this.getCarts();
                if (isFrieght) {
                    _this.showFrieghtRow = false;
                    _this.freight = [];
                    _this.estimatedFrieght = 0;
                }
                else {
                    _this.showDeliveryRow = false;
                    _this.delivery = [];
                    _this.estimatedDelivery = 0;
                }
            }
        }, function (error) { });
    };
    CheckoutComponent.prototype.onCustomerKeypress = function (event) {
        if (event.keyCode == 13) {
            jQuery('#btnPlaceOrder').focus();
            event.preventDefault();
            return false;
        }
    };
    //removeCouponCartItems(couponCartItem: any) {
    //    let removeCouponItemsData = {
    //        cartItemId: couponCartItem.cartItemId,
    //        cartId: couponCartItem.cartId,
    //        flag: 0
    //    };
    //    if (couponCartItem.couponId != undefined && couponCartItem.couponId != null && couponCartItem.couponId != '') {
    //        this.commonDataService.Coupons = null;
    //        this.commonDataService.CouponVendors = null;
    //    }
    //    this.cartService.DeleteCartItem(removeCouponItemsData)
    //        .then(carts => {
    //            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
    //                this.notification.errorMessage("CartComponent", "removeCartItems", "DeleteCartItem", carts);
    //            }
    //        },
    //        error => { });
    //    let appInsightQuote = Object.assign(new AppInsightQuote(), {
    //        userId: this.commonDataService.UserId,
    //        customerNumber: this.commonDataService.Customer.customerNumber,
    //        customerName: this.commonDataService.Customer.customerName,
    //        branchNumber: this.commonDataService.Branch.code,
    //        cartNumber: this.commonDataService.CartId,
    //        lineItems: this.applicationInsightsService.getAppInsightParts(couponCartItem)
    //    });
    //    this.applicationInsightsService.trackMetric("CheckoutComponent_removeCouponCartItems", appInsightQuote);
    //}
    CheckoutComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.customerModalSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
    };
    return CheckoutComponent;
}());
CheckoutComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/checkout/checkout.component.html?v=" + new Date().getTime(),
        providers: [parts_search_service_1.PartsSearchService, cart_service_1.CartService, application_insights_service_1.ApplicationInsightsService]
    })
    //@ViewChild('couponModal') couponModalComponent: CouponModalComponent;
    ,
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        loader_service_1.LoaderService,
        common_data_service_1.CommonDataService,
        platform_browser_1.Title,
        router_1.Router,
        core_1.ChangeDetectorRef,
        parts_search_service_1.PartsSearchService,
        cart_service_1.CartService,
        core_1.ElementRef,
        customer_service_1.CustomerModalService,
        application_insights_service_1.ApplicationInsightsService,
        coupon_service_1.CouponService])
], CheckoutComponent);
exports.CheckoutComponent = CheckoutComponent;
//# sourceMappingURL=checkout.component.js.map