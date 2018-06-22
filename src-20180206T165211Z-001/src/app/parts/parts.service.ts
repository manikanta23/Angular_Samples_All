import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { PartSearch } from "./../_entities/part-search.entity";
import { CommonDataService } from "../_common/services/common-data.service";

@Injectable()
export class PartsService {
    constructor(
        private http: Http,
        private commonDataService:CommonDataService
    ) { }

    getParts(searchData: PartSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/GetPartData';
        let coupons: any = this.commonDataService.Coupons;
        if (coupons != undefined && coupons != null) {
            searchData.couponId = coupons.couponId;
            searchData.couponCode = coupons.couponCode;
        }

        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getRelatedParts(searchData: PartSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/GetRelatedParts';
        let coupons: any = this.commonDataService.Coupons;
        if (coupons != undefined && coupons != null) {
            searchData.couponId = coupons.couponId;
            searchData.couponCode = coupons.couponCode;
        }
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getAlternateParts(searchData: PartSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/GetAlternateParts';
        let coupons: any = this.commonDataService.Coupons;
        if (coupons != undefined && coupons != null) {
            searchData.couponId = coupons.couponId;
            searchData.couponCode = coupons.couponCode;
        }
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getMscPriceVerification(mscPriceVerifyData: any): Promise<any> {
        console.log("mscPriceVerifyData.mscPriceVerifyParts: ", mscPriceVerifyData.mscPriceVerifyParts);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/parts/GetMscPriceVerification`;

        return this.http.put(url, mscPriceVerifyData, options)
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
