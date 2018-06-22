import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, RequestOptions, ResponseContentType, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../_common/services/common-data.service";

@Injectable()
export class CouponDashboardService {
    constructor(private http: Http, private commonDataService: CommonDataService) { }
    public notifyCartChangeEventEmitter: EventEmitter<any> = new EventEmitter();

    importCouponJsonFile(formData: any): Promise<any> {

        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        
        let apiUrl = `api/coupon/ImportCouponJsonFile?userId=${this.commonDataService.UserId}`;
        return this.http.post(apiUrl, formData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }  

    getCouponFileImportsSummary(): Promise<any> {

        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });

        let apiUrl = `api/coupon/GetCouponFileImportsSummary?userId=${this.commonDataService.UserId}`;
        return this.http.get(apiUrl, options)
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

    getCouponsforCouponManagement(): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/coupon/GetCouponsforCouponManagement';
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }   
}


