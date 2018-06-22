import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { CommonDataService } from "./../../_common/services/common-data.service";
import { LoaderService } from "./../../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { CartService } from "./../../cart/cart.service";
import { CartSearch } from "./../../_entities/cart.entity";
import { CustomerComponent } from "./../../customer/customer.component";
import { CustomerModalService } from "./../modal/customer/customer.service";
import { PartsSearchService } from "./../parts/parts-search.service";
import { Location } from '@angular/common';
import { CartComponent } from "./../../cart/cart.component";
import { PartSearch, Facet } from "./../../_entities/part-search.entity";
import { ApplicationInsightsService, SourceLocationType } from './../../_common/services/application-insights.service';
import { AppInsightPartSearch } from "./../../_entities/app-insight-part-search.entity";

//import MyFunc = require('./../../cart/cart.component');
import * as _ from "lodash";
declare var jQuery: any;

import {
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router'
import { AppInsightQuote } from "../../_entities/app-insight-quote.entity";


@Component({
    selector: "header-search",
    templateUrl: `./src/app/search/header/header-search.component.html?v=${new Date().getTime()}`,
    providers: [PartsSearchService, ApplicationInsightsService]
})

export class HeaderSearchComponent implements OnInit, OnDestroy {
    @ViewChild('customerPanel') customerComponent: CustomerComponent;
    cartComponent: CartComponent;
    searchTerm: string = "";
    customerName: string = this.commonDataService.Customer.customerName;
    customerNumber: string = this.commonDataService.Customer.customerNumber;
    couponMessage: string = '';
    searchData: CartSearch = new CartSearch();
    cartsData: any;
    cartCount: number;
    customer: any;
    isCustomerSelected: boolean;
    cashCustomer: boolean = true;
    queryParameterSubscription: any = null;
    subscription: any = null;
    customerModalSubscription: any = null;
    cartCountSubscription: any = null;
    cartMessage: string = "";
    cartId: string;
    showCartLoader: boolean = false;
    isSearchChange: boolean = false;
    enablePartBuyoutLink = false;
    branchSubscription: any;
    sourceLocationType = SourceLocationType;
    hasValidCoupon: boolean = false;
    isshowCouponLoader: boolean = false;
    couponLoadingMessage: string = '';
    couponShowSubscription: any = this.commonDataService.showCouponsModalEventEmitter.subscribe((d: any) => {
        this.couponLoadingMessage = 'Checking coupon availability...';
        this.isshowCouponLoader = true;
    });
    getCouponCompleteSubscription: any = this.commonDataService.onGetCouponComplete.subscribe((d: any) => {
        this.couponLoadingMessage = '';
        if (d == 0) {
            this.couponLoadingMessage = "No coupon available";
        }
        this.isshowCouponLoader = false;
    });
    couponSubscription: any = this.commonDataService.onCouponSelectEventEmitter.subscribe((coupon: any) => {
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
    });
    routeChangeSubscription = this.router.events.subscribe((event: RouterEvent) => {
        // this.getCarts();
        this.navigationInterceptor(event);
    });
    

    // Shows and hides the loading spinner during RouterEvent changes
    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            
        }
        if (event instanceof NavigationEnd) {
            this.getCarts();
        }
        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            
        }
        if (event instanceof NavigationError) {
           
        }
    }

    constructor(private loader: LoaderService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private notification: NotificationService,
        private cartService: CartService,
        private partsSearchService: PartsSearchService,
        // public cartComponent: CartComponent,
        private commonDataService: CommonDataService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private location: Location,
        private customerModalService: CustomerModalService,
        private applicationInsightsService: ApplicationInsightsService) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.getCarts();
        this.checkCustomerCouponValidity();
        let customerData = this.commonDataService.Customer;
        if (customerData.customerNumber != this.commonDataService.DefaultCustomer.customerNumber) {
            this.cashCustomer = false;
        }
        this.subscription = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
            this.checkCustomerCouponValidity();
            this.getCarts();
            this.loader.loading = false;
        });
        this.branchSubscription = this.commonDataService.branchUpdated
            .subscribe(
            (d: any) => {
                this.isCustomerSelected = false;
                this.customer = null;
                this.commonDataService.Customer = null;
            });
        this.customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe((res) => {
            if (res.hasOwnProperty('data') && res.data != null) {
                this.onCustomerSelect(res.data);
                //this.getCarts();
                console.log("Header search component customer selection subscribed data : ", res.data);
            }
        });
        this.queryParameterSubscription = this.activatedRoute.queryParams.subscribe(params => {
            this.searchTerm = params['searchTerm'];
            //console.log(this.searchTerm);
        });
        this.cartCountSubscription = this.cartService.notifyCartChangeEventEmitter.subscribe((d: any) => {
            this.getCarts();
            this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
            this.elementRef.nativeElement.querySelector('input#txtSearchTerm').select();
        });
    }

    checkCustomerCouponValidity() {
        this.couponMessage = '';
        let customerData = this.commonDataService.Customer;
        this.customerName = customerData.customerName;
        this.customerNumber = customerData.customerNumber;        
        let coupon = this.commonDataService.Coupons;
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';

        if (customerData.customerNumber != this.commonDataService.DefaultCustomer.customerNumber) {
            this.cashCustomer = false;
        }
    }

    onSearchTermKeypress(event) {
        if (event.keyCode == 13 && this.searchTerm.trim() != '') {
            this.partSearch();
        }
    }

    searchChange() {
        this.isSearchChange = true;
        this.commonDataService.headerSearchChange.emit(this.isSearchChange);
    }

    hideNotification() {
        this.notification.hideNotification();
    }

    partSearch() {
        let searchData: PartSearch = Object.assign(new PartSearch(), {
            partSearchTerm: this.searchTerm,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: false,
            isCountCheck: true,
            pageNumber: 1,
            pageSize: 100,
            includeFacets: false,
            userId: this.commonDataService.UserId,
            Facet: Object.assign(new Facet(), {})
        });
        this.loader.loading = true;
        this.loader.loading = this.searchTerm != this.activatedRoute.snapshot.queryParams['searchTerm'];
        this.partsSearchService.getPartCount(searchData)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("HeaderSearchComponent", "partSearch", "getPartCount", c);
                }
                else {
                    if (c.isExists) {
                        if (this.searchTerm !== undefined && this.searchTerm != null && this.searchTerm != "") {
                            this.router.navigate(['parts'], { queryParams: { searchTerm: this.searchTerm, src: SourceLocationType.HeaderSearch } });
                            let sourceName = "HeaderSearchComponent_partSearch_getPartCount";
                            let metricName = this.applicationInsightsService.getMetricValue(sourceName);
                            let appInsightPartSearch = Object.assign(new AppInsightPartSearch(), {
                                userId: this.commonDataService.UserId,
                                searchTerm: this.searchTerm,
                                results: JSON.stringify(c),
                                customerNumber: this.commonDataService.Customer.customerNumber,
                                branchNumber: this.commonDataService.Branch.code,
                                cartNumber: this.commonDataService.CartId,
                                source: SourceLocationType[this.sourceLocationType.HeaderSearch],
                                plMetricName: sourceName
                            });
                            this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);
                        }
                    }
                    else {

                        this.notification.showNotification("Part not found.", NotificationType.Error);
                        this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
                        this.enablePartBuyoutLink = true;
                        this.commonDataService.partCreated.emit(this.searchTerm);
                    }
                }
                console.log("Header search component get part count : ", c);
                this.loader.loading = false;
            },
            error => { this.loader.loading = false; });
    }

    getCarts(): void {
        //
        this.cartsData = null;
        this.showCartLoader = true;
        //this.changeDetectorRef.detectChanges();
        this.cartMessage = "loading cart items ...";
        let searchData = Object.assign(new CartSearch(), {
            customerNumber: this.commonDataService.Customer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            userId: this.commonDataService.UserId

        });
        this.cartService.getCarts(searchData)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("HeaderSearchComponent", "getCarts", "getCarts", c);
                }
                else {
                    if (!c || !c.carts || c.carts.length == 0) {
                        this.cartsData = null;
                        this.cartCount = 0;
                        this.cartMessage = "cart item is not available.";
                    }
                    else {
                        let carts = c.carts;
                        this.commonDataService.CartId = c.carts[0].cartId;
                        this.cartsData = _.reject(<any[]>carts, function (item) {
                            return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });
                        if (c.hasError) {
                            this.notification.showMultilineNotification(c.errorMessages);
                        }
                        this.cartCount = this.cartsData.length;
                        this.cartId = this.cartsData.length > 0 ? c.carts[0].cartId : null;
                        this.commonDataService.CartId = this.cartId;
                    }
                }
                this.showCartLoader = false;
                //this.changeDetectorRef.detectChanges();
                console.log("Header search component Cart Data : ", c);
            },
            error => { // 
                this.showCartLoader = false;
                this.cartsData = null;
                this.cartCount = 0;
                this.cartMessage = "An error occurred. Please try again later.";
            });
    }

    removeCartItems(selectedCartItem) {
        let deleteCartItems: Array<any> = new Array<any>();
        let _item = {
            cartItemId: selectedCartItem.cartItemId,
        };
        deleteCartItems.push(_item);
        let removeCartItemsData = {
            cartId: this.commonDataService.CartId,
            isPickupDeliveryType: false,
            deleteCartItems: deleteCartItems
        };

        if (selectedCartItem.couponId != undefined && selectedCartItem.couponId != null && selectedCartItem.couponId != '') {
            this.commonDataService.Coupons = null;
            this.commonDataService.CouponVendors = null;
        }
        this.cartService.DeleteCartItem(removeCartItemsData)
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("HeaderSearchComponent", "removeCartItems", "DeleteCartItem", c);
                }
                else {
                    this.getCarts();
                }
            },
            error => { });

        let sourceName = "HeaderSearchComponent_removeCartItems";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightQuote = Object.assign(new AppInsightQuote(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            plMetricName: sourceName
        });
        appInsightQuote.lineItems = this.applicationInsightsService.getAppInsightParts(selectedCartItem, JSON.stringify(appInsightQuote).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightQuote);
    }

    onDefaultCustomerChange(e) {
        this.setCustomer(e.target.checked);
        this.customerComponent.PayerInValidInBranch = false;
    }

    setCustomer(isDefaultCustomer: boolean) {
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
    }

    onCustomerSelect(customer: any) {
        console.log("Header search component on customer select : ", customer);
        this.customer = customer;
        this.isCustomerSelected = true;
        this.commonDataService.Customer = this.customer;
        jQuery("#ddlHeaderCustomer").removeClass("open");
        this.emptyCustomerSearchCriteria();
        //this.changeDetectorRef.detectChanges();
        this.customerModalService.notifyShowMSCPayerCustomerModal({ data: this.customer });
    }

    onCustomerSearchCriteriaChange(data: any) {
        this.cashCustomer = data;
        if (data == true && (this.customerComponent.customerNumber == this.commonDataService.DefaultCustomer.customerNumber)) {
            this.setCustomer(this.cashCustomer);
        }
        this.customerComponent.PayerInValidInBranch = false;
    }

    emptyCustomerSearchCriteria() {
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
    }

    dropDownLinkClick(e) {
        console.log("Header search component dropdownlink click : ", e);
    }

    calculateCartTotals() {
        let totalPrice = 0;
        this.cartsData.forEach((d) => {
            if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery && d.partNumOnly != "DELIVERY:90") {
                //totalPrice += d.quantity * d.finalPrice;
                totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
            }
        });
        return totalPrice;
    }

    onMyCartClick() {
        this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "none";
        this.router.navigate(['/cart']);
    }

    disableScrollBar() {
        if (this.elementRef.nativeElement.querySelector('.my-cart')) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "block";
        }
    }

    enableScrollBar() {
        if (this.elementRef.nativeElement.querySelector('.my-cart')) {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
        this.elementRef.nativeElement.querySelector('.cart .my-cart').style.display = "none";
    }


    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerModalSubscription.unsubscribe();
        this.queryParameterSubscription.unsubscribe();
        this.cartCountSubscription.unsubscribe();
        this.branchSubscription.unsubscribe();
        this.couponSubscription.unsubscribe();
        this.routeChangeSubscription.unsubscribe();
    }
}