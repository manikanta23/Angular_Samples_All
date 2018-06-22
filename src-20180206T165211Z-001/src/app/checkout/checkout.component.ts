import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { CommonDataService } from "./../_common/services/common-data.service";
import { Router } from '@angular/router';
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { PartsSearchService } from "./../search/parts/parts-search.service";
import { CartService } from "./../cart/cart.service";
import { CustomerSearch } from "./../_entities/customer-search.entity";
import { CartSearch, Cart, DeliveryType } from "./../_entities/cart.entity";
import * as _ from "lodash";
import { CustomerModalService } from "./../search/modal/customer/customer.service";
import { OrderInfo } from "./../_entities/order-info.entity";
import { Title } from '@angular/platform-browser';
import { LoaderService } from "./../_common/services/loader.service";
import { AppInsightQuote } from "../_entities/app-insight-quote.entity";
import { AppInsightUnusedCoupon } from "../_entities/app-insight-unused-coupon.entity";
import { AppInsightBilling } from "../_entities/app-insight-billing.entity";
import { ApplicationInsightsService, SourceLocationType } from "../_common/services/application-insights.service";
import { AppInsightOrder } from "../_entities/app-insight-order.entity";
import { CouponModalComponent } from "./../search/modal/coupon/coupon.component";
import { UpdateCart } from "../_entities/update-cart-entity";
import { CouponService } from "../search/modal/coupon/coupon.service";

declare var jQuery: any;

@Component({
    templateUrl: `./src/app/checkout/checkout.component.html?v=${new Date().getTime()}`,
    providers: [PartsSearchService, CartService, ApplicationInsightsService]
})

//@ViewChild('couponModal') couponModalComponent: CouponModalComponent;

export class CheckoutComponent implements OnInit, OnDestroy {
    orderType: string = "SalesOrder";
    alternateShippingCustomers: any;
    billingTypeCustomers: any;
    cartsData: any;
    customerName: string = this.commonDataService.Customer.customerName;
    customerNumber: string = this.commonDataService.Customer.customerNumber;
    defaultBillingType: any = "";
    selectedBillingType: any;
    billingMessage: string;
    alertnateAddressMessage: string;
    cartMessage: string;
    showAlternateShipingAddressLoader: boolean = false;
    isValidAlternateShipingAddress: boolean = false;
    isBillingTypeCustomers: boolean = false;
    AlternateShipingAddressErrorMessage: string = "Alternate shipping address is required.";
    checkDefaultCustomerAddressValidation: boolean = false;
    isAlternateShipingAddressSelected: boolean = false;
    selectedAlternateShipingAddress: any = null;
    editAlternateAddressFlag: boolean = false;
    editedAlternateShipingAddress: any = null;
    isPONumberRequired: boolean = false;
    PONumber: any = "";
    UnitNumber: any = "";
    deliveryType = DeliveryType;
    estimatedFrieght: any = null;
    estimatedDelivery: any = null;
    specialInstructions: string = "";
    selectedDelivery: string;
    total: number = 0;
    defaultBranchValue: number = 0;
    IsAlternateAddressEdited: boolean = false;
    freight: any;
    delivery: any;
    showDeliveryLoader: boolean = false;
    showFrieghtLoader: boolean = false;
    showFrieghtRow: boolean = false;
    showDeliveryRow: boolean = false;
    subscription: any = null;
    PayerInValidInBranch: boolean = false;
    hasUnprocuredZeroQtyItems: boolean = false;
    includePurchaseOrder: boolean = true;
    completeCartData: any = null;
    branchDataUpdated: any;
    isBranchChanged: boolean = false;
    Name1: string = "";
    Name2: string = "";
    SalesPerson: string = "";
    MSC: string = "";
    Address: string = "";
    City: string = "";
    State: string = "";
    Zip: string = "";
    Phone: string = "";
    storeBillingType: string = "";
    storeShipTOAddressNO: string = "";
    storeBilliTOAddressNO: string = "";
    branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe((d: any) => {
        this.isBranchChanged = true;
        this.branchDataUpdated = d;
    });

    //If you want a match on US numbers use  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    phoneRegexPattern: any = /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    //Matches the following US numbers
    //123-456-7890    //(123)-456-7890    //1234567890    //123 456 7890    //123.456.7890    //+91 (123)-456-7890

