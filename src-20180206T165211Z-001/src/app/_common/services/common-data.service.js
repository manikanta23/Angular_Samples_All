"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var CommonDataService = (function () {
    function CommonDataService() {
        this.commonDataUpdated = new core_1.EventEmitter();
        this.branchUpdated = new core_1.EventEmitter();
        this.partCreated = new core_1.EventEmitter();
        this.headerSearchChange = new core_1.EventEmitter();
        this.mscPayerUpdated = new core_1.EventEmitter();
        this.showCouponsModalEventEmitter = new core_1.EventEmitter();
        this.onGetCouponComplete = new core_1.EventEmitter();
        this.onCouponSelectEventEmitter = new core_1.EventEmitter();
        this.customerChangeEvent = new core_1.EventEmitter();
        this.favouriteUpdateEventEmitter = new core_1.EventEmitter();
    }
    Object.defineProperty(CommonDataService.prototype, "DefaultCustomer", {
        get: function () { return sessionStorage.getItem("DefaultCustomer") == undefined || sessionStorage.getItem("DefaultCustomer") == null ? { customerName: "Cash Customer", customerNumber: "200000" } : JSON.parse(sessionStorage.getItem("DefaultCustomer")); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "DefaultBranch", {
        get: function () { return sessionStorage.getItem("DefaultBranch") == undefined || sessionStorage.getItem("DefaultBranch") == null ? { name: "RTC San Antonio", code: "1001" } : JSON.parse(sessionStorage.getItem("DefaultBranch")); },
        set: function (value) { sessionStorage.setItem("DefaultBranch", JSON.stringify(value)); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "AllOriginalBranches", {
        get: function () { return sessionStorage.getItem("AllOriginalBranches") == undefined || sessionStorage.getItem("AllOriginalBranches") == null ? null : JSON.parse(sessionStorage.getItem("AllOriginalBranches")); },
        set: function (value) { sessionStorage.setItem("AllOriginalBranches", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Customer", {
        get: function () { return sessionStorage.getItem("Customer") == undefined || sessionStorage.getItem("Customer") == null ? this.DefaultCustomer : JSON.parse(sessionStorage.getItem("Customer")); },
        set: function (value) {
            if (value == null || value == "" || value.customerNumber == "") {
                this.Coupons = null;
                this.CouponVendors = null;
                this.onGetCouponComplete.emit(1);
                value = this.DefaultCustomer;
                this.customerChangeEvent.emit({ previousCustomer: this.Customer, newCustomer: value });
            }
            else if (value.customerNumber != this.Customer.customerNumber) {
                this.Coupons = null;
                this.CouponVendors = null;
                this.onGetCouponComplete.emit(1);
                this.customerChangeEvent.emit({ previousCustomer: this.Customer, newCustomer: value });
            }
            sessionStorage.setItem("Customer", JSON.stringify(value));
            this.cleanCheckoutData();
            this.commonDataUpdated.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Branch", {
        get: function () { return sessionStorage.getItem("Branch") == undefined || sessionStorage.getItem("Branch") == null ? this.DefaultBranch : JSON.parse(sessionStorage.getItem("Branch")); },
        set: function (value) { this.branchUpdated.emit({ previousBranch: this.Branch, newBranch: value }); sessionStorage.setItem("Branch", JSON.stringify(value)); this.cleanCheckoutData(); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "UserId", {
        get: function () { return sessionStorage.getItem("UserId") == undefined || sessionStorage.getItem("UserId") == null ? "" : sessionStorage.getItem("UserId"); },
        set: function (value) { sessionStorage.setItem("UserId", value); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "UserName", {
        get: function () { return sessionStorage.getItem("UserName") == undefined || sessionStorage.getItem("UserName") == null ? "" : sessionStorage.getItem("UserName"); },
        set: function (value) { sessionStorage.setItem("UserName", value); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "UserIsPricingAlertEnabled", {
        get: function () { return sessionStorage.getItem("UserIsPricingAlertEnabled") == undefined || sessionStorage.getItem("UserIsPricingAlertEnabled") == null ? "True" : sessionStorage.getItem("UserIsPricingAlertEnabled"); },
        set: function (value) { sessionStorage.setItem("UserIsPricingAlertEnabled", value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "ProviderKey", {
        get: function () { return sessionStorage.getItem("ProviderKey") == undefined || sessionStorage.getItem("ProviderKey") == null ? "" : sessionStorage.getItem("ProviderKey"); },
        set: function (value) { sessionStorage.setItem("ProviderKey", value); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "AuthToken", {
        get: function () { return sessionStorage.getItem("AuthToken") == undefined || sessionStorage.getItem("AuthToken") == null ? null : JSON.parse(sessionStorage.getItem("AuthToken")); },
        set: function (value) { sessionStorage.setItem("AuthToken", JSON.stringify(value)); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "CouponCriteria", {
        get: function () { return ["COUPON", ":90"]; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "API_URL", {
        get: function () { return sessionStorage.getItem("API_URL") == undefined || sessionStorage.getItem("API_URL") == null ? "http://localhost:46124/" : sessionStorage.getItem("API_URL"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "CatalogSearchUrl", {
        get: function () { return sessionStorage.getItem("CatalogSearchUrl") == undefined || sessionStorage.getItem("CatalogSearchUrl") == null || sessionStorage.getItem("CatalogSearchUrl") == "" ? "http://partrsolrwayd01:8080/pdf-search/search?q=" : sessionStorage.getItem("CatalogSearchUrl"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Images_Base_URL", {
        get: function () { return "http://img.partsriver.com/"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Default_Image_URL", {
        get: function () { return "/Content/Images/DefaultImage.jpg"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "RTC_Delivery_Value", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "RTC_Freight_Delivery_Value", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "App_Insights_Instrumentation_Key", {
        get: function () { return sessionStorage.getItem("App_Insights_Instrumentation_Key") == undefined || sessionStorage.getItem("App_Insights_Instrumentation_Key") == null ? "5d8ca701-58e8-4b77-92a3-f3b56e448750" : sessionStorage.getItem("App_Insights_Instrumentation_Key"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "AppVersion", {
        get: function () { return sessionStorage.getItem("AppVersion") == undefined || sessionStorage.getItem("AppVersion") == null ? "" : sessionStorage.getItem("AppVersion"); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "SelectedAlternateShipingAddress", {
        get: function () { return sessionStorage.getItem("SelectedAlternateShipingAddress") == undefined || sessionStorage.getItem("SelectedAlternateShipingAddress") == null ? null : JSON.parse(sessionStorage.getItem("SelectedAlternateShipingAddress")); },
        set: function (value) { sessionStorage.setItem("SelectedAlternateShipingAddress", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "PONumberValue", {
        get: function () { return sessionStorage.getItem("PONumber") == undefined || sessionStorage.getItem("PONumber") == null || sessionStorage.getItem("PONumber") == "null" ? "" : JSON.parse(sessionStorage.getItem("PONumber")); },
        set: function (value) { sessionStorage.setItem("PONumber", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "PrintPOFlag", {
        get: function () { return sessionStorage.getItem("PrintPOFlag") == undefined || sessionStorage.getItem("PrintPOFlag") == null || sessionStorage.getItem("PrintPOFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("PrintPOFlag")); },
        set: function (value) { sessionStorage.setItem("PrintPOFlag", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "CreateBillingFlag", {
        get: function () { return sessionStorage.getItem("CreateBillingFlag") == undefined || sessionStorage.getItem("CreateBillingFlag") == null || sessionStorage.getItem("CreateBillingFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("CreateBillingFlag")); },
        set: function (value) { sessionStorage.setItem("CreateBillingFlag", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "PrintPickTicketFlag", {
        get: function () { return sessionStorage.getItem("PrintPickTicketFlag") == undefined || sessionStorage.getItem("PrintPickTicketFlag") == null || sessionStorage.getItem("PrintPickTicketFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("PrintPickTicketFlag")); },
        set: function (value) { sessionStorage.setItem("PrintPickTicketFlag", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "UnitNumberValue", {
        get: function () { return sessionStorage.getItem("UnitNumber") == undefined || sessionStorage.getItem("UnitNumber") == null || sessionStorage.getItem("UnitNumber") == "null" ? "" : JSON.parse(sessionStorage.getItem("UnitNumber")); },
        set: function (value) { sessionStorage.setItem("UnitNumber", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "SelectedBillingType", {
        get: function () { return sessionStorage.getItem("SelectedBillingType") == undefined || sessionStorage.getItem("SelectedBillingType") == null ? null : JSON.parse(sessionStorage.getItem("SelectedBillingType")); },
        set: function (value) { sessionStorage.setItem("SelectedBillingType", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "SpecialInstructions", {
        get: function () { return sessionStorage.getItem("SpecialInstructions") == undefined || sessionStorage.getItem("SpecialInstructions") == null || sessionStorage.getItem("SpecialInstructions") == "null" ? "" : JSON.parse(sessionStorage.getItem("SpecialInstructions")); },
        set: function (value) { sessionStorage.setItem("SpecialInstructions", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Notification_Time_Interval_In_Min", {
        get: function () { return sessionStorage.getItem("Notification_Time_Interval_In_Min") == undefined || sessionStorage.getItem("Notification_Time_Interval_In_Min") == null ? 60 : parseInt(sessionStorage.getItem("Notification_Time_Interval_In_Min")); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Price_Override_Factor", {
        get: function () { return sessionStorage.getItem("Price_Override_Factor") == undefined || sessionStorage.getItem("Price_Override_Factor") == null ? 10 : parseInt(sessionStorage.getItem("Price_Override_Factor")); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "IsUserAdmin", {
        get: function () { return localStorage.getItem("IsUserAdmin") == undefined || localStorage.getItem("IsUserAdmin") == null ? false : localStorage.getItem("IsUserAdmin"); },
        set: function (value) { localStorage.setItem("IsUserAdmin", value); this.commonDataUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "MscPayer", {
        get: function () { return sessionStorage.getItem("MscPayer") == undefined || sessionStorage.getItem("MscPayer") == null ? null : JSON.parse(sessionStorage.getItem("MscPayer")); },
        set: function (value) { sessionStorage.setItem("MscPayer", JSON.stringify(value)); this.mscPayerUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "CartId", {
        get: function () { return sessionStorage.getItem("CartId") == undefined || sessionStorage.getItem("CartId") == null ? null : JSON.parse(sessionStorage.getItem("CartId")); },
        set: function (value) { sessionStorage.setItem("CartId", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "Coupons", {
        get: function () { return sessionStorage.getItem("Coupons") == undefined || sessionStorage.getItem("Coupons") == null ? null : JSON.parse(sessionStorage.getItem("Coupons")); },
        set: function (value) { sessionStorage.setItem("Coupons", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CommonDataService.prototype, "CouponVendors", {
        get: function () { return sessionStorage.getItem("CouponVendors") == undefined || sessionStorage.getItem("CouponVendors") == null ? null : JSON.parse(sessionStorage.getItem("CouponVendors")); },
        set: function (value) { sessionStorage.setItem("CouponVendors", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    CommonDataService.prototype.checkPartCouponVendorAssociation = function (partnumber) {
        var searchStr = partnumber.substr(partnumber.lastIndexOf(':') + 1);
        if (this.CouponVendors != null && searchStr != '') {
            return (this.CouponVendors.indexOf(searchStr) > -1);
        }
        else {
            return false;
        }
    };
    Object.defineProperty(CommonDataService.prototype, "CouponsPermissions", {
        get: function () { return sessionStorage.getItem("CouponsPermissions") == undefined || sessionStorage.getItem("CouponsPermissions") == null ? null : JSON.parse(sessionStorage.getItem("CouponsPermissions")); },
        set: function (value) { sessionStorage.setItem("CouponsPermissions", JSON.stringify(value)); },
        enumerable: true,
        configurable: true
    });
    ;
    CommonDataService.prototype.cleanData = function () {
        sessionStorage.clear();
    };
    CommonDataService.prototype.cleanCheckoutData = function () {
        this.SelectedAlternateShipingAddress = null;
        this.SelectedBillingType = null;
        this.PONumberValue = null;
        this.CreateBillingFlag = null;
        this.PrintPickTicketFlag = null;
        this.PrintPOFlag = null;
        this.UnitNumberValue = null;
        this.SpecialInstructions = null;
        this.MscPayer = null;
        this.CartId = null;
    };
    CommonDataService.prototype.sortData = function (data, sortBy, sortAsc) {
        if (sortAsc === void 0) { sortAsc = true; }
        if (data != null) {
            data = data.sort(function (a, b) {
                var nameA = ("" + a[sortBy]).toLowerCase(); // ignore upper and lowercase
                var nameB = ("" + b[sortBy]).toLowerCase(); // ignore upper and lowercase
                if (sortAsc) {
                    if (+nameA && +nameB)
                        return +nameA - +nameB;
                    if (nameA < nameB)
                        return -1;
                    if (nameA > nameB)
                        return 1;
                }
                else {
                    if (+nameA && +nameB)
                        return parseFloat(nameB) - parseFloat(nameA);
                    if (nameB < nameA)
                        return -1;
                    if (nameB > nameA)
                        return 1;
                }
                return 0;
            }.bind(this));
        }
        return data;
    };
    return CommonDataService;
}());
CommonDataService = __decorate([
    core_1.Injectable()
], CommonDataService);
exports.CommonDataService = CommonDataService;
//# sourceMappingURL=common-data.service.js.map