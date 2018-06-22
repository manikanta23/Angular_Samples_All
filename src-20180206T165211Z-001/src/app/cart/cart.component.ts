import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, ElementRef } from "@angular/core";
//import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { CartService } from "./cart.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CartSearch } from "./../_entities/cart.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { PartBuyoutModalComponent } from "./../search/modal/partbuyout/partbuyout.component";

import { PriceVerifyComponent } from "./../parts/details/price-verify/price-verify.component";
import { MscPriceVerifyPart } from "./../_entities/msc-price-verify-part";
import { HotFlagComponent } from './procurement-modal/hot-flag.component'
import { KnownPartBuyoutComponent } from './procurement-modal/known-part-buyout.component'
import { UserService } from "./../user/user.service";

import { VendorsService } from "./../search/modal/vendors/vendors.service";
import { VendorComponent } from "./../vendor/vendor.component";

declare var jQuery: any;
import * as _ from "lodash";
import { SourceLocationType, ApplicationInsightsService } from "../_common/services/application-insights.service";
import { AppInsightQuote } from "../_entities/app-insight-quote.entity";
import { UpdateCart } from "../_entities/update-cart-entity";

import { CouponService } from "../search/modal/coupon/coupon.service";
import { AppInsightHotFlag } from "../_entities/app-insight-hot-flag.entity";

import { AppInsightCustomerChange } from "../_entities/app-insight-customer-change.entity";
import { AppInsightBilling } from "../_entities/app-insight-billing.entity";
import { StockTransferOrderComponent } from "./procurement-modal/stock-transfer-order.component";


@Component({
    templateUrl: `./src/app/cart/cart.component.html?v=${new Date().getTime()}`
})

export class CartComponent implements OnInit, OnDestroy {
    @ViewChild('partBuyoutModal') partBuyoutComponent: PartBuyoutModalComponent;
    @ViewChild('priceVerify') priceVerifyComponent: PriceVerifyComponent;
    @ViewChild('hotFlag') hotFlagComponent: HotFlagComponent;
    @ViewChild('knownPartBuyout') knownPartBuyoutComponent: KnownPartBuyoutComponent;
    @ViewChild('stockTransfer') stockTransferOrderComponent: StockTransferOrderComponent;

    cartsData: any;
    partsBuyOutData: any;
    hotFlagData: any;
    stockTransferData: any;
    cartCount: any;
    cartSubTotalAmount: any;
    mycartCount: any;
    errorMessage: any;
    cartItemId: string;
    cartId: string;
    yourPrice: number;
    listPrice: number;
    deliveryType: string = "";
    estimatedFrieght: number = 0;
    estimatedDelivery: number = 0;
    isPriceAdjustmentActive: boolean = false;
    isDefaultVendorSelected: boolean = true;
    defaultVendorCode: string = "";
    isPartBuyOutCorePart: boolean = false;
    searchData: CartSearch = new CartSearch();
    total: number = 0;
    cartMessage: string = "";
    defaultBranchValue: number = 0;
    partSearchTerm: string = "";
    subscription: any = null;
    branchSubscription: any = null;
    branchName: string;
    branchCode: string;
    branchCity: string;
    adjustedPriceValue: number;
    selectedAdjustedPriceReason: number = 0;
    freight: any;
    delivery: any;
    cartCountSubscription: any;
    selectedRushPartNumber: string = "";
    priceAdjustmentMessage: string = "";

    isQuantityChanged: boolean = false;

    //Procurement....
    selectedCartItemArray: Array<any> = new Array<any>();
    disableProcurementbuttons: boolean = false;
    //Procurement....

    //HotFlag list...
    hotFlags: any;
    //HotFlag list...

    doNotShowPricingAlert: boolean = false;

    branchDataUpdated: any;

    isMscOrFleetCustomer: boolean = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
        ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
    mscPayerSubscription: any = null;
    sourceLocationType = SourceLocationType;
    completeCartItems: any = null;

