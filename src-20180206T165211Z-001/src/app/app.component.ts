///<reference path="./../../typings/globals/core-js/index.d.ts"/>
import { Component, OnInit, Input, ElementRef, OnDestroy, ChangeDetectorRef, AfterViewChecked, ViewChild } from "@angular/core";
import { AuthenticationService } from "./_common/services/authentication.service";
import { CommonDataService } from "./_common/services/common-data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoaderService } from "./_common/services/loader.service";
import { NotificationService, NotificationType } from "./_common/services/notification.service";
import { Token } from "./_entities/token.entity";
import { AuthGuard } from "./_common/auth-guard";
//import { AppInsightsService } from 'ng2-appinsights';
import { Location } from '@angular/common';
import { CartService } from "./cart/cart.service";
import { Observable } from 'rxjs/Rx';
import { ExtendPart } from "./_entities/extend-part.entity";
import { PartsSearchService } from "./search/parts/parts-search.service";
import { CreatePartModalComponent } from "./search/modal/create-part/create-part.component";
declare var jQuery: any;
import * as _ from "lodash";

import { AppConfigService } from './_common/services/app-config.service';
import { UserNotificationService } from "./notification/user.notification.service"

@Component({
    selector: "my-app",
    templateUrl: `./src/app/app.component.html?v=${new Date().getTime()}`,
    providers: [AuthenticationService, AppConfigService, PartsSearchService]
})

