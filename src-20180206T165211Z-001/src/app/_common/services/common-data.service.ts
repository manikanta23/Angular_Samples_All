import { Injectable, EventEmitter } from "@angular/core";
import { BranchInfo } from "./../../_entities/branch.entity";
import { Token } from "./../../_entities/token.entity";

@Injectable()
export class CommonDataService {

    public commonDataUpdated: EventEmitter<any> = new EventEmitter();
    public branchUpdated: EventEmitter<any> = new EventEmitter();
    public partCreated: EventEmitter<any> = new EventEmitter();
    public headerSearchChange: EventEmitter<any> = new EventEmitter();
    public mscPayerUpdated: EventEmitter<any> = new EventEmitter();
    public showCouponsModalEventEmitter: EventEmitter<any> = new EventEmitter();
    public onGetCouponComplete: EventEmitter<any> = new EventEmitter();
    public onCouponSelectEventEmitter: EventEmitter<any> = new EventEmitter();
    public customerChangeEvent: EventEmitter<any> = new EventEmitter();
    public favouriteUpdateEventEmitter: EventEmitter<any> = new EventEmitter();

    public get DefaultCustomer(): any { return sessionStorage.getItem("DefaultCustomer") == undefined || sessionStorage.getItem("DefaultCustomer") == null ? { customerName: "Cash Customer", customerNumber: "200000" } : JSON.parse(sessionStorage.getItem("DefaultCustomer")) };

    public get DefaultBranch(): any { return sessionStorage.getItem("DefaultBranch") == undefined || sessionStorage.getItem("DefaultBranch") == null ? { name: "RTC San Antonio", code: "1001" } : JSON.parse(sessionStorage.getItem("DefaultBranch")) };
    public set DefaultBranch(value: any) { sessionStorage.setItem("DefaultBranch", JSON.stringify(value)); this.commonDataUpdated.emit(value); }

    public get AllOriginalBranches(): any { return sessionStorage.getItem("AllOriginalBranches") == undefined || sessionStorage.getItem("AllOriginalBranches") == null ? null : JSON.parse(sessionStorage.getItem("AllOriginalBranches")) };
    public set AllOriginalBranches(value: any) { sessionStorage.setItem("AllOriginalBranches", JSON.stringify(value)); }


    public get Customer(): any { return sessionStorage.getItem("Customer") == undefined || sessionStorage.getItem("Customer") == null ? this.DefaultCustomer : JSON.parse(sessionStorage.getItem("Customer")) };
    public set Customer(value: any) {
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
    }

    public get Branch(): any { return sessionStorage.getItem("Branch") == undefined || sessionStorage.getItem("Branch") == null ? this.DefaultBranch : JSON.parse(sessionStorage.getItem("Branch")) };
    public set Branch(value: any) { this.branchUpdated.emit({ previousBranch: this.Branch, newBranch: value }); sessionStorage.setItem("Branch", JSON.stringify(value)); this.cleanCheckoutData(); this.commonDataUpdated.emit(value); }

    public get UserId(): string { return sessionStorage.getItem("UserId") == undefined || sessionStorage.getItem("UserId") == null ? "" : sessionStorage.getItem("UserId") };
    public set UserId(value: string) { sessionStorage.setItem("UserId", value); this.commonDataUpdated.emit(value); }

    public get UserName(): string { return sessionStorage.getItem("UserName") == undefined || sessionStorage.getItem("UserName") == null ? "" : sessionStorage.getItem("UserName") };
    public set UserName(value: string) { sessionStorage.setItem("UserName", value); this.commonDataUpdated.emit(value); }

    public get UserIsPricingAlertEnabled(): string { return sessionStorage.getItem("UserIsPricingAlertEnabled") == undefined || sessionStorage.getItem("UserIsPricingAlertEnabled") == null ? "True" : sessionStorage.getItem("UserIsPricingAlertEnabled") };
    public set UserIsPricingAlertEnabled(value: string) { sessionStorage.setItem("UserIsPricingAlertEnabled", value); }

    public get ProviderKey(): string { return sessionStorage.getItem("ProviderKey") == undefined || sessionStorage.getItem("ProviderKey") == null ? "" : sessionStorage.getItem("ProviderKey") };
    public set ProviderKey(value: string) { sessionStorage.setItem("ProviderKey", value); this.commonDataUpdated.emit(value); }

