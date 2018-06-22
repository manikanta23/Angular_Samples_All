import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, RequestOptions, ResponseContentType, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CartSearch, Cart } from "./../_entities/cart.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { UpdateCart } from "./../_entities/update-cart-entity";

@Injectable()
export class CartService {
    constructor(private http: Http, private commonDataService: CommonDataService) { }

    public notifyCartChangeEventEmitter: EventEmitter<any> = new EventEmitter();

    getHotFlags(): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/HotFlags';
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getCarts(searchData: CartSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        searchData.couponData = this.commonDataService.Coupons;
        let url: string = 'api/carts/GetCartData';
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addToCart(addtoCartParameters): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        addtoCartParameters.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/Carts/AddToCart`, addtoCartParameters, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    DeleteCartItem(deleteCartItem): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        deleteCartItem.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/carts/DeleteItem`, deleteCartItem, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }
    SetDelivery(cartId: string, flag: number): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`api/carts/SetDelivery?cartId=${cartId}&flag=${flag}`, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    UpdateForAdjustedPrice(adjustedPriceParameters): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        adjustedPriceParameters.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/carts/UpdateForAdjustedPrice`, adjustedPriceParameters, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    DeleteCart(): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`api/carts/Delete?userId=${this.commonDataService.UserId}&&customerNumber=${this.commonDataService.Customer.customerNumber}&&branchCode=${this.commonDataService.Branch.code}`, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    UpdateCartItem(updateCartItemParameters: UpdateCart): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        updateCartItemParameters.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/carts/Update`, updateCartItemParameters, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    updateAdditionalCartInfo(cartId: string, name1: string, name2: string, salesPerson: string, mSC: string, address: string, city: string, state: string, zip: string, phone: string, billingType: string, storeShipTOAddressNO: string, storeBilliTOAddressNO: string, IsAlternateAddressEdited: boolean): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        //let updateCartItemParameters = { unitNumber: unitNumber, cartId: cartId };
        return this.http.put(`api/carts/updateAdditionalCartInfo?cartId=${cartId}&name1=${name1}&name2=${name2}&salesPerson=${salesPerson}&mSC=${mSC}&address=${address}&city=${city}&state=${state}&zip=${zip}&phone=${phone}&billingType=${billingType}&storeShipTOAddressNO=${storeShipTOAddressNO}&storeBilliTOAddressNO=${storeBilliTOAddressNO}&IsAlternateAddressEdited=${IsAlternateAddressEdited}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    updateUnitNOPOSI(unitNumber: string, poNumber: string, specialInstruction: string, cartId: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        //let updateCartItemParameters = { unitNumber: unitNumber, cartId: cartId };
        return this.http.put(`api/carts/updateUnitNOPOSI?unitNumber=${unitNumber}&poNumber=${poNumber}&specialInstruction=${specialInstruction}&cartId=${cartId}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    UpdateCartItemFlag(cartItemflagRequest, isDataChangedFromModal: boolean): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        cartItemflagRequest.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/carts/UpdateCartItemFlag`, cartItemflagRequest, options)
            .toPromise()
            .then(response => {
                console.log("isHotFlagChangedFromModal : " + isDataChangedFromModal);
                if (isDataChangedFromModal)
                    this.notifyCartChangeEventEmitter.emit(response.json());
                return response.json() || {};
            })
            .catch(this.handleError);
    }

    UpdateCartItemformycart(updateCartItemParameters: UpdateCart): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        updateCartItemParameters.couponData = this.commonDataService.Coupons;
        return this.http.put(`api/carts/Update`, updateCartItemParameters,options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    UpdateCartFreightAndDelivery(cartId: string, cartItemId: string, adjustedPrice: number): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`api/carts/UpdateFreightAndDelivery?cartId=${cartId}&cartItemId=${cartItemId}&adjustedPrice=${adjustedPrice}`, options)
            .toPromise()
            .then(response => {
                this.notifyCartChangeEventEmitter.emit(response.json()); return response.json() || {};
            })
            .catch(this.handleError);
    }

    CartCount(customerNumber: string, branchCode: string, userId: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`api/carts/CartCount?customerNumber=${customerNumber}&branchCode=${branchCode}&userId=${userId}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    CheckDefaultBranchValue(branchCode: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(`api/carts/CheckDefaultBranchValue?branchCode=${branchCode}`,options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    placeOrder(orderParameters): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`api/Orders/PlaceOrder`, orderParameters, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getOrderConfirmationResult(orderId: string): Promise<any> {
        let url: string = `api/orders/GetOrderConfirmation?orderId=${orderId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    downloadInvoice(orderId: string): Promise<any> {
        let url: string = `api/orders/DownloadGmInvoicePdfFile?orderId=${orderId}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }
    downloadPurchaseOrder(orderId: string): Promise<any> {
        let url: string = `api/orders/DownloadPurchaseOrder?orderId=${orderId}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }


    submitIBSOverrideCreateBilling(orderId: string, orderNumber: string, authorizationNumber: string): Promise<any> {
        let url: string = `api/orders/UpdateOrderValues?orderId=${orderId}&orderNumber=${orderNumber}&authorizationNumber=${authorizationNumber}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }

    getPickTicket(orderId: string): Promise<any> {
        let url: string = `api/orders/GetPickTicket?orderId=${orderId}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }

    printSAPQuote(orderId: string, isPrintQuote: boolean): Promise<any> {
        let url: string = `api/orders/PrintSAPQuote?orderId=${orderId}&isPrintQuote=${isPrintQuote}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }

    downloadSapShortcut(sapOrderNo: string): Promise<any> {
        let url: string = `api/orders/GetSapOrderLink?sapOrderNo=${sapOrderNo}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }
    updatePurchaseOrder(orderId: string, flag: boolean): Promise<any> {
        let url: string = `api/orders/UpdatePurchaseOrder?orderId=${orderId}&flag=${flag}`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .toPromise()
            .then(this.extractData1)
            .catch(this.handleError);
    }

    getOpenCarts(userId: string): Promise<any> {
        let url: string = `api/carts/GetOpenCarts?userId=`+((userId == null) ? "" : `${userId}`);
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData1(res: any): any {
        return res;
    }

    private extractData(res: any): any {
        if (res.ErrorType != undefined && res.ErrorType != 200) {
            return res;
        }
        if (res != undefined && res != null) {
            return res.json() || {};
        }
        else {
            return {};
        }
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || "";
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Promise.reject(errMsg);
    }
}


