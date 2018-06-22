import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { FavouriteCustomer } from "./../../../_entities/favourite-customer.entity";

@Injectable()
export class VendorsService {
    public notifyShowVendorModalEventEmitter: EventEmitter<any> = new EventEmitter();
    public notifyVendorSelectEventEmitter: EventEmitter<any> = new EventEmitter();
    public notifyFavouriteVendorChangeEventEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: Http,
        private commonDataService: CommonDataService) { }

    public notifyShowVendorModal(data: any) {
        if (data) {
            this.notifyShowVendorModalEventEmitter.emit(data);
        }
    }

    public notifyVendorSelection(data: any) {
        if (data) {
            this.notifyVendorSelectEventEmitter.emit(data);
        }
    }

    public notifyFavouriteVendorChange(data: any) {
        if (data) {
            this.notifyFavouriteVendorChangeEventEmitter.emit(data);
        }
    }

    getVendors(number: string, name: string, name2: string, address: string, city: string, state: string, zipCode: string, phone: string): Promise<any> {
        let userId: string = this.commonDataService.UserId;
        let branchCode: string = this.commonDataService.Branch.code;
        let url: string = `api/vendors/getVendors?userId=${userId}&number=${number}&name=${name}&name2=${name2}&address=${address}&city=${city}&state=${state}&zipCode=${zipCode}&phone=${phone}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getFavouriteVendors(): Promise<any> {
        let userId: string = this.commonDataService.UserId;
        let branchCode: string = this.commonDataService.Branch.code;
        let url: string = `api/vendors/getFavouriteVendors?userId=${userId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    createFavouriteVendors(number: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let userId: string = this.commonDataService.UserId;
        return this.http.put(`api/vendors/createFavouriteVendors?userId=${userId}&number=${number}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteFavouriteVendors(number: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let userId: string = this.commonDataService.UserId;
        return this.http.delete(`api/vendors/deleteFavouriteVendors?userId=${userId}&number=${number}`, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getVendorPrice(vendorCode: string, corePartNumber: string, hasCore: boolean, partNumber: string): Promise<any> {
        let branchCode: string = this.commonDataService.Branch.code;
        let url: string = `api/vendors/getVendorPrice?vendorCode=${vendorCode}&branchCode=${branchCode}&corePartNumber=${corePartNumber}&hasCore=${hasCore}&partNumber=${partNumber}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getPartVendorPrice(PartVendorPriceRequest: any): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        
        let url: string = 'api/vendors/getVendorPrice';
        return this.http.put(url, PartVendorPriceRequest, options)
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
