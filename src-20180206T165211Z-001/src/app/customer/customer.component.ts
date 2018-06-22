import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from "@angular/core";

import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { CustomerSearch } from "./../_entities/customer-search.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { PartsSearchService } from "./../search/parts/parts-search.service";
import { CustomerModalComponent } from "./../search/modal/customer/customer.component";
import { CustomerModalService } from "./../search/modal/customer/customer.service";
import { CartService } from "./../cart/cart.service"; // for notification
import { AppInsightCustomerSearch } from "../_entities/app-insight-customer-search.entity";
import { AppInsightCustomerSearchTerm } from "../_entities/app-insight-customer-search-term.entity";
import { ApplicationInsightsService, SourceLocationType } from "../_common/services/application-insights.service";
import { ActivatedRoute } from "@angular/router";
import { CouponService } from "./../search/modal/coupon/coupon.service";

declare var jQuery: any;

@Component({
    selector: "customer-panel",
    templateUrl: `./src/app/customer/customer.component.html?v=${new Date().getTime()}`,
    providers: [ApplicationInsightsService]
})

export class CustomerComponent implements OnInit, OnDestroy {

    @ViewChild('customerModal') customerModalComponent: CustomerModalComponent;
    @Input() source: string = "";

    customerNumber: string = "";
    advCustomerName: string = "";
    advCity: string = "";
    advState: string = "";
    advPostalCode: string = "";
    advPhoneNumber: string = "";
    //customers: any;
    //customer: any;
    hasMessage: boolean = false;
    PayerInValidInBranch: boolean = false;
    customerMesssage: string = "";
    isDefaultCustomerChecked: boolean = true;
    couponDiscount: any;
    @Output() onCustomerSearchDataChange: EventEmitter<any> = new EventEmitter();
    @Output() callbackCustomerSelect: EventEmitter<any> = new EventEmitter();

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private partsSearchService: PartsSearchService,
        private changeDetectorRef: ChangeDetectorRef,
        private customerModalService: CustomerModalService,
        private cartService: CartService,
        private elementRef: ElementRef,
        private applicationInsightsService: ApplicationInsightsService,
        private activatedRoute: ActivatedRoute,
        private couponService: CouponService) {
        //this.notification.hideNotification();
    }

    ngOnInit() { }

    customerSearch() {
        if (this.customerNumber || this.advCustomerName || this.advCity || this.advState || this.advPostalCode || this.advPhoneNumber) {
            this.hasMessage = false;
            this.customerMesssage = "";
            this.loader.loading = true;
            this.PayerInValidInBranch = false;
            console.log("Customer component customer number: ", this.customerNumber);
            let customerSearch: CustomerSearch = Object.assign(new CustomerSearch(), {
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
            let customerSearchTerm: AppInsightCustomerSearchTerm = Object.assign(new AppInsightCustomerSearchTerm(), {
                customerNumber: this.customerNumber,
                customerName: this.advCustomerName,
                city: this.advCity,
                state: this.advState,
                postalCode: this.advPostalCode,
                phoneNumber: this.advPhoneNumber
            });
            let isCustomerNumberSearch = this.customerNumber !== undefined && this.customerNumber !== null && this.customerNumber !== "";
            let sourceValue = '';
            if (isCustomerNumberSearch) {
                if (SourceLocationType[this.source] == SourceLocationType[SourceLocationType.PartSearch]) {
                    sourceValue = SourceLocationType[SourceLocationType.PartSearch_CustomerSearch];
                } else {
                    sourceValue = SourceLocationType[SourceLocationType.HeaderSearch_CustomerSearch];
                }
            } else {
                if (SourceLocationType[this.source] == SourceLocationType[SourceLocationType.PartSearch]) {
                    sourceValue = SourceLocationType[SourceLocationType.PartSearch_AdvancedCustomerSearch];
                } else {
                    sourceValue = SourceLocationType[SourceLocationType.HeaderSearch_AdvancedCustomerSearch];
                }
            }

            this.partsSearchService.getCustomers(customerSearch)
                .then(c => {
                    let searchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
                    if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                        this.notification.errorMessage("CustomerComponent", "customerSearch", "getCustomers", c);
                    }
                    else {
                        let sourceName = SourceLocationType[this.source] + "_" + "CustomerComponent_customerSearch_getCustomers";
                        let metricName = this.applicationInsightsService.getMetricValue(sourceName);

                        if (c.customers == null || c.customers.length == 0) {
                            //this.notification.showNotification("No record found", NotificationType.Info);
                            this.hasMessage = true;
                            this.customerMesssage = "No customer found";
                            let appInsightCustomerSearch = Object.assign(new AppInsightCustomerSearch(), {
                                userId: this.commonDataService.UserId,
                                branchNumber: this.commonDataService.Branch.code,
                                searchTerm: searchTerm != undefined && searchTerm != null ? searchTerm : "",
                                customerSearchTerm: this.applicationInsightsService.getAppInsightSerializedJson(customerSearchTerm),
                                source: sourceValue,
                                //clickingFavorites: false,
                                //clickingAdvancedSearch: false,
                                result: this.applicationInsightsService.getAppInsightSerializedJson(c),
                                customerNotFound: true,
                                plMetricName: sourceName
                            });
                            this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
                        }
                        else {
                            this.hasMessage = false;
                            this.customerMesssage = "";
                            if (c.customers.length == 1) {
                                if (c.customers[0].payerNotValidInBranch == false) {
                                    this.callbackCustomerSelect.emit(c.customers[0]);
                                    this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                                }
                                else if (c.customers[0].payerNotValidInBranch == true) {
                                    this.PayerInValidInBranch = c.customers[0].payerNotValidInBranch;
                                }
                                this.commonDataService.Coupons = null;
                                this.commonDataService.CouponVendors = null;
                                this.commonDataService.showCouponsModalEventEmitter.emit();

                                let appInsightCustomerSearch = Object.assign(new AppInsightCustomerSearch(), {
                                    userId: this.commonDataService.UserId,
                                    branchNumber: this.commonDataService.Branch.code,
                                    searchTerm: searchTerm != undefined && searchTerm != null ? searchTerm : "",
                                    customerSearchTerm: this.applicationInsightsService.getAppInsightSerializedJson(customerSearchTerm),
                                    source: sourceValue,
                                    //clickingFavorites: false,
                                    //clickingAdvancedSearch: false,
                                    result: this.applicationInsightsService.getAppInsightSerializedJson(c),
                                    customerNotFound: false,
                                    plMetricName: sourceName
                                });
                                this.applicationInsightsService.trackMetric(metricName, appInsightCustomerSearch);
                            }
                            else if (c.customers.length > 1) {
                                //this.customers = c.customers;                        
                                //this.customerModalComponent.showModal();
                                this.customerModalService.notifyShowCustomerModal({ data: { customers: c.customers, customerSearchTerm: customerSearchTerm } });
                            }
                        }
                    }
                    this.loader.loading = false;
                    //this.changeDetectorRef.detectChanges();
                    console.log("Customer component : ", c);
                },
                error => {
                    this.loader.loading = false;
                    this.hasMessage = false;
                    this.customerMesssage = "";
                    this.elementRef.nativeElement.querySelector('input#txtCustomerNumber').focus();
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
    }

    onCustomerKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    onCustomerKeydown(event) {
        if (event.keyCode == 9) {
            this.customerSearch();
        }
    }

    onCustomerNameKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    }

    onPhoneNoKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    }

    onPostalCodeKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    }

    onCityKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    }

    onStateKeypress(event) {
        if (event.keyCode == 13) {
            this.customerSearch();
        }
    }

    change() {
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
    }

    viewFavorites() {
        jQuery('body').on('shown.bs.modal', '#favoritesModal', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }
}
