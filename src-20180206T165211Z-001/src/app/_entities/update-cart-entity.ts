
export class UpdateCart {
    cartItemId: string;
    cartId: string;
    price: number;
    quantity: number;
    corePrice: number;
    coreOption: string;
    partBuyoutCoreOption: string;
    deliveryType: string = null;
    unitNumber: string;
    couponData: CouponData;
}

export class CouponData {
    //was guid check
    CouponId: string;
    CouponCode: string;
    CustomerSegmentId: string;
}