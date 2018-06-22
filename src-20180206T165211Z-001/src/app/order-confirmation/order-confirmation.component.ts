import { Component, OnInit, ViewChild } from "@angular/core";
import { CartService } from "./../cart/cart.service";
import { Router, ActivatedRoute } from '@angular/router';

import { Title } from '@angular/platform-browser';
//import { CartSearch } from "./../_entities/cart.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { Clipboard } from "ts-clipboard";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import * as _ from "lodash";
import { LoaderService } from "./../_common/services/loader.service";
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { AppInsightBilling } from "../_entities/app-insight-billing.entity";
import { ApplicationInsightsService } from "../_common/services/application-insights.service";
import { AppInsightPart } from "../_entities/app-insight-part.entity";
declare var $: any;
declare var jQuery: any;

@Component({
    templateUrl: `./src/app/order-confirmation/order-confirmation.component.html?v=${new Date().getTime()}`,
    providers: [CartService, ApplicationInsightsService]
})

export class OrderConfirmationComponent implements OnInit {

    cartsData: any;
    partsBuyOutData: any;
    hasUnknownPartsBuyOut: boolean;
    hotFlagData: any;
    stockTransferData: any;
    cartCount: any;
    cartSubTotalAmount: any;
    mycartCount: any;
    errorMessage: any;
    //orderConfirmationData: any;
    deliveryOption: string = "";
    estimatedFrieght: number = 0;
    estimatedDelivery: number = 0;
    specialInstructions: string = "";
    selectedDelivery: string = "";
    total: number = 0;
    cartMessage: string;
    orderItems: any = null;
    order: any = null;
    showFrieghtRow: boolean = false;
    showDeliveryRow: boolean = false;
    printPickTicketFlag: boolean = false;
    printPOFlag: boolean = false;
    apiUrl: string = this.commonDataService.API_URL;
    orderId: string = "";
    orderConfirmationMessage: string = "";
    orderConfirmationFlag: boolean = false;
    createBillingFlag: boolean = false;
    createBillingErrorMsgs: any;
    authorizationNumber: string;
    completeOrderItems: any = null;
    includePO: boolean = true;
    constructor(private loader: LoaderService,
        private activatedRoute: ActivatedRoute,
        private cartService: CartService,
        private title: Title,
        private router: Router,
        private http: Http,
        private commonDataService: CommonDataService,
        private notification: NotificationService,
        private applicationInsightsService: ApplicationInsightsService) {
        title.setTitle("Order Confirmation - Parts Link");
        //this.notification.hideNotification();
    }

