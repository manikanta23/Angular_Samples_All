import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FeedbackService } from "./feedback.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonDataService } from "./../_common/services/common-data.service";
import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { FeedbackInput } from "./../_entities/feedback.entity";
import * as _ from "lodash";
import { Location } from '@angular/common';

@Component({
    templateUrl: `./src/app/feedback/feedback.component.html?v=${new Date().getTime()}`
})
    
export class FeedbackComponent implements OnInit, OnDestroy {

    feedbackinput: FeedbackInput = new FeedbackInput();
    feedbackData: any;
    feedbackmessage: any;
    referencenumber: any;
    constructor(private loader: LoaderService,
        private activatedRoute: ActivatedRoute,
        private feedbackService: FeedbackService,
        private title: Title,
        private router: Router,
        private location: Location,
        private changeDetectorRef: ChangeDetectorRef,
        private commonDataService: CommonDataService,
        private notification: NotificationService) {
        title.setTitle("Feedback - Parts Link");
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }
    sendFeedback(feedbackmessage): void {
        this.loader.loading = true;
        this.feedbackinput = Object.assign(new FeedbackInput(), {
            customerNumber: this.commonDataService.Customer.customerNumber != null ? this.commonDataService.Customer.customerNumber : this.commonDataService.DefaultCustomer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            partSearchTerm: this.activatedRoute.snapshot.queryParams['partSearchTerm'],
            previousPageUrl: this.activatedRoute.snapshot.queryParams['previousPageUrl'],
            message:feedbackmessage
        });
        this.feedbackmessage = feedbackmessage;
        this.feedbackService.sendFeedback(this.feedbackinput)
            .then(f => {
                this.referencenumber = f.id;
                if (f.ErrorType != undefined && f.ErrorType != null && f.ErrorType != 200) {
                    this.loader.loading = false;
                    this.notification.errorMessage("FeedbackComponent", "sendFeedback", "sendFeedback", f);
                }
                else {
                    this.notification.showNotification(`Feedback sent successfully with reference number ${this.referencenumber}.`, NotificationType.Success);
                    this.feedbackmessage = "";
                    this.loader.loading = false;
                    this.location.back();
                }               
                console.log("feedback Data : ", f);
            },
            error => { });
    }
    cancel()
    {
        this.location.back();
    }
}