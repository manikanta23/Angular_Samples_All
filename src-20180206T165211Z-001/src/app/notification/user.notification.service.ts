import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import "rxjs/add/operator/toPromise";

@Injectable()
export class UserNotificationService {
    constructor(
        private http: Http) { }

    getUserSalesMetrics(notificationId: string, userId: string, branchCode: string): Promise<any> {

        let url: string = `api/Notifications/GetUserSalesMetrics?notificationId=${notificationId}&userId=${userId}&branchCode=${branchCode}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    getNotifications(userId: string): Promise<any> {

        let url: string = `api/Notifications/GetNotifications?userId=${userId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    markNotification(notificationId:string, userId: string): Promise<any> {

        let url: string = `api/Notifications/MarkNotification?notificationId=${notificationId}&userId=${userId}`;
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    markAllNotification(userId: string): Promise<any> {

        let url: string = `api/Notifications/MarkAllNotification?userId=${userId}`;
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
