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
var core_1 = require("@angular/core");
var cart_service_1 = require("./../cart/cart.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
//import { CartSearch } from "./../_entities/cart.entity";
var common_data_service_1 = require("./../_common/services/common-data.service");
var ts_clipboard_1 = require("ts-clipboard");
var notification_service_1 = require("./../_common/services/notification.service");
var _ = require("lodash");
var loader_service_1 = require("./../_common/services/loader.service");
var http_1 = require("@angular/http");
var app_insight_billing_entity_1 = require("../_entities/app-insight-billing.entity");
var application_insights_service_1 = require("../_common/services/application-insights.service");
var OrderConfirmationComponent = (function () {
    function OrderConfirmationComponent(loader, activatedRoute, cartService, title, router, http, commonDataService, notification, applicationInsightsService) {
        this.loader = loader;
        this.activatedRoute = activatedRoute;
        this.cartService = cartService;
        this.title = title;
        this.router = router;
        this.http = http;
        this.commonDataService = commonDataService;
        this.notification = notification;
        this.applicationInsightsService = applicationInsightsService;
        //orderConfirmationData: any;
        this.deliveryOption = "";
        this.estimatedFrieght = 0;
        this.estimatedDelivery = 0;
        this.specialInstructions = "";
        this.selectedDelivery = "";
        this.total = 0;
        this.orderItems = null;
        this.order = null;
        this.showFrieghtRow = false;
        this.showDeliveryRow = false;
        this.printPickTicketFlag = false;
        this.printPOFlag = false;
        this.apiUrl = this.commonDataService.API_URL;
        this.orderId = "";
        this.orderConfirmationMessage = "";
        this.orderConfirmationFlag = false;
        this.createBillingFlag = false;
        this.completeOrderItems = null;
        this.includePO = true;
        title.setTitle("Order Confirmation - Parts Link");
        //this.notification.hideNotification();
    }
    OrderConfirmationComponent.prototype.ngOnInit = function () {
        var _this = this;
        var PrintPickTicketFlag = this.commonDataService.PrintPickTicketFlag;
        if (PrintPickTicketFlag != null) {
            this.printPickTicketFlag = PrintPickTicketFlag;
        }
        var PrintPOFlag = this.commonDataService.PrintPOFlag;
        if (PrintPOFlag != null) {
            this.printPOFlag = PrintPOFlag;
        }
        var CreateBillingFlag = this.commonDataService.CreateBillingFlag;
        if (CreateBillingFlag != null) {
            this.createBillingFlag = CreateBillingFlag;
        }
        this.activatedRoute
            .queryParams
            .subscribe(function (params) {
            _this.orderId = params['orderId'];
            _this.GetOrderConfirmation(_this.orderId);
            console.log("Order confirmation OrderId : ", _this.orderId);
        });
    };
    OrderConfirmationComponent.prototype.GetOrderConfirmation = function (orderId) {
        var _this = this;
        this.cartService.getOrderConfirmationResult(orderId)
            .then(function (oc) {
            if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                _this.notification.errorMessage("OrderConfirmationComponent", "GetOrderConfirmation", "getOrderConfirmationResult", oc);
            }
            else {
                //this.orderConfirmationData = oc;
                if (!oc || !oc.order || oc.order.length == 0) {
                    _this.orderItems = null;
                    _this.cartMessage = "cart item is not available.";
                }
                else {
                    _this.order = oc.order;
                    _this.completeOrderItems = oc.orderItems;
                    var orderItems = oc.orderItems;
                    var frieght = _.filter(orderItems, function (row) {
                        return row.isFreight == true;
                    });
                    if (frieght && frieght.length > 0) {
                        _this.estimatedFrieght = frieght[0].finalPrice;
                        _this.showFrieghtRow = true;
                    }
                    else {
                        _this.estimatedFrieght = 0;
                        _this.showFrieghtRow = false;
                    }
                    var delivery = _.filter(orderItems, function (row) {
                        //return row.isCustomerDelivery == true || row.isRTCDelivery == true;
                        return row.isCustomerDelivery == true || row.isRTCDelivery == true || (row.partNumOnly == "DELIVERY:90" && row.isFreight == false && row.isCustomerDelivery == false && row.isRTCDelivery == false);
                    });
                    if (delivery && delivery.length > 0) {
                        _this.estimatedDelivery = delivery[0].finalPrice;
                        _this.showDeliveryRow = true;
                    }
                    else {
                        _this.estimatedDelivery = 0;
                        _this.showDeliveryRow = false;
                    }
                    _this.orderItems = _.reject(orderItems, function (item) {
                        //return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true;
                        return item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    _this.orderItems = _.reject(orderItems, function (item) {
                        return item.isBuyOut == true || item.isHotFlag == true || item.isSTO == true || item.isFreight == true || item.isCustomerDelivery == true || item.isRTCDelivery == true || (item.partNumOnly == "DELIVERY:90" && item.isFreight == false && item.isCustomerDelivery == false && item.isRTCDelivery == false);
                    });
                    _this.partsBuyOutData = _.filter(orderItems, function (row) {
                        return row.isBuyOut == true;
                    });
                    _this.hasUnknownPartsBuyOut = _.filter(orderItems, function (row) {
                        return row.partNumber == "PARTSBUYOUTTX";
                    }).length > 0;
                    _this.hotFlagData = _.filter(orderItems, function (row) {
                        return row.isHotFlag == true;
                    });
                    _this.stockTransferData = _.filter(orderItems, function (row) {
                        return row.isSTO == true;
                    });
                    _this.cartCount = _this.orderItems.length + _this.partsBuyOutData.length + _this.hotFlagData.length + _this.stockTransferData.length;
                    var deliveryOption = "";
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
                    _this.deliveryOption = deliveryOption;
                    _this.total = _this.calculateCartTotals() + _this.estimatedFrieght + _this.estimatedDelivery;
                }
            }
            console.log("Order confirmation order details : ", oc);
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.calculateCartTotals = function () {
        var totalPrice = 0;
        if (this.orderItems != undefined && this.orderItems != null && this.orderItems.length > 0) {
            this.orderItems.forEach(function (d) {
                if (!d.isFreight && !d.isCustomerDelivery && !d.isRTCDelivery) {
                    //totalPrice += d.quantity * d.finalPrice;
                    totalPrice += d.quantity * (d.finalPrice + (d.coreOption == "CORE1" || d.coreOption == null ? 0 : d.corePrice));
                }
            });
        }
        if (this.partsBuyOutData != undefined && this.partsBuyOutData != null && this.partsBuyOutData.length > 0) {
            this.partsBuyOutData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.hotFlagData != undefined && this.hotFlagData != null && this.hotFlagData.length > 0) {
            this.hotFlagData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        if (this.stockTransferData != undefined && this.stockTransferData != null && this.stockTransferData.length > 0) {
            this.stockTransferData.forEach(function (d) {
                totalPrice += d.quantity * (d.coreOption == "NOCORER" ? d.corePrice + d.finalPrice : d.finalPrice);
            });
        }
        return totalPrice;
    };
    OrderConfirmationComponent.prototype.copyToClipBoard = function (contentToCopy) {
        ts_clipboard_1.Clipboard.copy(contentToCopy);
        this.notification.showNotification(contentToCopy + " copied to clipboard.", notification_service_1.NotificationType.Success);
    };
    OrderConfirmationComponent.prototype.downloadInvoice = function () {
        var _this = this;
        this.loader.loading = true;
        this.createBillingErrorMsgs = null;
        var sourceName = "OrderConfirmationComponent_downloadInvoice__Billing";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
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
            .then(function (oc) {
            if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                _this.createBillingFlag = false;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                _this.orderConfirmationFlag = false;
                if (oc.status == 500) {
                    var reader_1 = new FileReader();
                    reader_1.onload = function (e) {
                        _this.loader.loading = false;
                        var errorObject = JSON.parse(reader_1.result).message;
                        errorObject = JSON.parse(errorObject);
                        var errorCode = errorObject.code;
                        var errorMessage = errorObject.message;
                        if (errorCode == 'error_ibs') {
                            _this.createBillingErrorMsgs = errorObject.createBillingErrorMsgs;
                            _this.showModal();
                        }
                        else {
                            _this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                            jQuery("#orderConfirmationMessage").modal("show");
                        }
                    };
                    reader_1.readAsText(oc.blob());
                }
                else {
                    _this.loader.loading = false;
                    _this.notification.errorMessage("OrderConfirmationComponent", "downloadInvoice", "downloadInvoice", oc);
                }
            }
            else {
                _this.loader.loading = false;
                _this.createBillingFlag = true;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                console.log(oc);
                var mediaType = 'application/pdf';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "Invoice_" + _this.order.sapOrderNo + ".pdf";
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
                _this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                _this.orderConfirmationFlag = true;
                jQuery("#orderConfirmationMessage").modal("show");
            }
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.downloadPurchaseOrder = function () {
        var _this = this;
        this.loader.loading = true;
        this.createBillingErrorMsgs = null;
        var sourceName = "OrderConfirmationComponent_downloadPurchaseOrder__PurchaseOrder";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
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
            .then(function (oc) {
            if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                _this.printPOFlag = false;
                _this.commonDataService.PrintPOFlag = _this.printPOFlag;
                _this.orderConfirmationFlag = false;
                if (oc.status == 500) {
                    var reader_2 = new FileReader();
                    reader_2.onload = function (e) {
                        _this.loader.loading = false;
                        var errorObject = JSON.parse(reader_2.result).message;
                        errorObject = JSON.parse(errorObject);
                        var errorCode = errorObject.code;
                        var errorMessage = errorObject.message;
                        if (errorCode == 'error_ibs') {
                            _this.createBillingErrorMsgs = errorObject.createBillingErrorMsgs;
                            _this.showModal();
                        }
                        else {
                            _this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                            jQuery("#orderConfirmationMessage").modal("show");
                        }
                    };
                    reader_2.readAsText(oc.blob());
                }
                else {
                    _this.loader.loading = false;
                    _this.notification.errorMessage("OrderConfirmationComponent", "downloadPurchaseOrder", "downloadPurchaseOrder", oc);
                }
            }
            else {
                _this.loader.loading = false;
                _this.printPOFlag = true;
                _this.commonDataService.PrintPOFlag = _this.printPOFlag;
                console.log(oc);
                var mediaType = 'application/pdf';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "PurchaseOrder_" + _this.order.sapOrderNo + ".pdf";
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
                _this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                _this.orderConfirmationFlag = true;
                jQuery("#orderConfirmationMessage").modal("show");
            }
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.getPickTicket = function () {
        var _this = this;
        var sourceName = "OrderConfirmationComponent_getPickTicket__PrintPickTicket";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
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
            .then(function (oc) {
            if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                _this.printPickTicketFlag = false;
                _this.commonDataService.PrintPickTicketFlag = _this.printPickTicketFlag;
                //this.createBillingFlag = false;
                _this.orderConfirmationFlag = false;
                if (oc.status == 500) {
                    var reader_3 = new FileReader();
                    reader_3.onload = function (e) {
                        _this.loader.loading = false;
                        var errorMessage = JSON.parse(reader_3.result).message;
                        _this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                        jQuery("#orderConfirmationMessage").modal("show");
                    };
                    reader_3.readAsText(oc.blob());
                }
                else {
                    _this.loader.loading = false;
                    _this.notification.errorMessage("OrderConfirmationComponent", "getPickTicket", "getPickTicket", oc);
                }
            }
            else {
                _this.printPickTicketFlag = true;
                _this.commonDataService.PrintPickTicketFlag = _this.printPickTicketFlag;
                _this.loader.loading = false;
                //this.createBillingFlag = true;
                console.log(oc);
                var mediaType = 'application/pdf';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "PickTicket_" + _this.order.sapOrderNo + ".pdf";
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
                _this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                _this.orderConfirmationFlag = true;
                jQuery("#orderConfirmationMessage").modal("show");
            }
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.printSAPQuote = function () {
        var _this = this;
        this.loader.loading = true;
        this.cartService.printSAPQuote(this.orderId, true)
            .then(function (oc) {
            if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                _this.createBillingFlag = false;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                _this.orderConfirmationFlag = false;
                if (oc.status == 500) {
                    var reader_4 = new FileReader();
                    reader_4.onload = function (e) {
                        var errorMessage = JSON.parse(reader_4.result).message;
                        _this.loader.loading = false;
                        _this.orderConfirmationMessage = errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "" ? errorMessage : "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                        jQuery("#orderConfirmationMessage").modal("show");
                    };
                    reader_4.readAsText(oc.blob());
                }
                else {
                    _this.loader.loading = false;
                    _this.notification.errorMessage("OrderConfirmationComponent", "printSAPQuote", "printSAPQuote", oc);
                }
            }
            else {
                _this.loader.loading = false;
                _this.createBillingFlag = true;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                console.log(oc);
                var mediaType = 'application/pdf';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "PrintTicket_" + _this.order.sapOrderNo + ".pdf";
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
                _this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                _this.orderConfirmationFlag = true;
                jQuery("#orderConfirmationMessage").modal("show");
            }
        }, function (error) {
        });
    };
    OrderConfirmationComponent.prototype.createBilling = function () {
        this.notification.showMultilineNotification(this.createBillingErrorMsgs);
        console.log(this.createBillingErrorMsgs);
    };
    OrderConfirmationComponent.prototype.showModal = function () {
        jQuery("#createBillingModal").modal("show");
    };
    OrderConfirmationComponent.prototype.closeModal = function () {
        jQuery("#createBillingModal").modal("hide");
    };
    OrderConfirmationComponent.prototype.downloadSAPShortCut = function () {
        var _this = this;
        this.cartService.downloadSapShortcut(this.order.sapOrderNo)
            .then(function (oc) {
            if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                _this.notification.errorMessage("OrderConfirmationComponent", "downloadSAPShortCut", "downloadSapShortcut", oc);
            }
            else {
                console.log(oc);
                var mediaType = 'application/x-sapshortcut';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "saporder_" + _this.order.sapOrderNo + ".sap";
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
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.clearCustomerValue = function () {
        this.commonDataService.Customer = this.commonDataService.DefaultCustomer;
        this.router.navigate(['/']);
    };
    OrderConfirmationComponent.prototype.onPurchaseOrderChange = function () {
        this.cartService.updatePurchaseOrder(this.orderId, this.includePO)
            .then(function (po) {
            console.log("Purchase Order details : ", po);
        }, function (error) { });
    };
    OrderConfirmationComponent.prototype.onCreateBillingKeypress = function (event) {
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    };
    OrderConfirmationComponent.prototype.submitIBSOverrideCreateBilling = function () {
        var _this = this;
        this.loader.loading = true;
        this.cartService.submitIBSOverrideCreateBilling(this.orderId, this.order.sapOrderNo, this.authorizationNumber)
            .then(function (oc) {
            if ((oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) || oc.status == 500) {
                _this.createBillingFlag = false;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                _this.orderConfirmationFlag = false;
                if (oc.status == 500) {
                    var reader_5 = new FileReader();
                    reader_5.onload = function (e) {
                        var errorMessage = JSON.parse(reader_5.result).message;
                        _this.loader.loading = false;
                        if (errorMessage && errorMessage != undefined && errorMessage != null && errorMessage != "") {
                            _this.closeModal();
                            _this.notification.showNotification(errorMessage, notification_service_1.NotificationType.Error);
                        }
                        else {
                            _this.orderConfirmationMessage = "There were enough parts found to satisfy your request, however the customer has not been approved for billing at this time.";
                            jQuery("#orderConfirmationMessage").modal("show");
                        }
                    };
                    reader_5.readAsText(oc.blob());
                }
                else {
                    _this.loader.loading = false;
                    _this.notification.errorMessage("OrderConfirmationComponent", "downloadInvoice", "downloadInvoice", oc);
                }
            }
            else {
                _this.loader.loading = false;
                _this.createBillingFlag = true;
                _this.commonDataService.CreateBillingFlag = _this.createBillingFlag;
                console.log(oc);
                var mediaType = 'application/pdf';
                var blob = new Blob([oc._body], { type: mediaType });
                var filename = "Invoice_" + _this.order.sapOrderNo + ".pdf";
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
                _this.orderConfirmationMessage = "There were enough parts found to satisfy your Goods Movement and the customer has been approved for billing.";
                _this.orderConfirmationFlag = true;
                _this.closeModal();
                jQuery("#orderConfirmationMessage").modal("show");
            }
        }, function (error) { });
    };
    return OrderConfirmationComponent;
}());
OrderConfirmationComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/order-confirmation/order-confirmation.component.html?v=" + new Date().getTime(),
        providers: [cart_service_1.CartService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        router_1.ActivatedRoute,
        cart_service_1.CartService,
        platform_browser_1.Title,
        router_1.Router,
        http_1.Http,
        common_data_service_1.CommonDataService,
        notification_service_1.NotificationService,
        application_insights_service_1.ApplicationInsightsService])
], OrderConfirmationComponent);
exports.OrderConfirmationComponent = OrderConfirmationComponent;
//# sourceMappingURL=order-confirmation.component.js.map