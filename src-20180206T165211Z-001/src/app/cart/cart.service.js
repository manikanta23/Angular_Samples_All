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
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var common_data_service_1 = require("./../_common/services/common-data.service");
var CartService = (function () {
    function CartService(http, commonDataService) {
        this.http = http;
        this.commonDataService = commonDataService;
        this.notifyCartChangeEventEmitter = new core_1.EventEmitter();
    }
    CartService.prototype.getHotFlags = function () {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'api/parts/HotFlags';
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.getCarts = function (searchData) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        searchData.couponData = this.commonDataService.Coupons;
        var url = 'api/carts/GetCartData';
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.addToCart = function (addtoCartParameters) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        addtoCartParameters.couponData = this.commonDataService.Coupons;
        return this.http.put("api/Carts/AddToCart", addtoCartParameters, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.DeleteCartItem = function (deleteCartItem) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        deleteCartItem.couponData = this.commonDataService.Coupons;
        return this.http.put("api/carts/DeleteItem", deleteCartItem, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.SetDelivery = function (cartId, flag) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/carts/SetDelivery?cartId=" + cartId + "&flag=" + flag, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.UpdateForAdjustedPrice = function (adjustedPriceParameters) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        adjustedPriceParameters.couponData = this.commonDataService.Coupons;
        return this.http.put("api/carts/UpdateForAdjustedPrice", adjustedPriceParameters, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.DeleteCart = function () {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/carts/Delete?userId=" + this.commonDataService.UserId + "&&customerNumber=" + this.commonDataService.Customer.customerNumber + "&&branchCode=" + this.commonDataService.Branch.code, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.UpdateCartItem = function (updateCartItemParameters) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        updateCartItemParameters.couponData = this.commonDataService.Coupons;
        return this.http.put("api/carts/Update", updateCartItemParameters, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.updateAdditionalCartInfo = function (cartId, name1, name2, salesPerson, mSC, address, city, state, zip, phone, billingType, storeShipTOAddressNO, storeBilliTOAddressNO, IsAlternateAddressEdited) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        //let updateCartItemParameters = { unitNumber: unitNumber, cartId: cartId };
        return this.http.put("api/carts/updateAdditionalCartInfo?cartId=" + cartId + "&name1=" + name1 + "&name2=" + name2 + "&salesPerson=" + salesPerson + "&mSC=" + mSC + "&address=" + address + "&city=" + city + "&state=" + state + "&zip=" + zip + "&phone=" + phone + "&billingType=" + billingType + "&storeShipTOAddressNO=" + storeShipTOAddressNO + "&storeBilliTOAddressNO=" + storeBilliTOAddressNO + "&IsAlternateAddressEdited=" + IsAlternateAddressEdited, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.updateUnitNOPOSI = function (unitNumber, poNumber, specialInstruction, cartId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        //let updateCartItemParameters = { unitNumber: unitNumber, cartId: cartId };
        return this.http.put("api/carts/updateUnitNOPOSI?unitNumber=" + unitNumber + "&poNumber=" + poNumber + "&specialInstruction=" + specialInstruction + "&cartId=" + cartId, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.UpdateCartItemFlag = function (cartItemflagRequest, isDataChangedFromModal) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        cartItemflagRequest.couponData = this.commonDataService.Coupons;
        return this.http.put("api/carts/UpdateCartItemFlag", cartItemflagRequest, options)
            .toPromise()
            .then(function (response) {
            console.log("isHotFlagChangedFromModal : " + isDataChangedFromModal);
            if (isDataChangedFromModal)
                _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.UpdateCartItemformycart = function (updateCartItemParameters) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        updateCartItemParameters.couponData = this.commonDataService.Coupons;
        return this.http.put("api/carts/Update", updateCartItemParameters, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.UpdateCartFreightAndDelivery = function (cartId, cartItemId, adjustedPrice) {
        var _this = this;
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/carts/UpdateFreightAndDelivery?cartId=" + cartId + "&cartItemId=" + cartItemId + "&adjustedPrice=" + adjustedPrice, options)
            .toPromise()
            .then(function (response) {
            _this.notifyCartChangeEventEmitter.emit(response.json());
            return response.json() || {};
        })
            .catch(this.handleError);
    };
    CartService.prototype.CartCount = function (customerNumber, branchCode, userId) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/carts/CartCount?customerNumber=" + customerNumber + "&branchCode=" + branchCode + "&userId=" + userId, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.CheckDefaultBranchValue = function (branchCode) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/carts/CheckDefaultBranchValue?branchCode=" + branchCode, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.placeOrder = function (orderParameters) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put("api/Orders/PlaceOrder", orderParameters, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.getOrderConfirmationResult = function (orderId) {
        var url = "api/orders/GetOrderConfirmation?orderId=" + orderId;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.downloadInvoice = function (orderId) {
        var url = "api/orders/DownloadGmInvoicePdfFile?orderId=" + orderId;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.downloadPurchaseOrder = function (orderId) {
        var url = "api/orders/DownloadPurchaseOrder?orderId=" + orderId;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.submitIBSOverrideCreateBilling = function (orderId, orderNumber, authorizationNumber) {
        var url = "api/orders/UpdateOrderValues?orderId=" + orderId + "&orderNumber=" + orderNumber + "&authorizationNumber=" + authorizationNumber;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.getPickTicket = function (orderId) {
        var url = "api/orders/GetPickTicket?orderId=" + orderId;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.printSAPQuote = function (orderId, isPrintQuote) {
        var url = "api/orders/PrintSAPQuote?orderId=" + orderId + "&isPrintQuote=" + isPrintQuote;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.downloadSapShortcut = function (sapOrderNo) {
        var url = "api/orders/GetSapOrderLink?sapOrderNo=" + sapOrderNo;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.updatePurchaseOrder = function (orderId, flag) {
        var url = "api/orders/UpdatePurchaseOrder?orderId=" + orderId + "&flag=" + flag;
        return this.http.get(url, { responseType: http_1.ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    };
    CartService.prototype.getOpenCarts = function (userId) {
        var url = "api/carts/GetOpenCarts?userId=" + ((userId == null) ? "" : "" + userId);
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CartService.prototype.extractData1 = function (res) {
        return res;
    };
    CartService.prototype.extractData = function (res) {
        if (res.ErrorType != undefined && res.ErrorType != 200) {
            return res;
        }
        if (res != undefined && res != null) {
            return res.json() || {};
        }
        else {
            return {};
        }
    };
    CartService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || "";
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || "") + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Promise.reject(errMsg);
    };
    return CartService;
}());
CartService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, common_data_service_1.CommonDataService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map