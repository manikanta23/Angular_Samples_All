import { Injectable, EventEmitter } from "@angular/core";
import { Http, Response, RequestOptions, Headers, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/toPromise";

import { UserTypeEnum, EntityTypeEnum } from "./../_entities/enums";
import { User, Role, EntityRole } from "./../_entities/user.entity";
import { UserSearch } from "./../_entities/user-search.entity";

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    public UserDataUpdated: EventEmitter<any> = new EventEmitter();
    public UserListUpdated: EventEmitter<any> = new EventEmitter();

    getUser(userSearch: UserSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/${encodeURIComponent(userSearch.userId)}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getUsers(userSearch: UserSearch): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let userSearchParams = {
            userId: userSearch.userId ? userSearch.userId : '',
            userName: userSearch.userName ? userSearch.userName : '',
            userTypeId: userSearch.userTypeId ? userSearch.userTypeId.toString() : '',
            entityTypeId: userSearch.entityTypeId ? userSearch.entityTypeId.toString() : ''
        };
        let url: string = `api/users?${Object.keys(userSearchParams).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(userSearchParams[key]);
        }).join('&')}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    searchUsersInActiveDirectory(userName: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/SearchUsers?username=${userName}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    createUser(user: User, providerKey: string, roleIds: any): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = "api/user";
        let params = JSON.stringify({ "user": user, "providerKey": providerKey, "roleIds": roleIds });
        return this.http.post(url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    updateUser(user: User, providerKey: string, roleIds: any): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/${user.id}`;
        let params = JSON.stringify({ "user": user, "providerKey": providerKey, "roleIds": roleIds });
        return this.http.put(url, params, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getUserRoles(userId: string) {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        //let url: string = `api/user/${userId}/roles`;
        let url: string = `api/user/roles?userId=${userId}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    getUserBranchesForOverriding(userId: string) {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/userbranchesforoverriding?userId=${userId}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getUserEntityRoles(userId: string) {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        //let url: string = `api/user/${userId}/entityroles`;
        let url: string = `api/user/entityroles?userId=${userId}`;
        return this.http.get(url, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    syncUserWithSap(userId: string): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/${userId}/syncwithsap`;
        return this.http.post(url, null, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    
    SetUserIsPricingAlert(userId: string, IsPricingAlertEnabled: boolean): Promise<any> {
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });
        let url: string = `api/user/setuserispricingalert?userId=${userId}&isPricingAlertEnabled=${IsPricingAlertEnabled}`;
        return this.http.put(url, null, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    // TODO : put this in base service class, extend this service with base class
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

    // TODO : put this in base service class, extend this service with base class
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
