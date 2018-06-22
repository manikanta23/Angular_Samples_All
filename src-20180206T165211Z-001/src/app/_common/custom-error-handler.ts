import { ErrorHandler } from "@angular/core";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import { AppInsightsService, SeverityLevel } from 'ng2-appinsights';
import { CommonDataService } from "./services/common-data.service";
import { LoaderService } from "./services/loader.service";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    constructor(
        private http: Http,
        private appinsightsService: AppInsightsService,
        private commonDataService: CommonDataService,
        private loader: LoaderService
    ) { }

    handleError(error: any): void {
        this.appinsightsService.trackException(error, "CustomErrorHandler", { "applicaion_Version": this.commonDataService.AppVersion });
        let hasRejection = error.rejection !== undefined && error.rejection !== null;
        let myError = {
            message: error.message,
            originalStack: error.originalStack,
            rejectionMessageId: hasRejection ? error.rejection.messageId : '',
            rejectionMessage: hasRejection ? error.rejection.message : '',
            stack: error.stack
        };
        console.log("Custom Error Handler : ", myError);
        this.loader.loading = false;
    }
}