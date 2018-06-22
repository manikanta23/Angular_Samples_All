import { Injectable, OnDestroy, Injector } from "@angular/core";
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { CommonDataService } from "./common-data.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Token } from "./../../_entities/token.entity";

import { ErrorInformation } from "./../../_entities/error-information.entity";
import { ApplicationInsightsService } from "./application-insights.service";

@Injectable()
export class HttpService extends Http {

    private subscription: any;

    constructor(backend: XHRBackend, options: RequestOptions, private commonDataService: CommonDataService, private injector: Injector) {
        super(backend, options);
        let token = commonDataService.AuthToken;
        options.headers.set("Authorization", `Bearer ${token}`);
    }

    //this creates router property on your service.
    public get router(): Router {
        return this.injector.get(Router);
    }

    //this creates router property on your service.
    public get applicationInsightsService(): ApplicationInsightsService {
        return this.injector.get(ApplicationInsightsService);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        let token: any;
        if (this.commonDataService.AuthToken != null && this.commonDataService.AuthToken.access_token) {
            token = this.commonDataService.AuthToken.access_token;
        }
        if (typeof url === "string") {
            if (!options) {
                options = { headers: new Headers() };
            }
            if (url.indexOf("Token") === -1) {
                options.headers.set("Authorization", `Bearer ${token}`);
                options.headers.set("Access-Control-Allow-Methods", ["POST", "PUT", "GET", "DELETE"]);
                options.headers.set("Access-Control-Allow-Headers", ["accept", "authorization", "content-type"]);
                options.headers.set("Access-Control-Allow-Origin", "*");
            }
            url = this.commonDataService.API_URL + url;
        } else {
            if (url.url.indexOf("Token") === -1) {
                url.headers.set("Authorization", `Bearer ${token}`);
                url.headers.set("Access-Control-Allow-Methods", ["POST", "PUT", "GET", "DELETE"]);
                url.headers.set("Access-Control-Allow-Headers", ["accept", "authorization", "content-type"]);
                url.headers.set("Access-Control-Allow-Origin", "*");
            }

            url.url = this.commonDataService.API_URL + url.url;
        }
        return super.request(url, options).catch(this.catchAuthError(this, url));
    }

    private checkToken() {
        console.log("http service return url : " + window.location.href);
        let returnUrl: string = window.location.href;
        let token: any;
        if (this.commonDataService.AuthToken != null && this.commonDataService.AuthToken.access_token) {
            let tokenObject: Token = this.commonDataService.AuthToken;
            let currentDateTime = new Date().getTime();
            let expiryDateTime = this.commonDataService.AuthToken.expiry_datetime;
            console.log("Token : currentDateTime : " + new Date(currentDateTime) + "\t expiryDateTime  : " + new Date(expiryDateTime));
            if (!tokenObject || !tokenObject.expires_in || expiryDateTime < currentDateTime) {
                this.router.navigateByUrl("/login");
                return null;
            }
            else {
                return tokenObject.access_token;
            }
        }
        else {
            this.router.navigateByUrl("/login?returnUrl=" + returnUrl);
        }
    }

    private catchAuthError(self: HttpService, url: any) {
        return (res: Response) => {
            // following condition is to handle the error response containing the blob object with error message.
            if (res.status == 500 && (res.url.indexOf("DownloadGmInvoicePdfFile") > 0 || res.url.indexOf("GetPickTicket") > 0 || res.url.indexOf("GetPrintTicket") > 0 || res.url.indexOf("UpdateOrderValues") > 0 || res.url.indexOf("DownloadPurchaseOrder") > 0)) {
                return Observable.of(res);
            }
            else {
                let body: any = null;
                let requestUrl: string = "";
                let requestParameter: string = "";
                let errorObj: any = null;

                if (res.json()) {
                    body = res.json();
                }
                let errInfo: ErrorInformation = Object.assign(new ErrorInformation(), {
                    Message: body != null && body.message != undefined && body.message != null ? body.message : "",
                    ErrorType: res.status
                });

                if (typeof url === "string") {
                    requestUrl = url;
                }
                else {
                    requestUrl = url.url;
                    requestParameter = url._body;
                }

                errorObj = new Error(JSON.stringify({ Message: errInfo.Message, Type: errInfo.ErrorType, url: requestUrl, Paramters: requestParameter }));
                this.applicationInsightsService.trackException(errorObj, "Http service");

                console.log("URL : " + res.url + "Response Type : " + res.status);
                if (res.status === 401) {
                    return this.unauthorised(errInfo);

                } else if (res.status === 403) {
                    return this.forbidden(errInfo);
                } else {
                    return Observable.of(errInfo);
                }
            }
        };
    }

    unauthorised(errInfo: ErrorInformation): Observable<any> {
        console.log("http service return URL : " + this.router.url);
        this.router.navigateByUrl("/login?returnUrl=" + encodeURIComponent(this.router.url));
        return Observable.of(errInfo);
    }

    forbidden(errInfo: ErrorInformation): Observable<any> {
        this.router.navigate(['/']);
        return Observable.of(errInfo);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}