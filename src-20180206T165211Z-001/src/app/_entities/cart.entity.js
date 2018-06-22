"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CartSearch = (function () {
    function CartSearch() {
        this.customerNumber = "";
        this.branchCode = "";
        this.userId = "";
        this.partSearchTerm = "";
        this.Carts = null;
        this.couponData = null;
    }
    return CartSearch;
}());
exports.CartSearch = CartSearch;
var Cart = (function () {
    function Cart() {
        this.cartId = "";
        this.cartName = "";
        this.userId = "";
        this.branchCode = "";
        this.customerNumber = "";
        this.pONumber = "";
        this.specialInstruction = "";
        this.deliveryPrice = 0;
        this.partNumber = "";
        this.description = "";
        this.customerPrice = 0;
        this.quantity = 0;
        this.corePrice = 0;
        this.corecorePartNumber = "";
        this.partId = "";
        this.listPrice = 0;
        this.vmrsCode = "";
        this.vmrsDescription = "";
        this.manufacturer = "";
        this.cateogory = "";
        this.adjustedPrice = 0;
        this.finalPrice = 0;
        this.extendedPrice = 0;
        this.priceOverrideReasonId = 0;
        this.isBuyout = false;
        this.coreOption = null;
        this.partBuyoutCoreOption = null;
        this.PartNumOnly = null;
        this.IsRTCDelivery = false;
        this.IsCustomerDelivery = false;
        this.IsFreight = false;
        this.TrackingParameters = "";
        this.binLocation = "";
        this.IsSTO = false;
        this.IsHotFlag = false;
        this.HotFlagCode = "";
        this.VendorCode = "";
        this.VendorBranchCode = "";
        this.PurchasePrice = 0;
        this.VendorName = "";
        this.QuantityAvailable = 0;
        this.isSpecialPricing = false;
        this.PONumber = "";
        this.SpecialInstruction = "";
        this.UnitNumber = "";
    }
    return Cart;
}());
exports.Cart = Cart;
var CouponData = (function () {
    function CouponData() {
    }
    return CouponData;
}());
exports.CouponData = CouponData;
var DeliveryType;
(function (DeliveryType) {
    DeliveryType[DeliveryType["Pickup"] = 0] = "Pickup";
    DeliveryType[DeliveryType["Delivery"] = 1] = "Delivery";
    DeliveryType[DeliveryType["ShipTo"] = 2] = "ShipTo";
})(DeliveryType = exports.DeliveryType || (exports.DeliveryType = {}));
//# sourceMappingURL=cart.entity.js.map