    public get AuthToken(): Token { return sessionStorage.getItem("AuthToken") == undefined || sessionStorage.getItem("AuthToken") == null ? null : <Token>JSON.parse(sessionStorage.getItem("AuthToken")) };
    public set AuthToken(value: Token) { sessionStorage.setItem("AuthToken", JSON.stringify(value)); this.commonDataUpdated.emit(value); }

    public get CouponCriteria(): string[] { return ["COUPON", ":90"] };

    public get API_URL(): string { return sessionStorage.getItem("API_URL") == undefined || sessionStorage.getItem("API_URL") == null ? "http://localhost:46124/" : sessionStorage.getItem("API_URL") };
    public get CatalogSearchUrl(): string { return sessionStorage.getItem("CatalogSearchUrl") == undefined || sessionStorage.getItem("CatalogSearchUrl") == null || sessionStorage.getItem("CatalogSearchUrl") == "" ? "http://partrsolrwayd01:8080/pdf-search/search?q=" : sessionStorage.getItem("CatalogSearchUrl") };

    public get Images_Base_URL(): string { return "http://img.partsriver.com/" };

    public get Default_Image_URL(): string { return "/Content/Images/DefaultImage.jpg" };

    public get RTC_Delivery_Value(): number { return 0 };

    public get RTC_Freight_Delivery_Value(): number { return 0 };

    public get App_Insights_Instrumentation_Key(): string { return sessionStorage.getItem("App_Insights_Instrumentation_Key") == undefined || sessionStorage.getItem("App_Insights_Instrumentation_Key") == null ? "5d8ca701-58e8-4b77-92a3-f3b56e448750" : sessionStorage.getItem("App_Insights_Instrumentation_Key") };
    public get AppVersion(): string { return sessionStorage.getItem("AppVersion") == undefined || sessionStorage.getItem("AppVersion") == null ? "" : sessionStorage.getItem("AppVersion") };

    public get SelectedAlternateShipingAddress(): any { return sessionStorage.getItem("SelectedAlternateShipingAddress") == undefined || sessionStorage.getItem("SelectedAlternateShipingAddress") == null ? null : JSON.parse(sessionStorage.getItem("SelectedAlternateShipingAddress")) };
    public set SelectedAlternateShipingAddress(value: any) { sessionStorage.setItem("SelectedAlternateShipingAddress", JSON.stringify(value)); }

    public get PONumberValue(): string { return sessionStorage.getItem("PONumber") == undefined || sessionStorage.getItem("PONumber") == null || sessionStorage.getItem("PONumber") =="null" ? "" : JSON.parse(sessionStorage.getItem("PONumber")) };
    public set PONumberValue(value: string) { sessionStorage.setItem("PONumber", JSON.stringify(value)); }

