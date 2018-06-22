"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppInsightPartBuyout = (function () {
    function AppInsightPartBuyout() {
        this.userId = "";
        this.customerNumber = "";
        this.customerName = "";
        this.branchNumber = "";
        this.cartNumber = "";
        this.partId = "";
        this.partNumber = "";
        this.vendor = null;
        this.isDefaultVendor = false;
        this.defaultVendorPartPurchasePrice = 0;
        this.defaultCustomerPartPurchasePrice = 0;
        this.defaultVendorCorePurchasePrice = 0;
        this.defaultCustomerCorePrice = 0;
        this.vendorPartPurchasePrice = 0;
        this.customerPartPurchasePrice = 0;
        this.vendorCorePurchasePrice = 0;
        this.customerCorePrice = 0;
        this.quantity = 0;
        this.quantityAvailable = 0;
        this.plMetricName = "";
    }
    return AppInsightPartBuyout;
}());
exports.AppInsightPartBuyout = AppInsightPartBuyout;
//# sourceMappingURL=app-insight-part-buyout.entity.js.map