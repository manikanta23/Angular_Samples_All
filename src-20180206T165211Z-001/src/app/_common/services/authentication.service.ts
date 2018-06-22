import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { CommonDataService } from "./common-data.service";
import { Token } from "./../../_entities/token.entity";

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private commonDataService: CommonDataService) { }
    
    getToken(): Promise<any> {

        let API_TOKEN_URI = 'Token';
        let API_CONTENT_TYPE = 'application/json';
        let API_PROVIDER = 'Windows';
        let API_PROVIDERKEY = this.commonDataService.ProviderKey;
        let headers = new Headers({
            'Content-Type': API_CONTENT_TYPE
        });
        let options = new RequestOptions({
            headers: headers
        });
        let body = 'grant_type=external&provider=' + API_PROVIDER + '&providerkey=' + API_PROVIDERKEY;
        return this.http.post(API_TOKEN_URI, body, options)
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