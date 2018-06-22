export class CartSearch {
    customerNumber: string = "";
    branchCode: string = "";
    userId: string = "";
    partSearchTerm: string = "";
    Carts: Cart[] = null;
    couponData: CouponData = null;
}

export class Cart {
    cartId: string = "";
    cartName: string = "";
    userId: string = "";
    branchCode: string = "";
    customerNumber: string = "";
    deliveryType: string;
    pONumber: string = "";
    specialInstruction: string = "";
    deliveryPrice: number = 0;
    partNumber: string = "";
    description: string = "";
    customerPrice: number = 0;
    quantity: number = 0;
    corePrice: number = 0;
    corecorePartNumber: string = "";
    partId: string = "";
    listPrice: number = 0;
    vmrsCode: string = "";
    vmrsDescription: string = "";
    manufacturer: string = "";
    cateogory: string = "";
    adjustedPrice: number = 0;
    finalPrice: number = 0;
    extendedPrice: number = 0;
    priceOverrideReasonId: number = 0;
    isBuyout: boolean = false;
    coreOption: string = null;
    partBuyoutCoreOption: string = null;
    PartNumOnly: string = null;
    IsRTCDelivery: boolean = false;
    IsCustomerDelivery: boolean = false;
    IsFreight: boolean = false;
    TrackingParameters: any = "";
    binLocation: string = "";
    IsSTO: boolean = false;
    IsHotFlag: boolean = false;
    HotFlagCode: string = "";
    VendorCode: string = "";
    VendorBranchCode: string = "";
    PurchasePrice: number = 0;
    VendorName: string = "";
    QuantityAvailable: number = 0;
    unitNumber: string;
    isSpecialPricing: boolean = false;
    PONumber: string = "";
    SpecialInstruction: string = "";
    UnitNumber : string = "";
}

export class CouponData {
    //was guid check
    CouponId: string;
    CouponCode: string;
    CustomerSegmentId: string;
}

export enum DeliveryType {
    Pickup,
    Delivery,
    ShipTo,
}