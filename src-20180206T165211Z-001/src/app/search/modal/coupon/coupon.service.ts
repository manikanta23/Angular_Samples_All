import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../../../_common/services/common-data.service";


@Injectable()
export class CouponService {
    constructor(
        private http: Http,
        private commonDataService: CommonDataService) { }

    getCoupons(couponNumber: string, userId: string, customerNumber: string, branchCode: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url = `api/carts/GetCoupons?couponNumber=` + ((couponNumber == null) ? "" : `${couponNumber}`)
            + `&userId=${userId}&customerNumber=` + ((customerNumber == null) ? "" : `${customerNumber}`)+`&branchCode=${branchCode}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    createCouponRedemption(couponId: string, customerSegmentId?: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url = `api/carts/CreateCouponRedemption?couponId=${couponId}&&cartId=${this.commonDataService.CartId}` +
            ((customerSegmentId == null) ? "" : `&&customerSegmentId=${customerSegmentId}`);
        return this.http.put(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    addCouponToCart(couponRequestObject: any): Promise<any>    {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.put(`api/Carts/AddCouponToCart`, couponRequestObject, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getCouponVendors(couponId: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/carts/GetCouponVendors?couponId=${couponId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
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