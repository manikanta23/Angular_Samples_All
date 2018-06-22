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
var NationalInventoryService = (function () {
    function NationalInventoryService(http, commonDataService) {
        this.http = http;
        this.commonDataService = commonDataService;
    }
    NationalInventoryService.prototype.getInventory = function (partId, partNumber, branchCode, customerNumber) {
        var url = "api/parts/GetNationalInventory?partId=" + partId + "&partNumber=" + partNumber + "&branchCode=" + branchCode + "&customerNumber=" + customerNumber;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    NationalInventoryService.prototype.getInventoryResponse = function (GetInventoryRequest) {
        var headers = new http_1.Headers({ "Content-Type": "application/json" });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = 'api/parts/GetNationalInventory';
        return this.http.put(url, GetInventoryRequest, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    NationalInventoryService.prototype.extractData = function (res) {
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
    NationalInventoryService.prototype.handleError = function (error) {
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
    return NationalInventoryService;
}());
NationalInventoryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        common_data_service_1.CommonDataService])
], NationalInventoryService);
exports.NationalInventoryService = NationalInventoryService;
//# sourceMappingURL=national-inventory.service.js.map