    constructor(
        private notification: NotificationService,
        private loader: LoaderService,
        private commonDataService: CommonDataService,
        private title: Title,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private partsSearchService: PartsSearchService,
        private cartService: CartService,
        private elementRef: ElementRef,
        private customerModalService: CustomerModalService,
        private applicationInsightsService: ApplicationInsightsService,
        private couponService: CouponService) {
        title.setTitle("Checkout - Parts Link");
        //this.notification.hideNotification();        
    }

    checkoutInit() {
        this.getBillingTypeCustomers();
        this.getCarts();
        if (this.commonDataService.SelectedAlternateShipingAddress == null)
            this.getAlternateShippingCustomers(true);
        //else
        // this.setAlternateShipingAddressFromSession();

        let ponumbervalue = this.commonDataService.PONumberValue;

        let unitNumberValue = this.commonDataService.UnitNumberValue;
        if (unitNumberValue != null && unitNumberValue != "") {
            this.UnitNumber = unitNumberValue;
        }
        let customerPONumber = this.commonDataService.Customer.customerPONumber;
        if (ponumbervalue != null && ponumbervalue != "") {
            this.PONumber = ponumbervalue;
        }
        else if (customerPONumber != null && customerPONumber != "") {
            this.PONumber = this.commonDataService.Customer.customerPONumber;
        }
        let specialInstructions = this.commonDataService.SpecialInstructions;
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
    }

