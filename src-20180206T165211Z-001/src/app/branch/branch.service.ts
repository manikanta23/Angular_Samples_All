import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";
import { CommonDataService } from "./../_common/services/common-data.service";
import { Branch, BranchInfo } from "./../_entities/branch.entity";

@Injectable()
export class BranchService {
    constructor(private http: Http, private commonDataService: CommonDataService
    ) { }

    GetUserBranchesForOrdering(filterKey: string): Promise<any> {

        let userId: string = this.commonDataService.UserId;
        let take: number = 500;
        let url: string = 'api/Branches/GetUserBranchesForOrdering?query=' + filterKey + '&userId=' + userId + '&take=' + take;

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