export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
    @ViewChild('createPartModal') createPartModalComponent: CreatePartModalComponent;
    token: string;
    errorMessage: any;
    notificationType = NotificationType;
    userId: string = "";
    userName: string = "";
    providerKey: string = "";
    defaultBranchCode: string = "";
    defaultBranchName: string = "";
    isAuthenticated: boolean = false;
    isUserAdmin: boolean = false;
    isPricingAlertEnabled: string = "True";
    subscription: any;
    subscriptionforpartcreated: any;
    subscriptionforheadersearch: any;
    partSearchTerm: string = "";
    loaderSubscription: any;
    showloader: boolean = false;
    showUserSalesMetrics: boolean = false;
    showCreatePart: boolean = false;
    searchTerm: string = "";

    userNotifications: any;
    unreadUserNotificationsCount: number = 0;
    userSalesMetrics: any;
    notificationSubscription: any;
    isLoadingNotification: boolean = false;
    hasCreateUserPermission: boolean = false;
    hasImportCouponsPermissions: boolean = false;
    hasReadCouponsPermissions: boolean = false;
    hasMessage: boolean = false;
    createPartMesssage: string = "";
    routeChangeSubscription: any;

    appVersion: string = "";
    showCreatePartLoader: boolean = false;
    constructor(
        private authService: AuthenticationService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private loader: LoaderService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
        private authGuard: AuthGuard,
        private location: Location,
        //private appinsightsService: AppInsightsService,
        private appConfigService: AppConfigService,
        private cartService: CartService,
        private userNotificationService: UserNotificationService,
        private partsSearchService: PartsSearchService,
    ) { }

    ngAfterViewChecked() {
        //explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
        this.changeDetectorRef.detectChanges();
    }

    ngOnInit() {
        let native = this.elementRef.nativeElement;
        this.userId = native.getAttribute("userId");
        this.userName = native.getAttribute("userName");
        this.providerKey = native.getAttribute("providerKey");
        this.defaultBranchCode = native.getAttribute("defaultBranchCode");
        this.defaultBranchName = native.getAttribute("defaultBranchName");
        this.hasCreateUserPermission = native.getAttribute("hasCreateUserPermission") == "True";
        this.hasImportCouponsPermissions = native.getAttribute("hasImportCouponsPermissions") == "True";
        this.hasReadCouponsPermissions = native.getAttribute("hasReadCouponsPermissions") == "True";
        this.isPricingAlertEnabled = native.getAttribute("isPricingAlertEnabled");
        this.appVersion = this.commonDataService.AppVersion;

        let _userCouponsPermissions = {
            hasImportCouponsPermissions: this.hasImportCouponsPermissions,
            hasReadCouponsPermissions: this.hasReadCouponsPermissions
        };

        this.commonDataService.CouponsPermissions = _userCouponsPermissions;

        this.commonDataService.UserIsPricingAlertEnabled = this.isPricingAlertEnabled;
        this.commonDataService.UserId = this.userId;
        this.commonDataService.UserName = this.userName;
        this.commonDataService.ProviderKey = this.providerKey;
        this.commonDataService.DefaultBranch = { name: this.defaultBranchName, code: this.defaultBranchCode };

        if (!this.commonDataService.Customer || this.commonDataService.Customer.customerNumber == "") {
            this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        }
        let authTokenObject: Token = this.commonDataService.AuthToken;
        let currentDateTime = new Date().getTime();
        if (authTokenObject && authTokenObject.expiry_datetime && authTokenObject.expiry_datetime > currentDateTime) {
            this.isAuthenticated = true;
        }
        //s.partSearchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
        this.subscription = this.authGuard.AuthenticationCheckUpdated.subscribe((d: any) => {
            this.isAuthenticated = d;
            if (d) {
                this.getUserNotifications();
                this.getTimelyNotifications();
            }
            //this.changeDetectorRef.detectChanges();
        });

        this.subscriptionforpartcreated = this.commonDataService.partCreated.subscribe((d: any) => {
            this.showCreatePart = d != null && d != '' && d != 'undefined';
            this.searchTerm = d;

        });
        this.subscriptionforheadersearch = this.commonDataService.headerSearchChange.subscribe((d: any) => {
            this.showCreatePart = !d;
        });

        this.loaderSubscription = this.loader.loadingFlagUpdated.subscribe((d: any) => {
            this.showloader = d;
        });

        this.routeChangeSubscription = this.router.events.subscribe((val) => {
            // see also 
            this.showCreatePart = false;
        });

        //this.appinsightsService.Init({
        //    instrumentationKey: this.commonDataService.App_Insights_Instrumentation_Key,
        //    enableDebug: true,
        //    disableExceptionTracking: false
        //});

        console.log("App component : user id - " + this.userId + " || user name - " + this.userName + " || provider key - " + this.providerKey);
    }

    getTimelyNotifications() {
        var Notification_Time_Interval_In_Min = this.commonDataService.Notification_Time_Interval_In_Min;
        this.notificationSubscription = Observable.interval(Notification_Time_Interval_In_Min * 60 * 1000).subscribe(x => {
            this.getUserNotifications();
        });
    }

    closeNotification() {
        this.notification.hideNotification();
    }

    feedback() {
        this.router.navigate(['feedback'], { queryParams: { partSearchTerm: this.activatedRoute.snapshot.queryParams['searchTerm'], previousPageUrl: this.location.path() } });
    }

    clearCustomerValue() {
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    }

    startNewCart() {
        this.commonDataService.cleanCheckoutData();
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    }

    removeCarts() {
        this.commonDataService.cleanCheckoutData();
        this.cartService.DeleteCart()
            .then(c => {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    this.notification.errorMessage("AppComponent", "removeCarts", "DeleteCart", c);
                }
                else {
                    this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
                    this.router.navigate(['/']);
                }
            },
            error => { });
    }

    getUserNotifications() {
        if (this.commonDataService.UserId != null) {
            this.isLoadingNotification = true;
            this.userNotifications = null;
            this.userNotificationService.getNotifications(this.commonDataService.UserId)
                .then(un => {
                    if (un.ErrorType != undefined && un.ErrorType != null && un.ErrorType != 200) {
                        this.isLoadingNotification = false;
                        this.userNotifications = [];
                        this.notification.errorMessage("AppComponent", "getUserNotifications", "getNotifications", un);
                    }
                    else {
                        this.userNotifications = un;
                        this.unreadUserNotificationsCount = _.filter(<any[]>this.userNotifications, function (item) {
                            return item.notificationUser.isRead == false;
                        }).length;
                        this.isLoadingNotification = false;
                    }
                    console.log("App component user notifications : ", this.userNotifications);
                },
                error => { this.isLoadingNotification = false; this.userNotifications = []; });
        }
    }

    showDailySalesReport(userNotification: any) {
        this.showUserSalesMetrics = false;
        let branchCode = "";//this.commonDataService.Branch.code;

        this.userNotificationService.getUserSalesMetrics(userNotification.notification.id, this.commonDataService.UserId, branchCode)
            .then(usm => {
                if (usm.ErrorType != undefined && usm.ErrorType != null && usm.ErrorType != 200) {
                    this.notification.errorMessage("AppComponent", "showDailySalesReport", "getUserSalesMetrics", usm);
                }
                else {
                    this.userSalesMetrics = usm;
                    this.showUserSalesMetrics = true;
                }
                console.log("App component daily sales report : ", this.userSalesMetrics);
            },
            error => { });

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
                    //this.router.navigate(['parts'], { queryParams: { searchTerm: extendPartData.partNumber } });
                }
            },
            error => { this.loader.loading = false; this.showCreatePartLoader = false; });
    }
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
                        }
                        else {
                            this.showCreatePart = false;
                        }
                    }
                },
                error => { this.loader.loading = false; this.showCreatePartLoader = false; });
        }
        else {
            this.notification.showNotification("No records found to create part.", NotificationType.Error);
        }
    });

    markNotification(userNotification: any) {

        this.userNotificationService.markNotification(userNotification.notification.id, this.commonDataService.UserId)
            .then(mn => {
                if (mn.ErrorType != undefined && mn.ErrorType != null && mn.ErrorType != 200) {
                    this.notification.errorMessage("AppComponent", "markNotification", "markNotification", mn);
                }
                else {
                    if (mn == true) {
                        userNotification.notificationUser.isRead = true;
                        this.unreadUserNotificationsCount = this.unreadUserNotificationsCount > 0 ? this.unreadUserNotificationsCount - 1 : this.unreadUserNotificationsCount;
                        //    _.filter(<any[]>this.userNotifications, function (item) {
                        //    return item.notificationUser.isRead == false;
                        //}).length;
                    }
                    console.log("App component markNotification : ", mn);
                }

            },
            error => { });

    }

    markAllNotification() {

        this.userNotificationService.markAllNotification(this.commonDataService.UserId)
            .then(mn => {
                if (mn.ErrorType != undefined && mn.ErrorType != null && mn.ErrorType != 200) {
                    this.notification.errorMessage("AppComponent", "markAllNotification", "markAllNotification", mn);
                }
                else {
                    if (mn == true) {

                        this.userNotifications = _.each(this.userNotifications, function (item) {
                            item.notificationUser.isRead = true;
                        });

                        this.unreadUserNotificationsCount = 0;
                    }
                    console.log("App component markAllNotification : ", mn);
                }

            },
            error => { });

    }
    disableScrollBar() {
        if (this.elementRef.nativeElement.querySelector('.my-coupon')) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            this.elementRef.nativeElement.querySelector('.coupon .my-coupon').style.display = "block";
        }
    }

    enableScrollBar() {
        if (this.elementRef.nativeElement.querySelector('.my-coupon')) {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
        this.elementRef.nativeElement.querySelector('.coupon .my-coupon').style.display = "none";
    }
    notificationDetails(userNotification: any) {
        if (userNotification.notification.notificationTypeId == 1) {
            this.showDailySalesReport(userNotification);
            if (userNotification.notificationUser.isRead == false) {
                this.markNotification(userNotification);
            }
        }
        else {
            this.markNotification(userNotification);
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.subscriptionforpartcreated.unsubscribe();
        this.subscriptionforheadersearch.unsubscribe();
        this.loaderSubscription.unsubscribe();
        this.notificationSubscription.unsubscribe();
        this.subscriptionCreateExtendedPart.unsubscribe();
        this.routeChangeSubscription.unsubscribe();
    }
}