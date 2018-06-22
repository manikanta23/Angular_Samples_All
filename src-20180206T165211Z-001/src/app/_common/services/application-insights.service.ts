import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./common-data.service";
import { AppInsightsService } from 'ng2-appinsights';
import { AppInsightPart } from "../../_entities/app-insight-part.entity";
import * as _ from "lodash";

@Injectable()
export class ApplicationInsightsService {

    constructor(private appInsightsService: AppInsightsService, private commonDataService: CommonDataService) {
        try {
            this.appInsightsService.Init({
                instrumentationKey: this.commonDataService.App_Insights_Instrumentation_Key,
                enableDebug: true,
                disableExceptionTracking: false
            });
        } catch (e) {
            console.error('ApplicationInsightsService constructor init error: ', e);
        }

    }

    trackPageView(): void {
        try {
            this.appInsightsService.trackPageView(undefined, undefined, this.setApplicationVersion());
        } catch (e) {
            console.error('ApplicationInsightsService trackPageView error: ', e);
        }
    };

    trackMetric(name: string, properties?: any): void {
        try {
            this.appInsightsService.trackMetric(name, 0, 0, 0, 0, this.setApplicationVersion(properties));
        } catch (e) {
            console.error('applicationinsightsservice trackmetric error: ', e);
        }
    };

    trackException(exception: Error, handledAt?: string, properties?: any): void {
        try {
            this.appInsightsService.trackException(exception, handledAt, this.setApplicationVersion(properties));
        } catch (e) {
            console.error('ApplicationInsightsService trackException error: ', e);
        }
    };

    setApplicationVersion(properties?: any) {
        try {
            if (properties) {
                properties.applicaion_Version = this.commonDataService.AppVersion;
            } else {
                properties = { "applicaion_Version": this.commonDataService.AppVersion };
            }
            return properties;
        } catch (e) {
            console.error('ApplicationInsightsService setApplicationVersion error: ', e);
        }
    }