    viewCoupons() {
        //this.commonDataService.getCouponevent.emit(this.orderType);
    }
    setAlternateShipingAddressFromDatabase(cart: any) {
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
                    }
                this.selectedAlternateShipingAddress = this.commonDataService.SelectedAlternateShipingAddress != "" && this.commonDataService.SelectedAlternateShipingAddress != null ? this.commonDataService.SelectedAlternateShipingAddress : this.selectedAlternateShipingAddress;
                this.editedAlternateShipingAddress = this.commonDataService.SelectedAlternateShipingAddress != "" && this.commonDataService.SelectedAlternateShipingAddress != null ? this.commonDataService.SelectedAlternateShipingAddress : this.editedAlternateShipingAddress;
                this.isAlternateShipingAddressSelected = true;
                this.validAlternateShipingAddress();
            }

            if ((cart.billingType != "" && cart.billingType != null) || (cart.shipToAddressNo != "" && cart.shipToAddressNo != null) || (cart.billToAddressNo != "" && cart.billToAddressNo != null))
            {
                this.commonDataService.SelectedBillingType = {
                    addressNumber: cart.billToAddressNo,
                    customerName : cart.billtingType                
                };
                this.defaultBillingType = this.commonDataService.SelectedBillingType != "" && this.commonDataService.SelectedBillingType != null && this.commonDataService.SelectedBillingType != "undefined" ? this.commonDataService.SelectedBillingType.addressNumber : this.defaultBillingType;
                this.selectedBillingType = this.commonDataService.SelectedBillingType != "" && this.commonDataService.SelectedBillingType != null && this.commonDataService.SelectedBillingType != "undefined" ? this.commonDataService.SelectedBillingType : this.selectedBillingType;
            }
        }
    }
    setPONumber() {
        this.commonDataService.PONumberValue = this.PONumber;
    }

    setUnitNumber() {
        this.commonDataService.UnitNumberValue = this.UnitNumber;
    }

    setSpecialInstructions() {
        this.commonDataService.SpecialInstructions = this.specialInstructions;
    }

    ngOnInit() {
        this.checkoutInit();
        this.subscription = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
            this.checkoutInit();
            this.loader.loading = false;
        });
    }

    getCustomerDetails() {
        let customerSearch: CustomerSearch = Object.assign(new CustomerSearch(), {
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
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "getCustomerDetails", "getCustomers", c);
                }
                else {
                    if (c.customers != null && c.customers.length > 0) {
                        this.isPONumberRequired = c.customers[0].isPONumberRequired;
                    }
                }
                console.log("Checkout component Customer details : ", c);
            },
            error => { });
    }

    customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe((res) => {
        let payerNotValidInBranch: any = this.commonDataService.Customer.payerNotValidInBranch;
        if (res.data != null && res.data.length == 1 && res.data[0].payerNotValidInBranch == false && this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            res.data = res.data[0];
            this.PayerInValidInBranch = payerNotValidInBranch != undefined && payerNotValidInBranch != null ? payerNotValidInBranch : res.data.payerNotValidInBranch;
        }
        else if (res.data != null && res.data.length == 1 && res.data[0].payerNotValidInBranch && this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            this.PayerInValidInBranch = payerNotValidInBranch != undefined && payerNotValidInBranch != null ? payerNotValidInBranch : res.data.payerNotValidInBranch;
        }
        this.selectedAlternateShipingAddress = null;
        this.editedAlternateShipingAddress = null;
        if (res.hasOwnProperty('data') && res.data != null) {
            this.isAlternateShipingAddressSelected = true;
            this.selectedAlternateShipingAddress = res.data;
            this.editedAlternateShipingAddress = res.data;
            this.updateAdditionalCartInfo();
            if (this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
                this.editAlternateAddressFlag = true;
                if (this.commonDataService.SelectedAlternateShipingAddress == null) {
                    this.editedAlternateShipingAddress.customerName = "";
                    this.editedAlternateShipingAddress.phoneNumber = "";
                }
            }
            this.validAlternateShipingAddress();
            console.log("Checkout Customer Modal Event Subscription : ", res);
        }

        //this.setAlternateShipingAddressFromSession();

        this.commonDataService.SelectedAlternateShipingAddress = this.selectedAlternateShipingAddress;

    });

    getCarts(): void {
        this.cartsData = null;
        this.cartMessage = "loading cart items ...";
        this.defaultBranchValue = this.commonDataService.Branch.defaultDeliveryFee;
        let searchData = Object.assign(new CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId
        });
        this.cartService.getCarts(searchData)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "getCarts", "getCarts", c);
                }
                else {
                    if (!c || c.carts == undefined || c.carts == null || c.carts.length == 0) {
                        this.cartsData = [];
                        this.cartMessage = "cart item is not available.";
                    }
                    else {
                        let carts = c.carts;
                        this.completeCartData = c.carts;

                        this.commonDataService.CartId = carts[0].cartId;
                        this.cartsData = _.reject(<any[]>carts, function (item) {
                            return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });

                        if (c.hasError) {
                            this.notification.showMultilineNotification(c.errorMessages);
                        }
                        this.PONumber = carts[0].poNumber == "" || carts[0].poNumber == null ? this.PONumber : carts[0].poNumber;
                        this.UnitNumber = carts[0].unitNumber == "" || carts[0].unitNumber == null ? this.commonDataService.UnitNumberValue : carts[0].unitNumber;
                        this.specialInstructions = carts[0].specialInstruction == "" || carts[0].specialInstruction == null ? this.commonDataService.SpecialInstructions : carts[0].specialInstruction;
                        if (c.carts.length >= 1) {
                            this.setAlternateShipingAddressFromDatabase(carts[0]);
                        }
                        let regularCartItems = _.reject(<any[]>this.cartsData, function (item) {
                            return item.couponId != null || item.isBuyout == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });
                        this.hasUnprocuredZeroQtyItems = _.filter(<any[]>regularCartItems, function (item) {
                            return item.quantityAvailable == 0 || (item.isSplit == true && item.isSTO == false);
                        }).length > 0;
                        //this.hasUnprocuredZeroQtyItems = _.filter(<any[]>regularCartItems, function (item) {
                        //    return item.quantityAvailable == 0;
                        //}).length > 0;   

                        this.total = this.calculateCartTotals();

                        this.freight = _.filter(<any[]>carts, function (row) {
                            return row.isFreight == true;
                        });

                        if (this.freight && this.freight.length > 0) {
                            this.estimatedFrieght = this.freight[0].finalPrice;
                            this.total = this.total + this.estimatedFrieght;
                            this.showFrieghtRow = true;
                        }
                        else {
                            this.estimatedFrieght = 0;
                            this.showFrieghtRow = false;
                        }

                        this.delivery = _.filter(<any[]>carts, function (row) {
                            return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                        });

                        if (this.delivery && this.delivery.length > 0) {
                            this.estimatedDelivery = c.carts[0].deliveryType == DeliveryType[DeliveryType.Pickup] ? 0 : this.delivery[0].finalPrice;
                            this.total = this.total + this.estimatedDelivery;
                            this.showDeliveryRow = true;
                        }
                        else {
                            this.estimatedDelivery = 0;
                            this.showDeliveryRow = false;
                        }

                        this.selectedDelivery = c.carts[0].deliveryType;
                    }
                }
                //this.changeDetectorRef.detectChanges();
                console.log("Checkout Cart Data : ", c);
                this.validAlternateShipingAddress();

                if (this.isBranchChanged) {
                    let appInsightBilling = Object.assign(new AppInsightBilling(), {
                        userId: this.commonDataService.UserId,
                        searchTerm: '',
                        customerNumber: this.commonDataService.Customer.customerNumber,
                        customerName: this.commonDataService.Customer.customerName,
                        cartNumber: this.commonDataService.CartId,
                        PONumber: this.PONumber,
                        source: SourceLocationType[SourceLocationType.Checkout],
                        unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
                    });
                    if (this.branchDataUpdated != undefined && this.branchDataUpdated != null) {
                        if (this.branchDataUpdated.previousBranch != undefined && this.branchDataUpdated.previousBranch != null) {
                            appInsightBilling.previousBranch = this.branchDataUpdated.previousBranch.code;
                        }
                        if (this.branchDataUpdated.newBranch != undefined && this.branchDataUpdated.newBranch != null) {
                            appInsightBilling.currentBranch = this.branchDataUpdated.newBranch.code;
                        }
                    }
                    appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.completeCartData, JSON.stringify(appInsightBilling).length);
                    this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                    this.isBranchChanged = false;
                }
            },
            error => { });
    }

    editFreight(editedPrice: any) {
        if (editedPrice.toString() == "") {
            this.estimatedFrieght = "0";
            editedPrice = "0";
            this.freight[0].listPrice = 0;
            this.freight[0].finalPrice = 0;
        }
        let decimalCheckResult: any = this.checkIsDecimal(editedPrice);
        if (decimalCheckResult) {
            this.freight[0].listPrice = +editedPrice;
            this.freight[0].finalPrice = +editedPrice;
            this.showFrieghtLoader = true;
            this.cartService.UpdateCartFreightAndDelivery(this.freight[0].cartId, this.freight[0].cartItemId, editedPrice)
                .then(carts => {
                    //  this.getCarts();
                    this.showFrieghtLoader = false;
                }, error => { this.showFrieghtLoader = false; });
        }
    }

    editDelivery(editedPrice: any) {
        if (editedPrice.toString() == "") {
            this.estimatedDelivery = "0";
            editedPrice = "0";
            this.delivery[0].listPrice = 0;
            this.delivery[0].finalPrice = 0;
        }
        let decimalCheckResult: any = this.checkIsDecimal(editedPrice);
        if (decimalCheckResult) {
            this.delivery[0].listPrice = +editedPrice;
            this.delivery[0].finalPrice = +editedPrice;
            this.showDeliveryLoader = true;
            this.cartService.UpdateCartFreightAndDelivery(this.delivery[0].cartId, this.delivery[0].cartItemId, editedPrice)
                .then(carts => {
                    // this.getCarts();
                    this.showDeliveryLoader = false;
                }, error => { this.showDeliveryLoader = false; });
        }
    }

    checkIsDecimal(input: any) {
        return (/^(\d+\.?\d*|\.\d+)$/).test(input);
    }

    getAlternateShippingCustomers(hasSingleAddressCheck: boolean = false) {
        this.alertnateAddressMessage = "loading alternate shipping addresses ...";
        let customerSearch: CustomerSearch = Object.assign(new CustomerSearch(), {
            CustomerType: "WE",
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            BranchCode: this.commonDataService.Branch.code,
            UserId: this.commonDataService.UserId
            //AccountGroups: ["Z001", "Z002"]
        });
        this.showAlternateShipingAddressLoader = true;
        this.partsSearchService.getCustomers(customerSearch)
            .then(c => {
                this.showAlternateShipingAddressLoader = false;
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "getAlternateShippingCustomers", "getCustomers", c);
                }
                else {
                    if (!c || !c.customers || c.customers.length == 0) {
                        this.alternateShippingCustomers = null;
                        this.billingMessage = "alternate shipping address is not available.";
                    }
                    else {
                        if (hasSingleAddressCheck && c.customers.length == 1 && c.customers[0].payerNotValidInBranch == false) {
                            this.isAlternateShipingAddressSelected = true;
                            this.selectedAlternateShipingAddress = c.customers[0];
                            this.editedAlternateShipingAddress = c.customers[0];

                            this.editAlternateAddressFlag = false;
                            if (this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
                                this.editAlternateAddressFlag = true;
                                if (this.commonDataService.SelectedAlternateShipingAddress == null) {
                                    this.editedAlternateShipingAddress.customerName = "";
                                    this.editedAlternateShipingAddress.phoneNumber = "";
                                }
                            }
                            this.validAlternateShipingAddress();
                            this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                        }
                        else if (hasSingleAddressCheck && c.customers.length == 1 && c.customers[0].payerNotValidInBranch == true) {
                            this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                        }
                        else if (!hasSingleAddressCheck) {
                            if (c.customers.length == 1 && this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
                                this.customerModalService.notifyCustomerSelection({ data: c.customers });
                            }
                            else {
                                this.customerModalService.notifyShowCustomerModal({ data: { customers: c.customers, customerSearchTerm: '' } });
                            }
                        }
                    }
                }
                //this.changeDetectorRef.detectChanges();
                console.log("Checkout Alternate Shipping Address : ", c);
            },
            error => { this.showAlternateShipingAddressLoader = false; });
    }

    getBillingTypeCustomers() {
        this.billingMessage = "loading billing types ...";
        let customerSearch: CustomerSearch = Object.assign(new CustomerSearch(), {
            CustomerType: "RG",
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            BranchCode: this.commonDataService.Branch.code,
            UserId: this.commonDataService.UserId
        });
        this.partsSearchService.getCustomers(customerSearch)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "getBillingTypeCustomers", "getCustomers", c);
                }
                else {
                    if (!c || !c.customers || c.customers.length == 0) {
                        this.billingTypeCustomers = null;
                        this.billingMessage = "billing type is not available.";
                    }
                    else {
                        //if (c.customers.length == 1 && this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
                        //    this.getAlternateShippingCustomers();
                        //}
                        this.billingTypeCustomers = c.customers;
                        this.isBillingTypeCustomers = true;
                        let defaultselected = _.filter(<any[]>this.billingTypeCustomers, function (row) {
                            return row.isDefault == true && row.payerNotValidInBranch == false;
                        });

                        let selectedBillingType: any = this.commonDataService.SelectedBillingType;
                        if (selectedBillingType != null) {
                            this.selectedBillingType = selectedBillingType;
                            this.defaultBillingType = selectedBillingType.addressNumber;
                        }
                        else if (defaultselected && defaultselected.length == 1) {
                            this.selectedBillingType = defaultselected[0];
                            this.defaultBillingType = defaultselected[0].addressNumber;
                            this.PayerInValidInBranch = defaultselected[0].payerNotValidInBranch;
                        }
                        else if (defaultselected && defaultselected.length > 0) {
                            this.selectedBillingType = defaultselected;
                            this.defaultBillingType = defaultselected[0].addressNumber;
                            this.PayerInValidInBranch = defaultselected[0].payerNotValidInBranch;
                        }
                        else if (this.billingTypeCustomers.length == 1) {
                            //This else part added to make billing type selected in case default is not set from SAP and when there is only 1 billing type
                            this.selectedBillingType = this.billingTypeCustomers[0];
                            this.defaultBillingType = this.billingTypeCustomers[0].addressNumber;
                            this.PayerInValidInBranch = this.billingTypeCustomers[0].payerNotValidInBranch;
                        }
                    }
                }
                //this.changeDetectorRef.detectChanges();
                console.log("Checkout BillingTypes : ", c);
            },
            error => { });
    }

    calculateCartTotals() {
        let totalPrice = 0;
        if (this.cartsData) {
            this.cartsData.forEach((d) => {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                    //totalPrice += d.quantity * d.finalPrice;
                    totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
                }
            });
        }
        return totalPrice;
    }

    selectDifferentAddress() {
        this.isAlternateShipingAddressSelected = false;
        this.editAlternateAddressFlag = false;
        this.IsAlternateAddressEdited = false;
        this.selectedAlternateShipingAddress = null;
        this.editedAlternateShipingAddress = null;
        this.commonDataService.SelectedAlternateShipingAddress = this.selectedAlternateShipingAddress;
        //this.changeDetectorRef.detectChanges();
        this.getAlternateShippingCustomers();
    }

    validAlternateShipingAddress() {
        this.AlternateShipingAddressErrorMessage = "";
        if (this.commonDataService.Customer.customerNumber == this.commonDataService.DefaultCustomer.customerNumber) {
            this.isValidAlternateShipingAddress =
                this.selectedAlternateShipingAddress.customerName.length > 0
                && this.selectedAlternateShipingAddress.phoneNumber.length > 0;

            if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery.toString() == DeliveryType[DeliveryType.Pickup] && this.selectedAlternateShipingAddress.customerName.length <= 0 && this.selectedAlternateShipingAddress.phoneNumber.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Customer name and phone number is required";
            else if (this.selectedAlternateShipingAddress.customerName.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Customer name is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery.toString() != DeliveryType[DeliveryType.Pickup] && this.selectedAlternateShipingAddress.streetAddress.length <= 0)
                this.AlternateShipingAddressErrorMessage = "Street Address is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery != DeliveryType[DeliveryType.Pickup] && this.selectedAlternateShipingAddress.city.length <= 0)
                this.AlternateShipingAddressErrorMessage = "City is required";
            else if (this.selectedDelivery != null && this.selectedDelivery != 'Undefined' && this.selectedDelivery != "" && this.selectedDelivery != DeliveryType[DeliveryType.Pickup] && this.selectedAlternateShipingAddress.postalCode.length <= 0)
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
    }

    updateAlternateAddress() {
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
    }

    padRight(num: number, size: number): string {
        var s = num + "";
        while (s.length < size) s = s + "0";
        return s;
    }

    placeOrder() {
        this.loader.loading = true;
        let alternateShipingAddress: any = this.selectedAlternateShipingAddress;
        let zipcode: any = alternateShipingAddress.postalCode;

        zipcode = zipcode.replace("-", "");
        zipcode = this.padRight(zipcode, 9);
        var b = "-";
        var position = 5;
        zipcode = [zipcode.slice(0, position), b, zipcode.slice(position)].join('');

        let salesPerson: string = alternateShipingAddress.accountManagerName != null && alternateShipingAddress.accountManagerName != "" ? alternateShipingAddress.accountManagerName : "";
        salesPerson = salesPerson + (alternateShipingAddress.accountManager != null && alternateShipingAddress.accountManager != "" ? " (" + alternateShipingAddress.accountManager + ")" : "");

        let orderInfo = Object.assign(new OrderInfo(), {
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
            .then(result => {
                if (result.ErrorType != undefined && result.ErrorType != null && result.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "placeOrder", "placeOrder", result);
                    //this.removeCouponCartItems(couponCartItem);                    
                }
                else {
                    // this.notification.showNotification(`Order placed successfully. SAP order number is <b>${result.sapOrderNumber}</b>.`, NotificationType.Success);
                    if (result.sapOrderNumber != 0 && result.sapOrderNumber != "" && result.sapOrderNumber != null && !result.errorMessage) {
                        if (orderInfo.OrderType == "Quote") {
                            let sourceName = "CheckoutComponent_placeOrder_placeOrder_Quote";
                            let metricName = this.applicationInsightsService.getMetricValue(sourceName);
                            let appInsightQuote = Object.assign(new AppInsightQuote(), {
                                userId: this.commonDataService.UserId,
                                customerNumber: this.commonDataService.Customer.customerNumber,
                                customerName: this.commonDataService.Customer.customerName,
                                branchNumber: this.commonDataService.Branch.code,
                                cartNumber: this.commonDataService.CartId,
                                PONumber: this.PONumber,
                                orderNumber: result.sapOrderNumber,
                                plMetricName: sourceName,
                                unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
                            });
                            appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(this.completeCartData, JSON.stringify(appInsightQuote).length);
                            this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
                        } else {
                            let sourceName = "CheckoutComponent_placeOrder_placeOrder_Order";
                            let metricName = this.applicationInsightsService.getMetricValue(sourceName);
                            let appInsightOrder = Object.assign(new AppInsightOrder(), {
                                userId: this.commonDataService.UserId,
                                customerNumber: this.commonDataService.Customer.customerNumber,
                                customerName: this.commonDataService.Customer.customerName,
                                branchNumber: this.commonDataService.Branch.code,
                                cartNumber: this.commonDataService.CartId,
                                PONumber: this.PONumber,
                                orderNumber: result.sapOrderNumber,
                                plMetricName: sourceName,
                                unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
                            });
                            appInsightOrder.lineItems = this.applicationInsightsService.getAppInsightParts(this.completeCartData, JSON.stringify(appInsightOrder).length);
                            this.applicationInsightsService.trackMetric(metricName, appInsightOrder);
                        }
                        this.updateCouponRedeemCount();
                        this.router.navigate(['orderconfirmation'], { queryParams: { orderId: result.orderId } });
                    }
                    else {
                        //this.removeCouponCartItems(couponCartItem);
                        this.notification.showNotificationWithoutTimeout(`Your order was not Processed into sap: ${result.errorMessage ? result.errorMessage : result.message}.`, NotificationType.Error);
                    }
                    this.commonDataService.SelectedAlternateShipingAddress = null;
                }
                console.log("Checkout Place order : ", result);
                this.loader.loading = false;
            },
            error => { this.loader.loading = false; });
    }

    updateCouponRedeemCount() {
        if (this.commonDataService.Coupons != null) {
            if (this.cartsData.filter((cartItem) => cartItem.partNumber === this.commonDataService.Coupons.couponSAPPartNumber).length > 0) {
                this.couponService.createCouponRedemption(this.commonDataService.Coupons.couponId, this.commonDataService.Coupons.customerSegmentId)
                    .then(carts => {
                        if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                            this.notification.errorMessage("CouponModalComponent", "addCouponToCart", "addCouponToCart", carts);
                        }
                        else {
                            this.commonDataService.Coupons = null;
                            this.commonDataService.CouponVendors = null;
                        }
                        console.log("Coupon added : ", carts);
                    },
                    error => { });
            }
            else {
                let unusedCoupon = Object.assign(new AppInsightUnusedCoupon(), {
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
    }

    onBillingTypeChange(billingType: any) {
        this.selectedBillingType = billingType;
        this.storeBillingType = billingType.customerName;
        this.storeBilliTOAddressNO = billingType.addressNumber;
        this.commonDataService.SelectedBillingType = billingType;
        this.updateAdditionalCartInfo();
        if (billingType != null && billingType.payerNotValidInBranch) {
            this.PayerInValidInBranch = true;
        }
    }

    onDeliveryOptionChange(cartItem: any, deliveryOption: string) {
        console.log("============== DeliveryType Enum ==============");
        console.log(DeliveryType[DeliveryType.Pickup]);
        console.log(DeliveryType[DeliveryType.Delivery]);
        console.log(DeliveryType[DeliveryType.ShipTo]);
        console.log("============== DeliveryType Enum ==============");
        this.validAlternateShipingAddress();

        if (deliveryOption != DeliveryType[DeliveryType.Pickup]) {
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
    }

    addToCart() {
        let deliveryPrice: number = 0;
        let isRTCDelivery: boolean = false;
        let isCustomerDelivery: boolean = false;
        switch (this.selectedDelivery) {
            case DeliveryType[DeliveryType.Pickup]:
                deliveryPrice = 0;//cartItem.listPrice != null ? cartItem.listPrice : 0; 
                isRTCDelivery = false;
                isCustomerDelivery = false;
                break;
            case DeliveryType[DeliveryType.Delivery]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; //(cartItem.listPrice != null ? cartItem.listPrice : 0) + this.commonDataService.RTC_Delivery_Value; break;
                isRTCDelivery = true;
                isCustomerDelivery = false;
                break;
            case DeliveryType[DeliveryType.ShipTo]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee;// this.commonDataService.RTC_Freight_Delivery_Value + (cartItem.listPrice != null ? cartItem.listPrice : 0); break;
                isRTCDelivery = false;
                isCustomerDelivery = true;
        };

        let addtoCartParameters: any = Object.assign(new Cart(), {
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
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "addToCart", "addToCart", carts);
                }
                else {
                    this.delivery = [carts];
                    this.estimatedDelivery = deliveryPrice;
                    this.showDeliveryRow = true;
                }
                console.log("Checkout component add to carts : ", carts);
            },
            error => { });
    }

    UpdateCartItem(cartItem: any) {
        let deliveryPrice: number = 0;
        this.showDeliveryLoader = true;
        switch (this.selectedDelivery) {
            case DeliveryType[DeliveryType.Pickup]:
                deliveryPrice = 0;//cartItem.listPrice != null ? cartItem.listPrice : 0; 
                break;
            case DeliveryType[DeliveryType.Delivery]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee; //(cartItem.listPrice != null ? cartItem.listPrice : 0) + this.commonDataService.RTC_Delivery_Value; break;
            case DeliveryType[DeliveryType.ShipTo]:
                deliveryPrice = this.commonDataService.Branch.defaultDeliveryFee;// this.commonDataService.RTC_Freight_Delivery_Value + (cartItem.listPrice != null ? cartItem.listPrice : 0); break;
        }
        let updateCartItemData = Object.assign(new UpdateCart(), {
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
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "UpdateCartItem", "UpdateCartItem", carts);
                }
                else {
                    //this.getCarts();
                    this.estimatedDelivery = deliveryPrice;
                }
                this.showDeliveryLoader = false;
            },
            error => { this.showDeliveryLoader = false; });
    }

    updateAdditionalCartInfo() {
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
                .then(carts => {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        this.notification.errorMessage("CheckoutComponent", "updateUnitNumber", "UpdateUnitNumber", carts);
                    }
                    else {

                    }
                },
                error => { });
        }
    }

    updateUnitNOPOSI() {
        if (this.commonDataService.CartId != null && this.commonDataService.CartId != "") {
            this.cartService.updateUnitNOPOSI(this.UnitNumber, this.PONumber, this.specialInstructions, this.commonDataService.CartId)
                .then(carts => {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        this.notification.errorMessage("CheckoutComponent", "updateUnitNumber", "UpdateUnitNumber", carts);
                    }
                    else {

                    }
                },
                error => { });
        }
    }




    onOrderTypeChange(newValue) {
        this.orderType = newValue;
        console.log("Checkout ordertype change : ", newValue);
    }

    _keyPress(event: any) {
        const pattern = /[0-9\.]/;
        let inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    SetDelivery(cartId: string, flag: number) {
        this.cartService.SetDelivery(cartId, flag)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "DeleteCartItem", "DeleteCartItem", carts);
                }
                else { }
            },
            error => { });
    }

    DeleteCartItem(cartId: string, cartItemId: string, isFrieght: boolean, isPickupDeliveryType: boolean) {
        let sourceName = "CheckoutComponent_DeleteCartItem";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightQuote = Object.assign(new AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(isFrieght ? this.freight[0] : this.delivery[0], JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);


        let deleteCartItems: Array<any> = new Array<any>();
        let _item = {
            cartItemId: cartItemId,
        };
        deleteCartItems.push(_item);

        let deleteCartItemParameters = {
            cartId: cartId,
            isPickupDeliveryType: isPickupDeliveryType,
            deleteCartItems: deleteCartItems
        }

        this.cartService.DeleteCartItem(deleteCartItemParameters)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CheckoutComponent", "DeleteCartItem", "DeleteCartItem", carts);
                }
                else {
                    //this.getCarts();
                    if (isFrieght) {
                        this.showFrieghtRow = false;
                        this.freight = [];
                        this.estimatedFrieght = 0;
                    }
                    else {
                        this.showDeliveryRow = false;
                        this.delivery = [];
                        this.estimatedDelivery = 0;
                    }
                }
            },
            error => { });
    }
    onCustomerKeypress(event) {
        if (event.keyCode == 13) {
            jQuery('#btnPlaceOrder').focus();
            event.preventDefault();
            return false;
        }
    }

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

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.customerModalSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
    }
}
