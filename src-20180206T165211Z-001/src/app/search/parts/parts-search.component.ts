import { Component, ChangeDetectorRef, OnInit, Input, OnDestroy, ViewChild, ElementRef } from "@angular/core";

import { Title } from "@angular/platform-browser";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { FavouritesService } from "./../modal/favourites/favourites.service";
import { FavouriteCustomer } from "./../../_entities/favourite-customer.entity";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { PartsSearchService } from "./parts-search.service";
import { CustomerSearch } from "./../../_entities/customer-search.entity";
import { Customer } from "./../../_entities/customer.entity";
//import { FavouritesModalComponent } from "./../modal/favourites/favourites.component";
import { PartSearch, Facet } from "./../../_entities/part-search.entity";
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerComponent } from "./../../customer/customer.component";
import { CustomerModalService } from "./../modal/customer/customer.service";
import { CartService } from "./../../cart/cart.service";
import { CartSearch } from "./../../_entities/cart.entity";
import { LoaderService } from "./../../_common/services/loader.service";
import { ErrorInformation } from "./../../_entities/error-information.entity";
import { PartBuyoutModalComponent } from "./../modal/partbuyout/partbuyout.component";
import { CreatePartModalComponent } from "./../modal/create-part/create-part.component";
import { ExtendPart } from "./../../_entities/extend-part.entity";
import { ApplicationInsightsService, SourceLocationType } from './../../_common/services/application-insights.service';
import { AppInsightPartSearch } from "./../../_entities/app-insight-part-search.entity";
import { AppInsightCustomerChange } from "../../_entities/app-insight-customer-change.entity";
import { AppInsightBilling } from "../../_entities/app-insight-billing.entity";

declare var jQuery: any;

@Component({
    templateUrl: `./src/app/search/parts/parts-search.component.html?v=${new Date().getTime()}`,
    providers: [FavouritesService, PartsSearchService, ApplicationInsightsService]
})

export class PartsSearchComponent implements OnInit, OnDestroy {

    //@ViewChild('favouritesModal') favouritesModalComponent: FavouritesModalComponent;
    @ViewChild('customerPanel') customerComponent: CustomerComponent;
    @ViewChild('partBuyoutModal') partBuyoutModalComponent: PartBuyoutModalComponent;
    @ViewChild('createPartModal') createPartModalComponent: CreatePartModalComponent;

    customer: any;
    cartsData: any;
    cartCount: number;
    isCustomerSelected: boolean=false;
    cashCustomer: boolean = true;
    //customerNumber: string = "";
    searchTerm: string = "";
    enablePartBuyoutLink = false;
    hasBranch: boolean = false;
    enableCreatePartLink: boolean = false;
    hasMessage: boolean = false;
    createPartMesssage: string = "";
    showCreatePartLoader: boolean = false;
    sourceLocationType = SourceLocationType;
    hasValidCoupon: boolean = false;
    couponMessage: string = '';
    isshowCouponLoader: boolean = false;
    couponLoadingMessage: string = '';

    branchDataUpdated: any;

    customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe((d: any) => {
        let appInsightCustomerChange = Object.assign(new AppInsightCustomerChange(), {
            userId: this.commonDataService.UserId,
            searchTerm: this.searchTerm != undefined && this.searchTerm != null ? this.searchTerm : "",
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
            source: SourceLocationType[SourceLocationType.PartSearch]
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
        this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
    });
    changeBranchFlag: boolean;
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

    constructor(private loader: LoaderService,
        private title: Title,
        private notification: NotificationService,
        private favouritesService: FavouritesService,
        private commonDataService: CommonDataService,
        private partsSearchService: PartsSearchService,
        private changeDetectorRef: ChangeDetectorRef,
        private cartService: CartService,
        private router: Router,
        private customerModalService: CustomerModalService,
        private elementRef: ElementRef,
        private applicationInsightsService: ApplicationInsightsService) {
        this.title.setTitle("Part Search - Parts Link");
        //this.notification.hideNotification();
    }

    initCustomer() {
        let currentCustomer = this.commonDataService.Customer;
        let defaultCustomer = this.commonDataService.DefaultCustomer;
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
        let coupon = this.commonDataService.Coupons;
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
    }

    branchSubscription: any = this.commonDataService.branchUpdated.subscribe((d: any) => {
        this.isCustomerSelected = false;
        this.customer = null;
        this.commonDataService.Customer = null;
        this.branchDataUpdated = d;

        let appInsightBilling = Object.assign(new AppInsightBilling(), {
            userId: this.commonDataService.UserId,
            searchTerm: this.searchTerm,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
            PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
            source: SourceLocationType[SourceLocationType.PartSearch],
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
        appInsightBilling.products = "";
        this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
    });

    subscription: any = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
        this.initCustomer();
        this.hasBranch = this.commonDataService.Branch != null && this.commonDataService.Branch != undefined;
        this.loader.loading = false;
    });

    customerModalSubscription = this.customerModalService.notifyCustomerSelectEventEmitter.subscribe((res) => {
        if (res.hasOwnProperty('data') && res.data != null) {
            this.onCustomerSelect(res.data);
            console.log("Part search component customer selection subscription data : ", res.data);
        }
    });

    subscriptionCreateExtendedPart = this.partsSearchService.notifyCreatePartSelectEventEmitter.subscribe((res) => {
        if (res.hasOwnProperty('data') && res.data != null) {
            let extendPartData: ExtendPart = Object.assign(new ExtendPart(), {
                partNumber: res.data.materialNumber + ':' + res.data.manufacturerNumber,
                branchCode: this.commonDataService.Branch.code,
                sapUserName: this.commonDataService.UserName,
                allowReplacedPart: true,
                isSimulated: false
            });
            this.showCreatePartLoader = true;
            this.partsSearchService.createExtendedPart(extendPartData)
                .then(responseMsgResult => {
                    this.showCreatePartLoader = false;
                    if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                        this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
                    }
                    else {
                        this.notification.showMultilineNotification(responseMsgResult.messages);
                        console.log("On part Select Create Extended Part: ", responseMsgResult);
                        this.loader.loading = false;
                        let externalPartNumber: string = responseMsgResult.externalPartNumber;
                        if (externalPartNumber != null && externalPartNumber.length > 0) {
                            this.router.navigate(['parts'], { queryParams: { searchTerm: externalPartNumber } });
                        } else {
                            this.enableCreatePartLink = false;
                        }
                    }
                },
                error => { this.loader.loading = false; this.showCreatePartLoader = false; });
        }
        else {
            this.notification.showNotification("No records found to create part.", NotificationType.Error);
        }
    });

    couponSubscription: any = this.commonDataService.onCouponSelectEventEmitter.subscribe((coupon: any) => {
        this.hasValidCoupon = coupon != undefined && coupon != null && coupon && coupon.couponCode != undefined && coupon.couponCode != null && coupon.couponCode != '';
        this.couponMessage = this.hasValidCoupon ? coupon.couponDescription + ' Use coupon code ' + coupon.couponCode : '';
    });

    ngOnInit() {
        this.isCustomerSelected = false;
        this.hasBranch = this.commonDataService.Branch != null && this.commonDataService.Branch != undefined;
        this.initCustomer();
    }

    getCartCount(CNumber: any): void {
        this.cartCount = 0;
        //this.changeDetectorRef.detectChanges();
        //
        this.cartService.CartCount(CNumber, this.commonDataService.Branch.code, this.commonDataService.UserId)
            .then(count => {
                if (count.ErrorType != undefined && count.ErrorType != null && count.ErrorType != 200) {
                    this.notification.errorMessage("PartsSearchComponent", "getCartCount", "CartCount", count);
                }
                else {
                    this.cartCount = count.cartCount;
                }
                console.log("Part search component cart count : ", count);
                //this.changeDetectorRef.detectChanges();
            },
            error => {
                //
            });
    }

    addToFavourites(selectedCustomer: any) {
        //
        let favCustomer: FavouriteCustomer = {
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
            .then(favCustomers => {
                if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                    this.notification.errorMessage("PartsSearchComponent", "addToFavourites", "CreateFavourites", favCustomers);
                }
                else {
                    if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                        this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                    }
                    else {
                        //this.favouritesModalComponent.getFavourites();
                        favCustomers.isFavourite = true;
                        this.commonDataService.Customer = favCustomers;
                    }
                }
                console.log("Part search component add to favourite : ", favCustomers);
                //this.getCartCount(favCustomers.customerNumber);
            },
            error => { });
    }

    removeFavourites(selectedCustomer) {
        this.favouritesService.DeleteFavourites(selectedCustomer.customerNumber)
            .then(favCustomers => {
                if (favCustomers.ErrorType != undefined && favCustomers.ErrorType != null && favCustomers.ErrorType != 200) {
                    this.notification.errorMessage("PartsSearchComponent", "removeFavourites", "DeleteFavourites", favCustomers);
                }
                else {
                    if (favCustomers.errorMessage != null && favCustomers.errorMessage != undefined) {
                        this.notification.showNotification(favCustomers.errorMessage.message, favCustomers.errorMessage.type);
                    }
                    else {
                        //this.favouritesModalComponent.getFavourites();
                        let customer: any = this.commonDataService.Customer;
                        customer.isFavourite = false;
                        this.commonDataService.Customer = customer;
                    }
                }
                console.log("Part search component remove favourite : ", favCustomers);
            },
            error => { });
    }