    getAppInsightParts(data: any, remainingDataLength: number): any {
        if (data != undefined && data != null) {
            let parts: any = null;
            if (data instanceof Array) {
                parts = _.map(data, function (element, idx) {
                    let part: any = element;
                    return JSON.parse(JSON.stringify(Object.assign(new AppInsightPart(), {
                        partId: part.partId ? part.partId : '',
                        partNumber: part.partNumber ? part.partNumber : (part.rushPartNumber ? part.rushPartNumber : ''),
                        partCost: part.yourPrice ? part.yourPrice : (part.customerPrice ? part.customerPrice : 0),
                        customerPrice: part.verifiedPrice ? part.verifiedPrice : (part.adjustedPrice ? part.adjustedPrice : (part.finalPrice ? part.finalPrice : (part.customerPrice ? part.customerPrice : (part.listPrice ? part.listPrice : 0)))),
                        quantity: part.quantity ? part.quantity : 0,
                        quantityAvailable: part.quantityAvailable ? part.quantityAvailable : 0,
                        verifiedPrice: part.verifiedPrice ? part.verifiedPrice : 0,
                        isSpecialPricing: part.isSpecialPricing ? part.isSpecialPricing : false,
                        vendorCode: part.vendorCode ? part.vendorCode:'',
                        hotFlagCode: part.hotFlagCode ? part.hotFlagCode:''
                    })).replace(/'/g, '"'));
                });
            } else {
                parts = JSON.parse(JSON.stringify(Object.assign(new AppInsightPart(), {
                    partId: data.partId ? data.partId : '',
                    partNumber: data.partNumber ? data.partNumber : (data.rushPartNumber ? data.rushPartNumber : ''),
                    partCost: data.yourPrice ? data.yourPrice : (data.customerPrice ? data.customerPrice : 0),
                    customerPrice: data.verifiedPrice ? data.verifiedPrice : (data.adjustedPrice ? data.adjustedPrice : (data.finalPrice ? data.finalPrice : (data.customerPrice ? data.customerPrice : (data.listPrice ? data.listPrice : 0)))),
                    quantity: data.quantity ? data.quantity : 0,
                    quantityAvailable: data.quantityAvailable ? data.quantityAvailable : (data.QuantityAvailable ? data.QuantityAvailable : 0),
                    verifiedPrice: data.verifiedPrice ? data.verifiedPrice : 0,
                    isSpecialPricing: data.isSpecialPricing ? data.isSpecialPricing : false,
                    vendorCode: data.vendorCode ? data.vendorCode : '',
                    hotFlagCode: data.hotFlagCode ? data.hotFlagCode : ''
                })).replace(/'/g, '"'));
            }

            let result = JSON.stringify(parts, null, '');

            if (result.length > (1024 - remainingDataLength)) {
                result = this.getAppInsightSerializedJson(this.getAppInsightPartNumbers(data, (1024 - remainingDataLength)));
                return result;
            }
            else {
                return this.getAppInsightSerializedJson(parts);
            }
        }
        else {
            return "";
        }
    }

    getAppInsightPartNumbers(data: any, maxlength: number): any {
        let partNumbers: string = null;
        let partNumberArray: any = null;
        if (data instanceof Array) {
            partNumbers = _.map(data, function (elem) { return elem.partNumber ? elem.partNumber : (elem.rushPartNumber ? elem.rushPartNumber : ''); }).join(",");

            if (partNumbers.length > maxlength) {
                let truncateMessage: string = '...';
                partNumbers = partNumbers.substring(0, maxlength - 5);
                let truncatedPartNumber: string = partNumbers.substring(0, partNumbers.lastIndexOf(',') - (truncateMessage.length));
                partNumberArray = (truncatedPartNumber.substring(0, truncatedPartNumber.lastIndexOf(',')) + ',' + truncateMessage).split(',');
            } else {
                partNumberArray = partNumbers.split(',');
            }

        } else {
            partNumbers = data.partNumber ? data.partNumber : (data.rushPartNumber ? data.rushPartNumber : '');
            partNumberArray = [partNumbers];
        }

        return partNumberArray;
    }

    getAppInsightCoupon(coupon: any): any {
        let couponData = { id: coupon.couponId, code: coupon.couponCode, customerSegmentId: coupon.customerSegmentId };
        return JSON.parse(JSON.stringify(JSON.stringify(couponData).replace(/'/g, '"'), null, ''));
    }

    //getAppInsightVendor(vendor: any): any {
    //    return JSON.parse(JSON.stringify(JSON.stringify(vendor).replace(/'/g, '"'), null, ''));
    //}

    getAppInsightSerializedJson(data: any): any {
        return JSON.parse(JSON.stringify(JSON.stringify(data).replace(/'/g, '"'), null, ''));
    }

    ///TrackMetricNameCollection START
    private metricKeyValue: { [metricKey: string]: string } = {
        'CartComponent_removeCartItems': 'Cart\\RemoveCartItem',
        'CartComponent_confirmPartsBuyout__KnownPartBuyout': 'Cart\\PartBuyout',
        'CartComponent_sendHotFlag': 'Cart\\PartBuyout',
        'CartComponent_checkout': 'Cart\\Checkout',
        'CheckoutComponent_placeOrder_placeOrder_Quote': 'Checkout\\CreateQuote',
        'CheckoutComponent_placeOrder_placeOrder_Order': 'Checkout\\CreateOrder',
        'CheckoutComponent_DeleteCartItem': 'Cart\\DeleteCartItem',
        'CheckoutComponent_removeCouponCartItems': 'Cart\\RemoveCoupon',
        'PartSearch_CustomerComponent_customerSearch_getCustomers': 'Home\\CustomerSearch',
        'HeaderSearch_CustomerComponent_customerSearch_getCustomers': 'SiteCustomerSearch',
        'OrderConfirmationComponent_downloadInvoice__Billing': 'OrderConfirmationComponent_downloadInvoice__Billing',
        'OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder': 'OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder',
        'OrderConfirmationComponent_getPickTicket__PrintPickTicket': 'OrderConfirmationComponent_getPickTicket__PrintPickTicket',
        'AlternateRelatedComponent_addToCart': 'AlternateRelatedComponent_addToCart',
        'PartsDetailsComponent_addToCart': 'PartsDetailsComponent_addToCart',
        'NationalInventoryComponent_addToCart__STO': 'NationalInventoryComponent_addToCart__STO',
        'PartsComponent_getParts_getParts': 'PartsComponent_getParts_getParts',
        'HeaderSearchComponent_partSearch_getPartCount': 'HeaderSearchComponent_partSearch_getPartCount',
        'HeaderSearchComponent_removeCartItems': 'HeaderSearchComponent_removeCartItems',
        'CustomerModalComponent_onCustomerSelect': 'CustomerModalComponent_onCustomerSelect',
        'FavouritesModalComponent_onSelectFavouriteCustomer': 'FavouritesModalComponent_onSelectFavouriteCustomer',
        'PartBuyoutModalComponent_addToCart__UnknownPartBuyout': 'PartBuyoutModalComponent_addToCart__UnknownPartBuyout',
        'PartsSearchComponent_partSearch_getPartCount': 'PartsSearchComponent_partSearch_getPartCount'
    };
    public getMetricValue(metricKey: string): string {
        return this.metricKeyValue[metricKey];
    }
    ///TrackMetricNameCollection END
}

export enum SourceLocationType {
    PartSearch,
    HeaderSearch,
    PartSearch_CustomerSearch,
    HeaderSearch_CustomerSearch,
    PartSearch_AdvancedCustomerSearch,
    HeaderSearch_AdvancedCustomerSearch,
    PartSearch_PartSearch,
    HeaderSearch_PartSearch,
    PartListResult,
    PartListRefineSearch,
    PartDetailResult,
    AlternateParts,
    RelatedParts,
    Cart,
    Checkout,
    OrderConfirmation,
    FavouriteCustomer,
    FavouriteVendor,
    PriceVerifyCartLineItem,
    PriceVerifyAllCartLineItems,
    PartDetailPriceVerify,
    PartsResult
}