    public get PrintPOFlag(): boolean { return sessionStorage.getItem("PrintPOFlag") == undefined || sessionStorage.getItem("PrintPOFlag") == null || sessionStorage.getItem("PrintPOFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("PrintPOFlag")) };
    public set PrintPOFlag(value: boolean) { sessionStorage.setItem("PrintPOFlag", JSON.stringify(value)); }

    public get CreateBillingFlag(): boolean { return sessionStorage.getItem("CreateBillingFlag") == undefined || sessionStorage.getItem("CreateBillingFlag") == null || sessionStorage.getItem("CreateBillingFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("CreateBillingFlag")) };
    public set CreateBillingFlag(value: boolean) { sessionStorage.setItem("CreateBillingFlag", JSON.stringify(value)); }

    public get PrintPickTicketFlag(): boolean { return sessionStorage.getItem("PrintPickTicketFlag") == undefined || sessionStorage.getItem("PrintPickTicketFlag") == null || sessionStorage.getItem("PrintPickTicketFlag") == "null" ? "" : JSON.parse(sessionStorage.getItem("PrintPickTicketFlag")) };
    public set PrintPickTicketFlag(value: boolean) { sessionStorage.setItem("PrintPickTicketFlag", JSON.stringify(value)); }


    public get UnitNumberValue(): string { return sessionStorage.getItem("UnitNumber") == undefined || sessionStorage.getItem("UnitNumber") == null || sessionStorage.getItem("UnitNumber") == "null" ? "" : JSON.parse(sessionStorage.getItem("UnitNumber")) };
    public set UnitNumberValue(value: string) { sessionStorage.setItem("UnitNumber", JSON.stringify(value)); }

    public get SelectedBillingType(): any { return sessionStorage.getItem("SelectedBillingType") == undefined || sessionStorage.getItem("SelectedBillingType") == null ? null : JSON.parse(sessionStorage.getItem("SelectedBillingType")) };
    public set SelectedBillingType(value: any) { sessionStorage.setItem("SelectedBillingType", JSON.stringify(value)); }

    public get SpecialInstructions(): string { return sessionStorage.getItem("SpecialInstructions") == undefined || sessionStorage.getItem("SpecialInstructions") == null || sessionStorage.getItem("SpecialInstructions") == "null" ? "" : JSON.parse(sessionStorage.getItem("SpecialInstructions")) };
    public set SpecialInstructions(value: string) { sessionStorage.setItem("SpecialInstructions", JSON.stringify(value)); }

    public get Notification_Time_Interval_In_Min(): number { return sessionStorage.getItem("Notification_Time_Interval_In_Min") == undefined || sessionStorage.getItem("Notification_Time_Interval_In_Min") == null ? 60 : parseInt(sessionStorage.getItem("Notification_Time_Interval_In_Min")) };

    public get Price_Override_Factor(): number { return sessionStorage.getItem("Price_Override_Factor") == undefined || sessionStorage.getItem("Price_Override_Factor") == null ? 10 : parseInt(sessionStorage.getItem("Price_Override_Factor")) };

    public get IsUserAdmin(): any { return localStorage.getItem("IsUserAdmin") == undefined || localStorage.getItem("IsUserAdmin") == null ? false : localStorage.getItem("IsUserAdmin") };
    public set IsUserAdmin(value: any) { localStorage.setItem("IsUserAdmin", value); this.commonDataUpdated.emit(value); }


    public get MscPayer(): any { return sessionStorage.getItem("MscPayer") == undefined || sessionStorage.getItem("MscPayer") == null ? null : JSON.parse(sessionStorage.getItem("MscPayer")) };
    public set MscPayer(value: any) { sessionStorage.setItem("MscPayer", JSON.stringify(value)); this.mscPayerUpdated.emit(value); }

    public get CartId(): any { return sessionStorage.getItem("CartId") == undefined || sessionStorage.getItem("CartId") == null ? null : JSON.parse(sessionStorage.getItem("CartId")) };
    public set CartId(value: any) { sessionStorage.setItem("CartId", JSON.stringify(value)); }

    public get Coupons(): any { return sessionStorage.getItem("Coupons") == undefined || sessionStorage.getItem("Coupons") == null ? null : JSON.parse(sessionStorage.getItem("Coupons")) };
    public set Coupons(value: any) { sessionStorage.setItem("Coupons", JSON.stringify(value)); }

    public get CouponVendors(): any { return sessionStorage.getItem("CouponVendors") == undefined || sessionStorage.getItem("CouponVendors") == null ? null : JSON.parse(sessionStorage.getItem("CouponVendors")) };
    public set CouponVendors(value: any) { sessionStorage.setItem("CouponVendors", JSON.stringify(value)); }

    public checkPartCouponVendorAssociation(partnumber: string): boolean {
        var searchStr: string = partnumber.substr(partnumber.lastIndexOf(':') + 1);
        if (this.CouponVendors != null && searchStr != '') {
            return (this.CouponVendors.indexOf(searchStr) > -1);
        } else {
            return false;
        }
    }

    public get CouponsPermissions(): any { return sessionStorage.getItem("CouponsPermissions") == undefined || sessionStorage.getItem("CouponsPermissions") == null ? null : JSON.parse(sessionStorage.getItem("CouponsPermissions")) };
    public set CouponsPermissions(value: any) { sessionStorage.setItem("CouponsPermissions", JSON.stringify(value)); }

    public cleanData() {
        sessionStorage.clear();
    }
    public cleanCheckoutData() {
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
    }

    sortData(data: any, sortBy: string, sortAsc: boolean = true): any {
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
    }
}