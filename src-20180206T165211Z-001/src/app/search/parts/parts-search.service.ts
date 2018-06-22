import { Injectable, EventEmitter} from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CustomerSearch, MscPayerSearch } from "./../../_entities/customer-search.entity";
import { PartSearch } from "./../../_entities/part-search.entity";
import { ExtendPart } from "./../../_entities/extend-part.entity";


@Injectable()
export class PartsSearchService {
    public notifyShowCreatePartModalEventEmitter: EventEmitter<any> = new EventEmitter();
    public notifyCreatePartSelectEventEmitter: EventEmitter<any> = new EventEmitter();
    constructor(private http: Http) { }


    getPartCount(searchData: PartSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/IsExists';
        return this.http.put(url, searchData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    createExtendedPart(extendPartData: ExtendPart): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = 'api/parts/CreateExtendPartResult';
        return this.http.put(url, extendPartData, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    public notifyShowCreateModal(data: any) {
        if (data) {
            this.notifyShowCreatePartModalEventEmitter.emit(data);
        }
    }

    public notifyCreatePartSelection(data: any) {
        if (data) {
            this.notifyCreatePartSelectEventEmitter.emit(data);
        }
    }

    getCustomers(customerSearch: CustomerSearch): Promise<any> {
        let url: string = `api/customers?customerId=${customerSearch.CustomerId}&customerType=${customerSearch.CustomerType}&customerNumber=${customerSearch.CustomerNumber}&customerName=${encodeURIComponent(customerSearch.CustomerName)}&phoneNumber=${customerSearch.PhoneNumber}&streetAddress=${customerSearch.StreetAddress}&city=${customerSearch.City}&state=${customerSearch.State}&postalCode=${customerSearch.PostalCode}&payerNumber=${customerSearch.PayerNumber}&accountManager=${customerSearch.AccountManager}&branchCode=${customerSearch.BranchCode}&userId=${customerSearch.UserId}`;
        if (customerSearch.AccountGroups != null) {
            for (let accountGroup of customerSearch.AccountGroups) {
                url += `&accountGroups=${accountGroup}`;
            }
        }
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getMscPayers(mscPayerSearch: MscPayerSearch): Promise<any> {
        let url: string = `api/customers/GetMscPayers?customerNumber=${mscPayerSearch.CustomerNumber}&branchCode=${mscPayerSearch.BranchCode}&salesOrganization=${mscPayerSearch.SalesOrganization}&includeShipTo=${mscPayerSearch.IncludeShipTo}`;
        if (mscPayerSearch.AccountGroups != null) {
            for (let accountGroup of mscPayerSearch.AccountGroups) {
                url += `&accountGroups=${accountGroup}`;
            }
        }
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

    private handleError(error: Response | any): any {
        let errMsg: string;
        if (error instanceof Response) {
            const body: any = error.json() || "";
            const err: any = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return Promise.reject(errMsg);
    }
}
