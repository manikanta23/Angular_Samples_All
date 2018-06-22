import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { FavouriteCustomer } from "./../../../_entities/favourite-customer.entity";

@Injectable()
export class FavouritesService {
    constructor(
        private http: Http,
        private commonDataService: CommonDataService) { }

    getFavourites(): Promise<any> {

        let userId: string = this.commonDataService.UserId;
        let branchCode: string = this.commonDataService.Branch.code;

        let url: string = `api/FavouriteCustomers?userId=${userId}&branchCode=${branchCode}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    CreateFavourites(favouriteCustomer: FavouriteCustomer): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put("api/FavouriteCustomers/Create", favouriteCustomer, options)
            .toPromise()
            .then(response => {
                this.commonDataService.favouriteUpdateEventEmitter.emit(true); return response.json() || {};
            })
            .catch(this.handleError);
    }

    DeleteFavourites(customerNumber: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(`api/FavouriteCustomers/Delete?userId=${this.commonDataService.UserId}&customerNumber=${customerNumber}`, options)
            .toPromise()
            .then(response => {
                this.commonDataService.favouriteUpdateEventEmitter.emit(true); return response.json() || {};
            })
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
