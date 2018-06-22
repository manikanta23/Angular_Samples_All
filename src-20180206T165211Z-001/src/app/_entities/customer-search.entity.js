"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomerSearch = (function () {
    function CustomerSearch() {
        this.CustomerId = "";
        this.CustomerType = "";
        this.CustomerNumber = "";
        this.CustomerName = "";
        this.PhoneNumber = "";
        this.StreetAddress = "";
        this.City = "";
        this.State = "";
        this.PostalCode = "";
        this.PayerNumber = "";
        this.AccountManager = "";
        this.AccountGroups = null;
        this.BranchCode = "";
        this.UserId = "";
    }
    return CustomerSearch;
}());
exports.CustomerSearch = CustomerSearch;
var MscPayerSearch = (function () {
    function MscPayerSearch() {
        this.CustomerNumber = "";
        this.AccountGroups = null;
        this.BranchCode = "";
        this.SalesOrganization = "1000";
        this.IncludeShipTo = true;
    }
    return MscPayerSearch;
}());
exports.MscPayerSearch = MscPayerSearch;
var MscPayer = (function () {
    function MscPayer() {
        this.mscCardNumber = "";
        this.payers = null;
        this.shipTos = null;
    }
    return MscPayer;
}());
exports.MscPayer = MscPayer;
var Payer = (function () {
    function Payer() {
    }
    return Payer;
}());
exports.Payer = Payer;
var ShipTo = (function () {
    function ShipTo() {
    }
    return ShipTo;
}());
exports.ShipTo = ShipTo;
//# sourceMappingURL=customer-search.entity.js.map