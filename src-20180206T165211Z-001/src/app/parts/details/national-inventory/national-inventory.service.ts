import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { NationalInventory } from "./../../../_entities/national-inventory.entity";

@Injectable()
export class NationalInventoryService {
    constructor(
        private http: Http,
        private commonDataService: CommonDataService) { }

    getInventory(partId: string, partNumber: string, branchCode: string, customerNumber: string): Promise<any> {

        let url: string = `api/parts/GetNationalInventory?partId=${partId}&partNumber=${partNumber}&branchCode=${branchCode}&customerNumber=${customerNumber}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getInventoryResponse(GetInventoryRequest: any): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        let url: string = 'api/parts/GetNationalInventory';
        return this.http.put(url, GetInventoryRequest, options)
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