    useDifferentCustomer() {
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
    }

    partSearch() {
        this.enablePartBuyoutLink = false;
        this.enableCreatePartLink = false;
        if (this.searchTerm !== undefined && this.searchTerm != null && this.searchTerm != "") {
            if (this.cashCustomer) {
                this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
            }
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
            this.partsSearchService.getPartCount(searchData)
                .then(c => {
                    if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                        this.notification.errorMessage("PartsSearchComponent", "partSearch", "getPartCount", c);
                    }
                    else {
                        if (c.isExists) {
                            this.router.navigate(['parts'], { queryParams: { searchTerm: this.searchTerm, src: SourceLocationType.PartSearch } });

                            let sourceName = "PartsSearchComponent_partSearch_getPartCount";
                            let metricName = this.applicationInsightsService.getMetricValue(sourceName);
                            let appInsightPartSearch = Object.assign(new AppInsightPartSearch(), {
                                userId: this.commonDataService.UserId,
                                searchTerm: this.searchTerm,
                                results: JSON.stringify(c),
                                customerNumber: this.commonDataService.Customer.customerNumber,
                                branchNumber: this.commonDataService.Branch.code,
                                cartNumber: this.commonDataService.CartId,
                                source: SourceLocationType[SourceLocationType.PartSearch],
                                plMetricName: sourceName
                            });
                            this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);
                        }
                        else {
                            this.notification.showNotification("Part not found.", NotificationType.Error);
                            this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
                            this.enablePartBuyoutLink = true;
                            this.enableCreatePartLink = true;
                        }
                    }
                    console.log("Part search component get part count : ", c);
                    this.loader.loading = false;
                },
                error => { this.loader.loading = false; });
        }
        //else {
        //    this.notification.showNotification("Please provide part search term.", NotificationType.Info);
        //}
    }

    createPart() {
        let extendPartData: ExtendPart = Object.assign(new ExtendPart(), {
            partNumber: this.searchTerm,
            branchCode: this.commonDataService.Branch.code,
            sapUserName: this.commonDataService.UserName,
            allowReplacedPart: true,
            isSimulated: false
        });
        this.showCreatePartLoader = true;
        this.partsSearchService.createExtendedPart(extendPartData)
            .then(responseMsgResult => {
                this.showCreatePartLoader = false;
                if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                    this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
                }
                else {
                    this.partsSearchService.notifyShowCreateModal({ data: responseMsgResult });
                    console.log("Create Extended Part: ", responseMsgResult);
                    this.loader.loading = false;
                }
            },
            error => { this.loader.loading = false; this.showCreatePartLoader = false; });
    }

    hideNotification() {
        this.notification.hideNotification();
        this.partBuyoutModalComponent.isVendorSelected = false;
        this.partBuyoutModalComponent.vendor = null;
    }

    onCustomerSelect(customer: any) {
        console.log("Part search component on customer select : ", customer);
        this.customer = customer;
        this.isCustomerSelected = true;
        this.commonDataService.Customer = this.customer;
        this.elementRef.nativeElement.querySelector('input#txtSearchTerm').focus();
        //this.changeDetectorRef.detectChanges();
        this.customerModalService.notifyShowMSCPayerCustomerModal({ data: this.customer });
    }

    onVendorSelect(vendor: any) { }

    onCustomerSearchCriteriaChange(data: any) {
        this.cashCustomer = data;
        if (data == true && (this.customerComponent.customerNumber == this.commonDataService.DefaultCustomer.customerNumber)) {
            this.setCustomer(this.cashCustomer);
        }
        this.customerComponent.PayerInValidInBranch = false;
    }

    onSearchTermKeypress(event) {
        if (event.keyCode == 13 && this.searchTerm.trim() != "") {
            this.partSearch();
        }
        this.enableCreatePartLink = false;
    }

    searchChange() {
        this.enableCreatePartLink = false;
        this.enablePartBuyoutLink = false;
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerModalSubscription.unsubscribe();
        this.branchSubscription.unsubscribe();
        this.subscriptionCreateExtendedPart.unsubscribe();
        this.couponSubscription.unsubscribe();
        this.couponShowSubscription.unsubscribe();
        this.getCouponCompleteSubscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
    }
}
