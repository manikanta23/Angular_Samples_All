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
var PartsSearchService = (function () {
    function PartsSearchService(http) {
        this.http = http;
        this.notifyShowCreatePartModalEventEmitter = new core_1.EventEmitter();
        this.notifyCreatePartSelectEventEmitter = new core_1.EventEmitter();
    }
    PartsSearchService.prototype.getPartCount = function (searchData) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'api/parts/IsExists';
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    PartsSearchService.prototype.createExtendedPart = function (extendPartData) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'api/parts/CreateExtendPartResult';
        return this.http.put(url, extendPartData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    PartsSearchService.prototype.notifyShowCreateModal = function (data) {
        if (data) {
            this.notifyShowCreatePartModalEventEmitter.emit(data);
        }
    };
    PartsSearchService.prototype.notifyCreatePartSelection = function (data) {
        if (data) {
            this.notifyCreatePartSelectEventEmitter.emit(data);
        }
    };
    PartsSearchService.prototype.getCustomers = function (customerSearch) {
        var url = "api/customers?customerId=" + customerSearch.CustomerId + "&customerType=" + customerSearch.CustomerType + "&customerNumber=" + customerSearch.CustomerNumber + "&customerName=" + encodeURIComponent(customerSearch.CustomerName) + "&phoneNumber=" + customerSearch.PhoneNumber + "&streetAddress=" + customerSearch.StreetAddress + "&city=" + customerSearch.City + "&state=" + customerSearch.State + "&postalCode=" + customerSearch.PostalCode + "&payerNumber=" + customerSearch.PayerNumber + "&accountManager=" + customerSearch.AccountManager + "&branchCode=" + customerSearch.BranchCode + "&userId=" + customerSearch.UserId;
        if (customerSearch.AccountGroups != null) {
            for (var _i = 0, _a = customerSearch.AccountGroups; _i < _a.length; _i++) {
                var accountGroup = _a[_i];
                url += "&accountGroups=" + accountGroup;
            }
        }
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    PartsSearchService.prototype.getMscPayers = function (mscPayerSearch) {
        var url = "api/customers/GetMscPayers?customerNumber=" + mscPayerSearch.CustomerNumber + "&branchCode=" + mscPayerSearch.BranchCode + "&salesOrganization=" + mscPayerSearch.SalesOrganization + "&includeShipTo=" + mscPayerSearch.IncludeShipTo;
        if (mscPayerSearch.AccountGroups != null) {
            for (var _i = 0, _a = mscPayerSearch.AccountGroups; _i < _a.length; _i++) {
                var accountGroup = _a[_i];
                url += "&accountGroups=" + accountGroup;
            }
        }
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    PartsSearchService.prototype.extractData = function (res) {
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
    PartsSearchService.prototype.handleError = function (error) {
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
    return PartsSearchService;
}());
PartsSearchService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PartsSearchService);
exports.PartsSearchService = PartsSearchService;
//# sourceMappingURL=parts-search.service.js.map