    //coupon....
    couponCodeSearchTerm: string = null;
    searchedCouponData: any = null;
    isProcessingCoupon: boolean = false;
    isCouponSelected: boolean = this.commonDataService.Coupons != null && this.commonDataService.Coupons != undefined
    && this.commonDataService.Coupons.couponCode != null && this.commonDataService.Coupons.couponCode != undefined && this.commonDataService.Coupons.couponCode != "";

    defaultPrices: any = null;

    isBranchChanged: boolean = false;
    branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe((d: any) => {
        this.isBranchChanged = true;
        this.branchDataUpdated = d;
    });

    isCustomerChanged: boolean = false;
    customerDataOnCustomerChange: any = null;
    PONumber: any = "";
    customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe((d: any) => {
        this.isCustomerChanged = true;
        this.customerDataOnCustomerChange = d;
    });

    constructor(private loader: LoaderService,
        private activatedRoute: ActivatedRoute,
        private cartService: CartService,
        private title: Title,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private commonDataService: CommonDataService,
        private vendorsService: VendorsService,
        private userService: UserService,
        private elementRef: ElementRef,
        private notification: NotificationService,
        private couponService: CouponService,
        private applicationInsightsService: ApplicationInsightsService) {
        title.setTitle("Cart - Parts Link");
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.cartsData = null;
        this.partsBuyOutData = null;
        this.hotFlagData = null;
        this.stockTransferData = null;
        this.subscription = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
            //this.getDefaultBranchValue();
            this.getCarts();
            this.branchName = this.commonDataService.Branch.name;
            this.branchCode = this.commonDataService.Branch.code;
            this.branchCity = this.commonDataService.Branch.city;
            this.loader.loading = false;
        });

        this.cartCountSubscription = this.cartService.notifyCartChangeEventEmitter.subscribe((d: any) => {
            this.getCarts();
            //this.selectedCartItemArray = new Array<any>();
        });

        this.mscPayerSubscription = this.commonDataService.mscPayerUpdated.subscribe((d: any) => {
            this.isMscOrFleetCustomer = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
                ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        });

        //this.getDefaultBranchValue();
        this.branchName = this.commonDataService.Branch.name;
        this.branchCode = this.commonDataService.Branch.code;
        this.branchCity = this.commonDataService.Branch.city;
        this.getCarts();
        this.getHotFlags();
        
        if ((this.commonDataService.UserIsPricingAlertEnabled == "True" || this.commonDataService.UserIsPricingAlertEnabled == "true") && this.isMscOrFleetCustomer)
            jQuery("#pricingAlertPopup").modal("show");
    }

    getDefaultBranchValue(): void {
        this.cartService.CheckDefaultBranchValue(this.commonDataService.Branch.code)
            .then(b => {
                if (b.ErrorType != undefined && b.ErrorType != null && b.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "getDefaultBranchValue", "CheckDefaultBranchValue", b);
                }
                else {
                    this.defaultBranchValue = b;
                }
            },
            error => { });
    }

    getCarts(): void {
        //this.cartsData = null;
        //this.partsBuyOutData = null;
        //this.hotFlagData = null;
        //this.stockTransferData = null;
        this.isQuantityChanged = false;
        this.cartCount = 0;
        this.mycartCount = 0;
        this.completeCartItems = null;
        this.selectedCartItemArray = new Array<any>();

        this.cartMessage = "loading cart items ...";
        this.searchData = Object.assign(new CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId
        });
        this.cartService.getCarts(this.searchData)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "getCarts", "getCarts", c);
                }
                else {
                    if (!c || c.carts == undefined || c.carts == null || c.carts.length == 0) {
                        this.cartsData = null;
                        this.partsBuyOutData = null;
                        this.hotFlagData = null;
                        this.stockTransferData = null;
                        this.cartCount = 0;
                        this.mycartCount = 0;
                        this.cartMessage = "cart item is not available.";
                    }
                    else {
                        let carts = c.carts;
                        this.completeCartItems = c.carts;
                        this.commonDataService.CartId = c.carts[0].cartId;
                        this.PONumber = c.carts[0].poNumber == "" || c.carts[0].poNumber == null ? this.commonDataService.Customer.customerPONumber : c.carts[0].poNumber;

                        if (c != undefined && c != null && c.carts != undefined && c.carts != null && c.carts.length > 0) {
                            c.carts.forEach((t) => {
                                t.hasCoupon = this.commonDataService.checkPartCouponVendorAssociation(t.partNumber);
                            });
                        }
                        if (c.hasError) {
                            this.notification.showMultilineNotification(c.errorMessages);
                        }
                        this.freight = _.filter(<any[]>carts, function (row) {
                            return row.isFreight == true;
                        });

                        let couponItem = _.filter(<any[]>carts, function (row) {
                            return row.couponId != null && row.couponId != "";
                        })
                        this.isCouponSelected = couponItem.length > 0 || (this.commonDataService.Coupons != null && this.commonDataService.Coupons != undefined
                            && this.commonDataService.Coupons.couponCode != null && this.commonDataService.Coupons.couponCode != undefined && this.commonDataService.Coupons.couponCode != "");

                        if (this.freight && this.freight.length > 0) {
                            this.estimatedFrieght = this.freight[0].finalPrice;
                        }

                        this.delivery = _.filter(<any[]>carts, function (row) {
                            return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                        });

                        if (this.delivery && this.delivery.length > 0) {
                            this.estimatedDelivery = this.delivery[0].finalPrice;
                        }

                        this.cartsData = _.reject(<any[]>carts, function (item) {
                            return item.isBuyout == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });

                        this.partsBuyOutData = _.filter(<any[]>carts, function (row) {
                            return row.isBuyout == true;
                        });

                        this.hotFlagData = _.filter(<any[]>carts, function (row) {
                            return row.isHotFlag == true;
                        });

                        this.stockTransferData = _.filter(<any[]>carts, function (row) {
                            return row.isSTO == true;
                        });

                        console.log("cartsData :", this.cartsData, " partsBuyOutData :", this.partsBuyOutData, " hotFlagData :", this.hotFlagData, " stockTransferData :", this.stockTransferData)

                        // this.cartsData = carts;
                        this.cartCount = this.cartsData.length + this.partsBuyOutData.length + this.hotFlagData.length + this.stockTransferData.length;
                        this.cartSubTotalAmount = this.calculateCartTotals();
                        this.mycartCount = this.cartsData.length + this.partsBuyOutData.length + this.hotFlagData.length + this.stockTransferData.length;
                        this.total = this.calculateCartTotals() + this.estimatedFrieght + this.estimatedDelivery;

                        if ((!this.cartsData && !this.partsBuyOutData && !this.hotFlagData && !this.stockTransferData) || (this.cartsData.length <= 0 && this.partsBuyOutData.length <= 0 && this.hotFlagData.length <= 0 && this.stockTransferData.length <= 0)) {
                            this.cartsData = null;
                            this.partsBuyOutData = null;
                            this.hotFlagData = null;
                            this.stockTransferData = null;
                            this.cartCount = 0;
                            this.mycartCount = 0;
                            this.cartMessage = "cart item is not available.";
                        }
                    }
                    if (this.isCustomerChanged) {
                        let appInsightCustomerChange = Object.assign(new AppInsightCustomerChange(), {
                            userId: this.commonDataService.UserId,
                            searchTerm: '',
                            branchNumber: this.commonDataService.Branch.code,
                            cartNumber: this.commonDataService.CartId,
                            source: SourceLocationType[SourceLocationType.Cart]
                        });
                        if (this.customerDataOnCustomerChange != undefined && this.customerDataOnCustomerChange != null) {
                            if (this.customerDataOnCustomerChange.previousCustomer != undefined && this.customerDataOnCustomerChange.previousCustomer != null) {
                                appInsightCustomerChange.previousCustomerNumber = this.customerDataOnCustomerChange.previousCustomer.customerNumber;
                                appInsightCustomerChange.previousCustomerName = this.customerDataOnCustomerChange.previousCustomer.customerName;
                            }
                            if (this.customerDataOnCustomerChange.newCustomer != undefined && this.customerDataOnCustomerChange.newCustomer != null) {
                                appInsightCustomerChange.currentCustomerNumber = this.customerDataOnCustomerChange.newCustomer.customerNumber;
                                appInsightCustomerChange.currentCustomerName = this.customerDataOnCustomerChange.newCustomer.customerName;
                            }
                        }
                        appInsightCustomerChange.products = this.applicationInsightsService.getAppInsightParts(this.completeCartItems, JSON.stringify(appInsightCustomerChange).length);
                        this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
                        this.isCustomerChanged = false;
                        this.customerDataOnCustomerChange = null;
                    }

                    if (this.isBranchChanged) {
                        let appInsightBilling = Object.assign(new AppInsightBilling(), {
                            userId: this.commonDataService.UserId,
                            searchTerm: '',
                            customerNumber: this.commonDataService.Customer.customerNumber,
                            customerName: this.commonDataService.Customer.customerName,
                            cartNumber: this.commonDataService.CartId,
                            PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                            source: SourceLocationType[SourceLocationType.Cart],
                            unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue,
                        });
                        if (this.branchDataUpdated != undefined && this.branchDataUpdated != null) {
                            if (this.branchDataUpdated.previousBranch != undefined && this.branchDataUpdated.previousBranch != null) {
                                appInsightBilling.previousBranch = this.branchDataUpdated.previousBranch.code;
                            }
                            if (this.branchDataUpdated.newBranch != undefined && this.branchDataUpdated.newBranch != null) {
                                appInsightBilling.currentBranch = this.branchDataUpdated.newBranch.code;
                            }
                        }
                        appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.completeCartItems, JSON.stringify(appInsightBilling).length);
                        this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                        this.isBranchChanged = false;
                    }
                }
            },
            error => { });
    }

    getHotFlags(): void {
        this.hotFlags = null;

        this.cartService.getHotFlags()
            .then(h => {
                if (h.ErrorType != undefined && h.ErrorType != null && h.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "getCarts", "getCarts", h);
                }
                else {
                    this.hotFlags = h;
                }

                console.log("hotFlags Data : ", h);
            },
            error => { });
    }

    onChangePriceOverride(newValue) {
        console.log("Cart onChangePriceOverride : ", newValue);
        this.selectedAdjustedPriceReason = newValue;
    }

    clrPriceOverride() {
        this.adjustedPriceValue = null;
        this.selectedAdjustedPriceReason = 0;
    }

    priceOverride(selectedCartItem) {
        this.selectedRushPartNumber = "";
        this.adjustedPriceValue = null;
        this.selectedAdjustedPriceReason = 0;
        this.cartId = selectedCartItem.cartId;
        this.cartItemId = selectedCartItem.cartItemId;
        this.yourPrice = selectedCartItem.customerPrice;
        this.listPrice = selectedCartItem.listPrice;
        this.selectedRushPartNumber = selectedCartItem.partNumber;
        jQuery('body').on('shown.bs.modal', '#priceoverrideOnCart', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    }

    setCartAdjustedPrice(adjustedPrice: number, priceOverrideReasonId: number) {
        let priceOverrideLowerLimit: any = this.yourPrice;
        let priceTobeAdjusted: any = this.listPrice;

        let priceOverrideFactor: any = this.commonDataService.Price_Override_Factor;
        //adjusted Price is within x% of cost price, e.g. 10%
        let calulatedPercentagePrice: any = (priceTobeAdjusted * priceOverrideFactor) / 100;
        let lowerLimit: any = priceTobeAdjusted - calulatedPercentagePrice;
        let selectedPartNumber: string = this.selectedRushPartNumber;

        //let isCoupon: boolean = _.includes(this.commonDataService.Coupons, this.selectedRushPartNumber);
        let isCoupon: boolean = this.commonDataService.CouponCriteria.some(function (v) { return selectedPartNumber.indexOf(v) >= 0; });

        if (!isCoupon && !(adjustedPrice >= lowerLimit && adjustedPrice >= priceOverrideLowerLimit)) {
            this.notification.showNotification("You are violating the adjustment limit.", NotificationType.Error);
        }
        else {
            this.priceAdjustmentMessage = "Are You Sure? Remember! Coupons, Discounts, or Fee Credits must be entered as a negative value (e.g. $ -5.00)";
            jQuery("#confirmationPriceAdjustment").modal("show");
            jQuery("#priceoverrideOnCart").modal("hide");
        }
    }

    onPriceAdjustmentConfirmationYes() {
        let adjustedPriceData = {
            cartItemId: this.cartItemId,
            cartId: this.cartId,
            adjustedPrice: this.adjustedPriceValue,
            selectedAdjustedPriceReason: this.selectedAdjustedPriceReason
        }
        this.cartService.UpdateForAdjustedPrice(adjustedPriceData)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "setCartAdjustedPrice", "UpdateForAdjustedPrice", carts);
                }
                else {
                    jQuery("#priceoverrideOnCart").modal("hide");
                }
            },
            error => { });
    }

    removeCartItems() {
        let deleteCartItems: Array<any> = new Array<any>();
        let cartItemArray: Array<any> = new Array<any>();

        this.selectedCartItemArray.forEach((row: any) => {
            if (row.couponId == null) {
                let _item = {
                    cartItemId: row.cartItemId,
                    quantityAvailable: row.quantityAvailable,
                };
                deleteCartItems.push(_item);
                cartItemArray.push(row);
            }
            else {
                this.commonDataService.Coupons = null;
                this.commonDataService.CouponVendors = null;
            }
        });

        let removeCartData = {
            cartId: this.commonDataService.CartId,
            isPickupDeliveryType: false,
            deleteCartItems: deleteCartItems
        };

        this.cartService.DeleteCartItem(removeCartData)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "removeCartItems", "DeleteCartItem", carts);
                }
            },
            error => { });

        let sourceName = "CartComponent_removeCartItems";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightQuote = Object.assign(new AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(cartItemArray, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
    }

    updateCartItems(selectedCartItem) {
        let updateForMycart = Object.assign(new UpdateCart(), {
            cartItemId: selectedCartItem.cartItemId,
            cartId: selectedCartItem.cartId,
            price: selectedCartItem.quantity * selectedCartItem.finalPrice,
            quantity: selectedCartItem.quantity,
            corePrice: selectedCartItem.corePrice,
            coreOption: selectedCartItem.coreOption,
            partBuyoutCoreOption: selectedCartItem.partBuyoutCoreOption,
            quantityAvailable: selectedCartItem.quantityAvailable,
            deliveryType: ""
        });
        this.cartService.UpdateCartItemformycart(updateForMycart)
            .then(carts => {
                if (carts) {
                    if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                        this.notification.errorMessage("CartComponent", "updateCartItems", "UpdateCartItem", carts);
                    }
                }
            },
            error => { });
    }

    editFreight(editedPrice: number) {
        this.cartService.UpdateCartFreightAndDelivery(this.freight[0].cartId, this.freight[0].cartItemId, editedPrice)
            .then(carts => {
            }, error => { });
    }

    editDelivery(editedPrice: number) {
        this.cartService.UpdateCartFreightAndDelivery(this.delivery[0].cartId, this.delivery[0].cartItemId, editedPrice)
            .then(carts => {
            }, error => { });
    }

    processKeyUp(e, el) {
        if (e.keyCode == 65) { // press A
            el.focus();
        }
    }

    hidenotification() {
        this.notification.hideNotification();
    }

    calculateCartTotals() {
        let totalPrice = 0;
        if (this.cartsData != undefined && this.cartsData != null && this.cartsData.length > 0) {
            this.cartsData.forEach((d) => {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                    if (d.corePrice > 0 && d.coreOption == "NOCORER") {
                        totalPrice += d.quantity * (d.finalPrice + d.corePrice);
                    }
                    else {
                        totalPrice += d.quantity * d.finalPrice;
                    }
                }
            });
        }
        if (this.partsBuyOutData != undefined && this.partsBuyOutData != null && this.partsBuyOutData.length > 0) {
            this.partsBuyOutData.forEach((d) => {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.hotFlagData != undefined && this.hotFlagData != null && this.hotFlagData.length > 0) {
            this.hotFlagData.forEach((d) => {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.stockTransferData != undefined && this.stockTransferData != null && this.stockTransferData.length > 0) {
            this.stockTransferData.forEach((d) => {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        return totalPrice;
    }

    changeQuntity(cart: any, e: any) {
        if (e.which != 9) {
            this.isQuantityChanged = true;
        }
        if (e.which == 38) {
            cart.quantity = +(cart.quantity) + 1;
            this.updateCartItems(cart);
        }
        else if (e.which == 40 && cart.quantity > 1) {
            cart.quantity = cart.quantity - 1;
            this.updateCartItems(cart);
        }
    }

    onQuantityFocusout(cart: any, e: any) {
        let quantity: any = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            cart.quantity = 1;
        }

        if (this.isQuantityChanged)
            this.updateCartItems(cart);
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
    
    onChangeCartItemsHotFlag(cartItem: any, newValue) {
        cartItem.hotFlagCode = newValue;

        let updateFlagCartItems: Array<any> = new Array<any>();
        let _item = {
            cartItemId: cartItem.cartItemId,
            cartItemFlag: "IsHotFlag",
            vendorCode: cartItem.vendorCode,
            buyoutPrice: null,
            salesPrice: null,
            corePurchasePrice: null,
            corePrice: null,
            hotFlagCode: newValue,
        };
        updateFlagCartItems.push(_item);

        let updateCartData = {
            cartId: this.commonDataService.CartId,
            cartItemFlag: "IsHotFlag",
            updateFlagCartItems: updateFlagCartItems
        };

        this.cartService.UpdateCartItemFlag(updateCartData, false)
            .then(v => {
                console.log(v);
                this.notification.showNotification("HotFlag Updated Successfully for part " + cartItem.partNumber, NotificationType.Success);
            },
            error => { console.log(error); });

        let sourceName = "CartComponent_sendHotFlag";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightHotFlag = Object.assign(new AppInsightHotFlag(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightHotFlag.hotFlagCartItems = this.applicationInsightsService.getAppInsightParts(cartItem, JSON.stringify(appInsightHotFlag).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightHotFlag);
    }

    verifyPriceOfAllCartItems() {
        let mscPriceVerifyParts: Array<MscPriceVerifyPart> = new Array<MscPriceVerifyPart>();
        let parts: Array<any> = new Array<any>();

        _.each(<any[]>this.selectedCartItemArray, function (row) {
            if (row.couponId == null) {
                let _mscPart = Object.assign(new MscPriceVerifyPart(), {
                    PartNumber: row.partNumber,
                    Quantity: row.quantity,
                    UnitPrice: row.finalPrice //adjustedPrice
                });
                mscPriceVerifyParts.push(_mscPart);
                parts.push(row);
            }
        });

        this.priceVerifyComponent.mscPriceVerifyParts = mscPriceVerifyParts;
        this.priceVerifyComponent.parts = parts;
        this.priceVerifyComponent.showModal(SourceLocationType.PriceVerifyAllCartLineItems);

    }

    onMscPriceVerified(mscPriceVerifiedData: any) {
        console.log("onMscPriceVerified : ", mscPriceVerifiedData);
        if (mscPriceVerifiedData != null && mscPriceVerifiedData != undefined) {
            this.getCarts();
            //this.selectedCartItemArray = new Array<any>();
        }
    }

    hidePricingAlertPopup() {
        jQuery("#pricingAlertPopup").modal("hide");

        if (this.doNotShowPricingAlert == true) {
            this.userService.SetUserIsPricingAlert(this.commonDataService.UserId, !this.doNotShowPricingAlert)
                .then(p => {
                    if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                        this.notification.errorMessage("CartComponent", "hidePricingAlertPopup", "SetUserIsPricingAlert", p);
                    }
                    else {

                        this.commonDataService.UserIsPricingAlertEnabled = p.isPricingAlertEnabled;
                        console.log("IsPricingAlertEnabled Updated:", p);
                    }
                },
                error => { });
        }
    }

    checkout() {
        let sourceName = "CartComponent_checkout";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightQuote = Object.assign(new AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            PONumber: this.PONumber,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(this.completeCartItems, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
        this.router.navigate(['/checkout']);
    }

    searchCoupons(): void {
        this.isProcessingCoupon = true;
        this.couponService.getCoupons(this.couponCodeSearchTerm, this.commonDataService.UserId, null, this.commonDataService.Branch.code)
            .then(coupondata => {
                this.isProcessingCoupon = false;
                if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "searchCoupons", "searchCoupons", coupondata);
                }
                else if (coupondata.length > 0 && coupondata[0].couponMaxRedemptions > 0 && coupondata[0].couponMaxRedemptions <= coupondata[0].couponClaimedRedemptions) {
                    this.notification.showNotification(`Coupon has already been redeemed ${coupondata[0].couponClaimedRedemptions} of ${coupondata[0].couponMaxRedemptions} times.`, NotificationType.Error);
                }
                else if (coupondata.length > 0) {
                    this.searchedCouponData = coupondata[0];
                    jQuery("#searchedCouponDataModal").modal("show");
                }
                else {
                    this.notification.showNotification("Coupon not found.", NotificationType.Error);
                }
                console.log("DefaultCustomer Coupon data : ", coupondata);
            },
            error => { this.isProcessingCoupon = false; });
    }

    addCouponToCart() {
        let couponRequestObject = {
            cartId: this.commonDataService.CartId,
            couponId: this.searchedCouponData.couponId,
            customerSegmentId: this.searchedCouponData.customerSegmentId,
            couponCode: this.searchedCouponData.couponCode
        };

        this.loader.loading = true;
        this.couponService.addCouponToCart(couponRequestObject)
            .then(coupondata => {
                if (coupondata.ErrorType != undefined && coupondata.ErrorType != null && coupondata.ErrorType != 200) {
                    this.notification.errorMessage("CartComponent", "addCouponToCart", "addCouponToCart", coupondata);
                }
                else {
                    console.log("Add Coupon For Default Customer", coupondata);
                    if (coupondata.errorMessage != null && coupondata.errorMessage != undefined) {
                        if (!coupondata.hasError) {
                            this.notification.showNotification(coupondata.errorMessage[0].message, NotificationType.Success);

                            this.couponCodeSearchTerm = null;
                            jQuery("#searchedCouponDataModal").modal("hide");
                            this.commonDataService.Coupons = this.searchedCouponData;
                            this.isCouponSelected = true;
                            this.couponService.getCouponVendors(this.searchedCouponData.couponId)
                                .then(couponVendors => {
                                    this.commonDataService.CouponVendors = couponVendors;
                                },
                                error => { });

                            this.getCarts();
                        }
                        else {
                            if (coupondata.errorMessage.length > 1) {
                                this.notification.showMultilineNotification(coupondata.errorMessage);
                            }
                            else {
                                this.notification.showNotification(coupondata.errorMessage[0].message, coupondata.errorMessage[0].type);
                            }
                        }
                    }
                    this.loader.loading = false;
                }
            },
            error => { this.loader.loading = false; });
    }

    //Procurement Start...
    onCartItemSelectionChange(cartItem: any, isChecked: boolean) {

        let selectedItems = this.selectedCartItemArray.filter(
            (item: any) => item.cartItemId === cartItem.cartItemId);

        var index = -1;
        if (selectedItems.length > 0)
            index = this.selectedCartItemArray.indexOf(selectedItems[0]);

        if (isChecked == true && index === -1) {

            this.selectedCartItemArray.push(cartItem);
        }
        else if (isChecked == false && index != -1) {
            // Find and remove item from an array
            this.selectedCartItemArray.splice(index, 1);
        }

        this.disableProcurementbuttons = this.selectedCartItemArray.filter(
            (item: any) => item.partNumber == 'PARTSBUYOUTTX' || (item.couponId != undefined && item.couponId != null && item.couponId != '')).length > 0;
    }

    selectAll() {
        this.cartsData.filter(row => {
            row.selected = true;
            this.onCartItemSelectionChange(row, true);
        });
        this.partsBuyOutData.filter(row => {
            row.selected = true;
            this.onCartItemSelectionChange(row, true);
        });
        this.hotFlagData.filter(row => {
            row.selected = true;
            this.onCartItemSelectionChange(row, true);
        });
        this.stockTransferData.filter(row => {
            row.selected = true;
            this.onCartItemSelectionChange(row, true);
        });

    }

    unSelectAll() {
        this.cartsData.filter(row => {
            row.selected = false;
            this.onCartItemSelectionChange(row, false);
        });
        this.partsBuyOutData.filter(row => {
            row.selected = false;
            this.onCartItemSelectionChange(row, false);
        });
        this.hotFlagData.filter(row => {
            row.selected = false;
            this.onCartItemSelectionChange(row, false);
        });
        this.stockTransferData.filter(row => {
            row.selected = false;
            this.onCartItemSelectionChange(row, false);
        });
    }

    ShowHotFlagModal() {
        let selectedItems = [];
        _.each(<any[]>this.selectedCartItemArray, function (row) {
            let _item = {
                cartItemId: row.cartItemId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: (row.hotFlagCode != null && row.hotFlagCode != undefined && row.hotFlagCode !='') ? row.hotFlagCode : '',
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice
            };
            selectedItems.push(_item);
        });

        this.hotFlagComponent.showModal(selectedItems);
    }

    ShowKnownPartBuyoutModal() {
        let selectedItems = [];
        _.each(<any[]>this.selectedCartItemArray, function (row) {
            let _item = {
                cartItemId: row.cartItemId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: row.hotFlagCode,
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice,
                finalPrice: row.finalPrice,
                isDefaultVendorSelected: true
            };
            selectedItems.push(_item);
        });

        this.knownPartBuyoutComponent.showModal(selectedItems);
    }

    ShowStockTransferModal() {
        let selectedItems = [];
        _.each(<any[]>this.selectedCartItemArray, function (row) {
            let _item = {
                cartItemId: row.cartItemId,
                cartId: row.cartId,
                quantityAvailable: row.quantityAvailable,
                partNumber: row.partNumber,
                vendorCode: row.vendorCode,
                hotFlagCode: row.hotFlagCode,
                corePartNumber: row.corePartNumber,
                corePrice: row.corePrice,
                listPrice: row.listPrice,
                adjustedPrice: row.adjustedPrice,
                finalPrice: row.finalPrice,
                description: row.description,
                customerPrice: row.customerPrice,
                partId: row.partId,
                isPriceVerified: row.isPriceVerified,
                rebateField: row.rebateField,
                priceOverrideReasonId: row.priceOverrideReasonId,
                partNumOnly: row.partNumOnly,
                vmrsCode: row.vmrsCode,
                vmrsDescription: row.vmrsDescription,
                manufacturer: row.manufacturer,
                cateogory: row.cateogory,
                binLocation: row.binLocation,
                partWithSource: row.partWithSource,
                isSplit: row.isSplit,
                verifiedPrice: row.verifiedPrice             
            };
            selectedItems.push(_item);
        });
        this.stockTransferOrderComponent.showModal(selectedItems);
    }
    //Procurement End...

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.cartCountSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this.mscPayerSubscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
    }
}