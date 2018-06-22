"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var core_1 = require("@angular/core");
var CustomerFilterPipe = (function () {
    function CustomerFilterPipe() {
    }
    CustomerFilterPipe.prototype.transform = function (array, query) {
        if (query) {
            return _.filter(array, function (row) {
                return row.customerName.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.customerName2.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.customerNumber).toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.streetAddress.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.city.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.state.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.postalCode).toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.phoneNumber).toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.orderCount).indexOf(query.toLowerCase()) > -1 ||
                    row.accountManager.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.mscAccountNumber).toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        }
        return array;
    };
    return CustomerFilterPipe;
}());
CustomerFilterPipe = __decorate([
    core_1.Pipe({
        name: "customerFilter"
    })
], CustomerFilterPipe);
exports.CustomerFilterPipe = CustomerFilterPipe;
//# sourceMappingURL=customer-filter.pipe.js.map