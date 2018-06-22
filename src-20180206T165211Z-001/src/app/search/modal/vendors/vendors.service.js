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
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var VendorsService = (function () {
    function VendorsService(http, commonDataService) {
        this.http = http;
        this.commonDataService = commonDataService;
        this.notifyShowVendorModalEventEmitter = new core_1.EventEmitter();
        this.notifyVendorSelectEventEmitter = new core_1.EventEmitter();
        this.notifyFavouriteVendorChangeEventEmitter = new core_1.EventEmitter();
    }
    VendorsService.prototype.notifyShowVendorModal = function (data) {
        if (data) {
            this.notifyShowVendorModalEventEmitter.emit(data);
        }
    };
    VendorsService.prototype.notifyVendorSelection = function (data) {
        if (data) {
            this.notifyVendorSelectEventEmitter.emit(data);
        }
    };
    VendorsService.prototype.notifyFavouriteVendorChange = function (data) {
        if (data) {
            this.notifyFavouriteVendorChangeEventEmitter.emit(data);
        }
    };
    VendorsService.prototype.getVendors = function (number, name, name2, address, city, state, zipCode, phone) {
        var userId = this.commonDataService.UserId;
        var branchCode = this.commonDataService.Branch.code;
        var url = "api/vendors/getVendors?userId=" + userId + "&number=" + number + "&name=" + name + "&name2=" + name2 + "&address=" + address + "&city=" + city + "&state=" + state + "&zipCode=" + zipCode + "&phone=" + phone;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.getFavouriteVendors = function () {
        var userId = this.commonDataService.UserId;
        var branchCode = this.commonDataService.Branch.code;
        var url = "api/vendors/getFavouriteVendors?userId=" + userId;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.createFavouriteVendors = function (number) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var userId = this.commonDataService.UserId;
        return this.http.put("api/vendors/createFavouriteVendors?userId=" + userId + "&number=" + number, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.deleteFavouriteVendors = function (number) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var userId = this.commonDataService.UserId;
        return this.http.delete("api/vendors/deleteFavouriteVendors?userId=" + userId + "&number=" + number, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.getVendorPrice = function (vendorCode, corePartNumber, hasCore, partNumber) {
        var branchCode = this.commonDataService.Branch.code;
        var url = "api/vendors/getVendorPrice?vendorCode=" + vendorCode + "&branchCode=" + branchCode + "&corePartNumber=" + corePartNumber + "&hasCore=" + hasCore + "&partNumber=" + partNumber;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.getPartVendorPrice = function (PartVendorPriceRequest) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'api/vendors/getVendorPrice';
        return this.http.put(url, PartVendorPriceRequest, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    VendorsService.prototype.extractData = function (res) {
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
    VendorsService.prototype.handleError = function (error) {
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
    return VendorsService;
}());
VendorsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        common_data_service_1.CommonDataService])
], VendorsService);
exports.VendorsService = VendorsService;
//# sourceMappingURL=vendors.service.js.map