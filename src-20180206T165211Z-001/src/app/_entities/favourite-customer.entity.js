"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Customer_entity_1 = require("./Customer.entity");
var FavouriteCustomer = (function (_super) {
    __extends(FavouriteCustomer, _super);
    function FavouriteCustomer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Id = "";
        _this.TruckNumber = "";
        return _this;
    }
    return FavouriteCustomer;
}(Customer_entity_1.Customer));
exports.FavouriteCustomer = FavouriteCustomer;
//# sourceMappingURL=favourite-customer.entity.js.map