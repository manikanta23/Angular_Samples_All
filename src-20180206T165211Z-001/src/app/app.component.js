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
///<reference path="./../../typings/globals/core-js/index.d.ts"/>
var core_1 = require("@angular/core");
var authentication_service_1 = require("./_common/services/authentication.service");
var common_data_service_1 = require("./_common/services/common-data.service");
var router_1 = require("@angular/router");
var loader_service_1 = require("./_common/services/loader.service");
var notification_service_1 = require("./_common/services/notification.service");
var auth_guard_1 = require("./_common/auth-guard");
//import { AppInsightsService } from 'ng2-appinsights';
var common_1 = require("@angular/common");
var cart_service_1 = require("./cart/cart.service");
var Rx_1 = require("rxjs/Rx");
var extend_part_entity_1 = require("./_entities/extend-part.entity");
var parts_search_service_1 = require("./search/parts/parts-search.service");
var create_part_component_1 = require("./search/modal/create-part/create-part.component");
var _ = require("lodash");
var app_config_service_1 = require("./_common/services/app-config.service");
var user_notification_service_1 = require("./notification/user.notification.service");
var AppComponent = (function () {
    function AppComponent(authService, activatedRoute, router, loader, notification, commonDataService, elementRef, changeDetectorRef, authGuard, location, 
        //private appinsightsService: AppInsightsService,
        appConfigService, cartService, userNotificationService, partsSearchService) {
        var _this = this;
        this.authService = authService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.elementRef = elementRef;
        this.changeDetectorRef = changeDetectorRef;
        this.authGuard = authGuard;
        this.location = location;
        this.appConfigService = appConfigService;
        this.cartService = cartService;
        this.userNotificationService = userNotificationService;
        this.partsSearchService = partsSearchService;
        this.notificationType = notification_service_1.NotificationType;
        this.userId = "";
        this.userName = "";
        this.providerKey = "";
        this.defaultBranchCode = "";
        this.defaultBranchName = "";
        this.isAuthenticated = false;
        this.isUserAdmin = false;
        this.isPricingAlertEnabled = "True";
        this.partSearchTerm = "";
        this.showloader = false;
        this.showUserSalesMetrics = false;
        this.showCreatePart = false;
        this.searchTerm = "";
        this.unreadUserNotificationsCount = 0;
        this.isLoadingNotification = false;
        this.hasCreateUserPermission = false;
        this.hasImportCouponsPermissions = false;
        this.hasReadCouponsPermissions = false;
        this.hasMessage = false;
        this.createPartMesssage = "";
        this.appVersion = "";
        this.showCreatePartLoader = false;
        this.subscriptionCreateExtendedPart = this.partsSearchService.notifyCreatePartSelectEventEmitter.subscribe(function (res) {
            if (res.hasOwnProperty('data') && res.data != null) {
                var extendPartData = Object.assign(new extend_part_entity_1.ExtendPart(), {
                    partNumber: res.data.materialNumber + ':' + res.data.manufacturerNumber,
                    branchCode: _this.commonDataService.Branch.code,
                    sapUserName: _this.commonDataService.UserName,
                    allowReplacedPart: true,
                    isSimulated: false
                });
                _this.showCreatePartLoader = true;
                _this.partsSearchService.createExtendedPart(extendPartData)
                    .then(function (responseMsgResult) {
                    _this.showCreatePartLoader = false;
                    if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                        _this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
                    }
                    else {
                        _this.notification.showMultilineNotification(responseMsgResult.messages);
                        console.log("On part Select Create Extended Part: ", responseMsgResult);
                        _this.loader.loading = false;
                        var externalPartNumber = responseMsgResult.externalPartNumber;
                        if (externalPartNumber != null && externalPartNumber.length > 0) {
                            _this.router.navigate(['parts'], { queryParams: { searchTerm: externalPartNumber } });
                        }
                        else {
                            _this.showCreatePart = false;
                        }
                    }
                }, function (error) { _this.loader.loading = false; _this.showCreatePartLoader = false; });
            }
            else {
                _this.notification.showNotification("No records found to create part.", notification_service_1.NotificationType.Error);
            }
        });
    }
    AppComponent.prototype.ngAfterViewChecked = function () {
        //explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
        this.changeDetectorRef.detectChanges();
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var native = this.elementRef.nativeElement;
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
        var _userCouponsPermissions = {
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
        var authTokenObject = this.commonDataService.AuthToken;
        var currentDateTime = new Date().getTime();
        if (authTokenObject && authTokenObject.expiry_datetime && authTokenObject.expiry_datetime > currentDateTime) {
            this.isAuthenticated = true;
        }
        //s.partSearchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
        this.subscription = this.authGuard.AuthenticationCheckUpdated.subscribe(function (d) {
            _this.isAuthenticated = d;
            if (d) {
                _this.getUserNotifications();
                _this.getTimelyNotifications();
            }
            //this.changeDetectorRef.detectChanges();
        });
        this.subscriptionforpartcreated = this.commonDataService.partCreated.subscribe(function (d) {
            _this.showCreatePart = d != null && d != '' && d != 'undefined';
            _this.searchTerm = d;
        });
        this.subscriptionforheadersearch = this.commonDataService.headerSearchChange.subscribe(function (d) {
            _this.showCreatePart = !d;
        });
        this.loaderSubscription = this.loader.loadingFlagUpdated.subscribe(function (d) {
            _this.showloader = d;
        });
        this.routeChangeSubscription = this.router.events.subscribe(function (val) {
            // see also 
            _this.showCreatePart = false;
        });
        //this.appinsightsService.Init({
        //    instrumentationKey: this.commonDataService.App_Insights_Instrumentation_Key,
        //    enableDebug: true,
        //    disableExceptionTracking: false
        //});
        console.log("App component : user id - " + this.userId + " || user name - " + this.userName + " || provider key - " + this.providerKey);
    };
    AppComponent.prototype.getTimelyNotifications = function () {
        var _this = this;
        var Notification_Time_Interval_In_Min = this.commonDataService.Notification_Time_Interval_In_Min;
        this.notificationSubscription = Rx_1.Observable.interval(Notification_Time_Interval_In_Min * 60 * 1000).subscribe(function (x) {
            _this.getUserNotifications();
        });
    };
    AppComponent.prototype.closeNotification = function () {
        this.notification.hideNotification();
    };
    AppComponent.prototype.feedback = function () {
        this.router.navigate(['feedback'], { queryParams: { partSearchTerm: this.activatedRoute.snapshot.queryParams['searchTerm'], previousPageUrl: this.location.path() } });
    };
    AppComponent.prototype.clearCustomerValue = function () {
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    };
    AppComponent.prototype.startNewCart = function () {
        this.commonDataService.cleanCheckoutData();
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    };
    AppComponent.prototype.removeCarts = function () {
        var _this = this;
        this.commonDataService.cleanCheckoutData();
        this.cartService.DeleteCart()
            .then(function (c) {
            if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                _this.notification.errorMessage("AppComponent", "removeCarts", "DeleteCart", c);
            }
            else {
                _this.commonDataService.Customer = _this.commonDataService.DefaultCustomer;
                _this.router.navigate(['/']);
            }
        }, function (error) { });
    };
    AppComponent.prototype.getUserNotifications = function () {
        var _this = this;
        if (this.commonDataService.UserId != null) {
            this.isLoadingNotification = true;
            this.userNotifications = null;
            this.userNotificationService.getNotifications(this.commonDataService.UserId)
                .then(function (un) {
                if (un.ErrorType != undefined && un.ErrorType != null && un.ErrorType != 200) {
                    _this.isLoadingNotification = false;
                    _this.userNotifications = [];
                    _this.notification.errorMessage("AppComponent", "getUserNotifications", "getNotifications", un);
                }
                else {
                    _this.userNotifications = un;
                    _this.unreadUserNotificationsCount = _.filter(_this.userNotifications, function (item) {
                        return item.notificationUser.isRead == false;
                    }).length;
                    _this.isLoadingNotification = false;
                }
                console.log("App component user notifications : ", _this.userNotifications);
            }, function (error) { _this.isLoadingNotification = false; _this.userNotifications = []; });
        }
    };
    AppComponent.prototype.showDailySalesReport = function (userNotification) {
        var _this = this;
        this.showUserSalesMetrics = false;
        var branchCode = ""; //this.commonDataService.Branch.code;
        this.userNotificationService.getUserSalesMetrics(userNotification.notification.id, this.commonDataService.UserId, branchCode)
            .then(function (usm) {
            if (usm.ErrorType != undefined && usm.ErrorType != null && usm.ErrorType != 200) {
                _this.notification.errorMessage("AppComponent", "showDailySalesReport", "getUserSalesMetrics", usm);
            }
            else {
                _this.userSalesMetrics = usm;
                _this.showUserSalesMetrics = true;
            }
            console.log("App component daily sales report : ", _this.userSalesMetrics);
        }, function (error) { });
    };
    AppComponent.prototype.createPart = function () {
        var _this = this;
        var extendPartData = Object.assign(new extend_part_entity_1.ExtendPart(), {
            partNumber: this.searchTerm,
            branchCode: this.commonDataService.Branch.code,
            sapUserName: this.commonDataService.UserName,
            allowReplacedPart: true,
            isSimulated: false
        });
        this.showCreatePartLoader = true;
        this.partsSearchService.createExtendedPart(extendPartData)
            .then(function (responseMsgResult) {
            _this.showCreatePartLoader = false;
            if (responseMsgResult.ErrorType != undefined && responseMsgResult.ErrorType != null && responseMsgResult.ErrorType != 200) {
                _this.notification.errorMessage("PartsSearchComponent", "createExtendPart", "createPart", responseMsgResult);
            }
            else {
                _this.partsSearchService.notifyShowCreateModal({ data: responseMsgResult });
                console.log("Create Extended Part: ", responseMsgResult);
                _this.loader.loading = false;
                //this.router.navigate(['parts'], { queryParams: { searchTerm: extendPartData.partNumber } });
            }
        }, function (error) { _this.loader.loading = false; _this.showCreatePartLoader = false; });
    };
    AppComponent.prototype.markNotification = function (userNotification) {
        var _this = this;
        this.userNotificationService.markNotification(userNotification.notification.id, this.commonDataService.UserId)
            .then(function (mn) {
            if (mn.ErrorType != undefined && mn.ErrorType != null && mn.ErrorType != 200) {
                _this.notification.errorMessage("AppComponent", "markNotification", "markNotification", mn);
            }
            else {
                if (mn == true) {
                    userNotification.notificationUser.isRead = true;
                    _this.unreadUserNotificationsCount = _this.unreadUserNotificationsCount > 0 ? _this.unreadUserNotificationsCount - 1 : _this.unreadUserNotificationsCount;
                    //    _.filter(<any[]>this.userNotifications, function (item) {
                    //    return item.notificationUser.isRead == false;
                    //}).length;
                }
                console.log("App component markNotification : ", mn);
            }
        }, function (error) { });
    };
    AppComponent.prototype.markAllNotification = function () {
        var _this = this;
        this.userNotificationService.markAllNotification(this.commonDataService.UserId)
            .then(function (mn) {
            if (mn.ErrorType != undefined && mn.ErrorType != null && mn.ErrorType != 200) {
                _this.notification.errorMessage("AppComponent", "markAllNotification", "markAllNotification", mn);
            }
            else {
                if (mn == true) {
                    _this.userNotifications = _.each(_this.userNotifications, function (item) {
                        item.notificationUser.isRead = true;
                    });
                    _this.unreadUserNotificationsCount = 0;
                }
                console.log("App component markAllNotification : ", mn);
            }
        }, function (error) { });
    };
    AppComponent.prototype.disableScrollBar = function () {
        if (this.elementRef.nativeElement.querySelector('.my-coupon')) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            this.elementRef.nativeElement.querySelector('.coupon .my-coupon').style.display = "block";
        }
    };
    AppComponent.prototype.enableScrollBar = function () {
        if (this.elementRef.nativeElement.querySelector('.my-coupon')) {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
        this.elementRef.nativeElement.querySelector('.coupon .my-coupon').style.display = "none";
    };
    AppComponent.prototype.notificationDetails = function (userNotification) {
        if (userNotification.notification.notificationTypeId == 1) {
            this.showDailySalesReport(userNotification);
            if (userNotification.notificationUser.isRead == false) {
                this.markNotification(userNotification);
            }
        }
        else {
            this.markNotification(userNotification);
        }
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.subscriptionforpartcreated.unsubscribe();
        this.subscriptionforheadersearch.unsubscribe();
        this.loaderSubscription.unsubscribe();
        this.notificationSubscription.unsubscribe();
        this.subscriptionCreateExtendedPart.unsubscribe();
        this.routeChangeSubscription.unsubscribe();
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('createPartModal'),
    __metadata("design:type", create_part_component_1.CreatePartModalComponent)
], AppComponent.prototype, "createPartModalComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: "my-app",
        templateUrl: "./src/app/app.component.html?v=" + new Date().getTime(),
        providers: [authentication_service_1.AuthenticationService, app_config_service_1.AppConfigService, parts_search_service_1.PartsSearchService]
    }),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService,
        router_1.ActivatedRoute,
        router_1.Router,
        loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        core_1.ElementRef,
        core_1.ChangeDetectorRef,
        auth_guard_1.AuthGuard,
        common_1.Location,
        app_config_service_1.AppConfigService,
        cart_service_1.CartService,
        user_notification_service_1.UserNotificationService,
        parts_search_service_1.PartsSearchService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map