    ngOnInit() {
        let PrintPickTicketFlag = this.commonDataService.PrintPickTicketFlag;
        if (PrintPickTicketFlag != null) {
            this.printPickTicketFlag = PrintPickTicketFlag;
        }
        let PrintPOFlag = this.commonDataService.PrintPOFlag;
        if (PrintPOFlag != null) {
            this.printPOFlag = PrintPOFlag;
        }
        let CreateBillingFlag = this.commonDataService.CreateBillingFlag;
        if (CreateBillingFlag != null) {
            this.createBillingFlag = CreateBillingFlag;
        }
        this.activatedRoute
            .queryParams
            .subscribe(params => {
                this.orderId = params['orderId'];
                this.GetOrderConfirmation(this.orderId);
                console.log("Order confirmation OrderId : ", this.orderId);
            });
    }    
    GetOrderConfirmation(orderId: string): void {

        this.cartService.getOrderConfirmationResult(orderId)
            .then(oc => {
                if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                    this.notification.errorMessage("OrderConfirmationComponent", "GetOrderConfirmation", "getOrderConfirmationResult", oc);
                }
                else {
                    //this.orderConfirmationData = oc;
                    if (!oc || !oc.order || oc.order.length == 0) {
                        this.orderItems = null;
                        this.cartMessage = "cart item is not available.";
                    }
                    else {
                        this.order = oc.order;
                        this.completeOrderItems = oc.orderItems;
                        let orderItems = oc.orderItems;
                        let frieght = _.filter(<any[]>orderItems, function (row) {
                            return row.isFreight == true;
                        });

                        if (frieght && frieght.length > 0) {
                            this.estimatedFrieght = frieght[0].finalPrice;
                            this.showFrieghtRow = true;
                        }
                        else {
                            this.estimatedFrieght = 0;
                            this.showFrieghtRow = false;
                        }

                        let delivery = _.filter(<any[]>orderItems, function (row) {
                            //return row.isCustomerDelivery == true || row.isRTCDelivery == true;
                            return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                        });

                        if (delivery && delivery.length > 0) {
                            this.estimatedDelivery = delivery[0].finalPrice;
                            this.showDeliveryRow = true;
                        }
                        else {
                            this.estimatedDelivery = 0;
                            this.showDeliveryRow = false;
                        }

                        this.orderItems = _.reject(<any[]>orderItems, function (item) {
                            //return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true;
                            return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });

                        this.orderItems = _.reject(<any[]>orderItems, function (item) {
                            return item.isBuyOut == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                        });

                        this.partsBuyOutData = _.filter(<any[]>orderItems, function (row) {
                            return row.isBuyOut == true;
                        });

                        this.hasUnknownPartsBuyOut = _.filter(<any[]>orderItems, function (row) {
                            return row.partNumber == "PARTSBUYOUTTX";
                        }).length > 0;

                        this.hotFlagData = _.filter(<any[]>orderItems, function (row) {
                            return row.isHotFlag == true;
                        });

                        this.stockTransferData = _.filter(<any[]>orderItems, function (row) {
                            return row.isSTO == true;
                        });

                        this.cartCount = this.orderItems.length + this.partsBuyOutData.length + this.hotFlagData.length + this.stockTransferData.length;

                        let deliveryOption = "";

                        switch (oc.order.deliveryOptions) {
                            case 'Pickup':
                                {
                                    deliveryOption = "Will Call";
                                    break;
                                }
                            case 'Delivery':
                                {
                                    deliveryOption = "Rush Truck Centers Delivery";
                                    break;
                                }
                            case 'ShipTo': {
                                deliveryOption = "Freight delivery";
                            }
                        }

                        this.deliveryOption = deliveryOption;

                        this.total = this.calculateCartTotals() + this.estimatedFrieght + this.estimatedDelivery;
                    }
                }
                console.log("Order confirmation order details : ", oc);
            },
            error => { });
    }

    calculateCartTotals() {
        let totalPrice = 0;
        if (this.orderItems != undefined && this.orderItems != null && this.orderItems.length > 0) {
            this.orderItems.forEach((d) => {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery) {
                    //totalPrice += d.quantity * d.finalPrice;
                    totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
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

    copyToClipBoard(contentToCopy: string) {
        Clipboard.copy(contentToCopy);
        this.notification.showNotification(`${contentToCopy} copied to clipboard.`, NotificationType.Success);
    }

    downloadInvoice() {
        this.loader.loading = true;
        this.createBillingErrorMsgs = null;

        let sourceName = "OrderConfirmationComponent_downloadInvoice__Billing";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightBilling = Object.assign(new AppInsightBilling(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            orderNumber: this.order.sapOrderNo,
            PONumber: this.order.poNumber,
            plMetricName: sourceName,
            unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
        });
        appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.completeOrderItems, JSON.stringify(appInsightBilling).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightBilling);

        this.cartService.downloadInvoice(this.orderId)
            .then(oc => {
                if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                    this.createBillingFlag = false;                    
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    this.orderConfirmationFlag = false;
                    if (oc.status == 500) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            this.loader.loading = false;
                            let errorObject = JSON.parse(reader.result).message;
                            errorObject = JSON.parse(errorObject);
                            let errorCode = errorObject.code;
                            let errorMessage = errorObject.message;

                            if (errorCode == 'error_ibs') {
                                this.createBillingErrorMsgs = errorObject.createBillingErrorMsgs;
                                this.showModal();
                            } else {
                                this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                                jQuery("#orderConfirmationMessage").modal("show");
                            }
                        }
                        reader.readAsText(oc.blob());
                    }
                    else {
                        this.loader.loading = false;
                        this.notification.errorMessage("OrderConfirmationComponent", "downloadInvoice", "downloadInvoice", oc);
                    }
                }
                else {
                    this.loader.loading = false;
                    this.createBillingFlag = true;
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    console.log(oc);
                    var mediaType = 'application/pdf';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `Invoice_${this.order.sapOrderNo}.pdf`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                    this.orderConfirmationFlag = true;
                    jQuery("#orderConfirmationMessage").modal("show");
                }
            },
            error => { });
    }

    downloadPurchaseOrder() {
        this.loader.loading = true;
        this.createBillingErrorMsgs = null;

        let sourceName = "OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightBilling = Object.assign(new AppInsightBilling(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            orderNumber: this.order.sapOrderNo,
            PONumber: this.order.poNumber,
            plMetricName: sourceName
        });
        appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.completeOrderItems, JSON.stringify(appInsightBilling).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightBilling);

        this.cartService.downloadPurchaseOrder(this.orderId)
            .then(oc => {
                if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                    this.printPOFlag = false;
                    this.commonDataService.PrintPOFlag = this.printPOFlag;
                    this.orderConfirmationFlag = false;
                    if (oc.status == 500) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            this.loader.loading = false;
                            let errorObject = JSON.parse(reader.result).message;
                            errorObject = JSON.parse(errorObject);
                            let errorCode = errorObject.code;
                            let errorMessage = errorObject.message;

                            if (errorCode == 'error_ibs') {
                                this.createBillingErrorMsgs = errorObject.createBillingErrorMsgs;
                                this.showModal();
                            } else {
                                this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                                jQuery("#orderConfirmationMessage").modal("show");
                            }
                        }
                        reader.readAsText(oc.blob());
                    }
                    else {
                        this.loader.loading = false;
                        this.notification.errorMessage("OrderConfirmationComponent", "downloadPurchaseOrder", "downloadPurchaseOrder", oc);
                    }
                }
                else {
                    this.loader.loading = false;
                    this.printPOFlag = true;
                    this.commonDataService.PrintPOFlag = this.printPOFlag;
                    console.log(oc);
                    var mediaType = 'application/pdf';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `PurchaseOrder_${this.order.sapOrderNo}.pdf`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                    this.orderConfirmationFlag = true;
                    jQuery("#orderConfirmationMessage").modal("show");
                }
            },
            error => { });
    }

    getPickTicket() {

        let sourceName = "OrderConfirmationComponent_getPickTicket__PrintPickTicket";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightBilling = Object.assign(new AppInsightBilling(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            orderNumber: this.order.sapOrderNo,
            PONumber: this.order.poNumber,
            plMetricName: sourceName
        });
        appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.completeOrderItems, JSON.stringify(appInsightBilling).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightBilling);

        this.loader.loading = true;
        this.cartService.getPickTicket(this.orderId)
            .then(oc => {
                if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                    this.printPickTicketFlag = false;
                    this.commonDataService.PrintPickTicketFlag = this.printPickTicketFlag;
                    //this.createBillingFlag = false;
                    this.orderConfirmationFlag = false;
                    if (oc.status == 500) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            this.loader.loading = false;
                            let errorMessage = JSON.parse(reader.result).message;
                            this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                            jQuery("#orderConfirmationMessage").modal("show");
                        }
                        reader.readAsText(oc.blob());
                    }
                    else {
                        this.loader.loading = false;
                        this.notification.errorMessage("OrderConfirmationComponent", "getPickTicket", "getPickTicket", oc);
                    }
                } else {
                    this.printPickTicketFlag = true;
                    this.commonDataService.PrintPickTicketFlag = this.printPickTicketFlag;
                    this.loader.loading = false;
                    //this.createBillingFlag = true;
                    console.log(oc);
                    var mediaType = 'application/pdf';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `PickTicket_${this.order.sapOrderNo}.pdf`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                    this.orderConfirmationFlag = true;
                    jQuery("#orderConfirmationMessage").modal("show");
                }
            },
            error => { });
    }

    printSAPQuote() {
        this.loader.loading = true;
        this.cartService.printSAPQuote(this.orderId, true)
            .then(oc => {
                if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                    this.createBillingFlag = false;
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    this.orderConfirmationFlag = false;
                    if (oc.status == 500) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            let errorMessage = JSON.parse(reader.result).message;
                            this.loader.loading = false;
                            this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                            jQuery("#orderConfirmationMessage").modal("show");
                        }
                        reader.readAsText(oc.blob());
                    }
                    else {
                        this.loader.loading = false;
                        this.notification.errorMessage("OrderConfirmationComponent", "printSAPQuote", "printSAPQuote", oc);
                    }
                } else {
                    this.loader.loading = false;
                    this.createBillingFlag = true;
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    console.log(oc);
                    var mediaType = 'application/pdf';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `PrintTicket_${this.order.sapOrderNo}.pdf`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                    this.orderConfirmationFlag = true;
                    jQuery("#orderConfirmationMessage").modal("show");
                }
            },
            error => {

            });
    }

    createBilling() {
        this.notification.showMultilineNotification(this.createBillingErrorMsgs);
        console.log(this.createBillingErrorMsgs);
    }

    showModal(): void {
        jQuery("#createBillingModal").modal("show");
    }

    closeModal(): void {
        jQuery("#createBillingModal").modal("hide");
    }

    downloadSAPShortCut() {
        this.cartService.downloadSapShortcut(this.order.sapOrderNo)
            .then(oc => {
                if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                    this.notification.errorMessage("OrderConfirmationComponent", "downloadSAPShortCut", "downloadSapShortcut", oc);
                }
                else {
                    console.log(oc);
                    var mediaType = 'application/x-sapshortcut';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `saporder_${this.order.sapOrderNo}.sap`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                }
            },
            error => { });
    }

    clearCustomerValue() {
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    }

    onPurchaseOrderChange() {
        this.cartService.updatePurchaseOrder(this.orderId, this.includePO)
            .then(po => {
                console.log("Purchase Order details : ", po);
            },
            error => { });
    }

    onCreateBillingKeypress(event) {
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    submitIBSOverrideCreateBilling() {
        this.loader.loading = true;
        this.cartService.submitIBSOverrideCreateBilling(this.orderId, this.order.sapOrderNo, this.authorizationNumber)
            .then(oc => {
                if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                    this.createBillingFlag = false;
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    this.orderConfirmationFlag = false;
                    if (oc.status == 500) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            let errorMessage = JSON.parse(reader.result).message;
                            this.loader.loading = false;

                            if (errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "") {
                                this.closeModal();
                                this.notification.showNotification(errorMessage, NotificationType.Error);
                            }
                            else {
                                this.orderConfirmationMessage = "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                                jQuery("#orderConfirmationMessage").modal("show");
                            }
                        }
                        reader.readAsText(oc.blob());
                    }
                    else {
                        this.loader.loading = false;
                        this.notification.errorMessage("OrderConfirmationComponent", "downloadInvoice", "downloadInvoice", oc);
                    }
                }
                else {
                    this.loader.loading = false;
                    this.createBillingFlag = true;
                    this.commonDataService.CreateBillingFlag = this.createBillingFlag;
                    console.log(oc);
                    var mediaType = 'application/pdf';
                    var blob = new Blob([oc._body], { type: mediaType });
                    var filename = `Invoice_${this.order.sapOrderNo}.pdf`;
                    if (navigator.msSaveOrOpenBlob) {
                        return navigator.msSaveOrOpenBlob(blob, filename);
                    }

                    var linkElement = document.createElement('a');
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                    this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                    this.orderConfirmationFlag = true;
                    this.closeModal();
                    jQuery("#orderConfirmationMessage").modal("show");
                }
            },
            error => { });
    }
}