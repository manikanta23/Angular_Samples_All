import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { PartsService } from "./parts.service";
import { ActivatedRoute } from '@angular/router';

import * as _ from "lodash";
import { Title } from '@angular/platform-browser';
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { PartSearch, Facet } from "./../_entities/part-search.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { AppInsightPartSearch } from "../_entities/app-insight-part-search.entity";
import { ApplicationInsightsService, SourceLocationType } from "../_common/services/application-insights.service";
import { AppInsightBilling } from "../_entities/app-insight-billing.entity";

@Component({
    templateUrl: `./src/app/parts/parts.component.html?v=${new Date().getTime()}`,
    providers: [PartsService, ApplicationInsightsService]
})

export class PartsComponent implements OnInit, OnDestroy {
    partsData: any = null;
    refineSearchData: any = null;
    errorMessage: any;
    searchData: PartSearch = new PartSearch();
    subscription: any = null;
    partSearchTerm: string = "";
    partId: string = "";
    isRefineSearchSource = false;

    branchDataUpdated: any;

    isCustomerChanged: boolean = false;
    customerDataOnCustomerChange: any = null;
    customerChangeSubscription = this.commonDataService.customerChangeEvent.subscribe((d: any) => {
        this.isCustomerChanged = true;
        this.customerDataOnCustomerChange = d;
    });

    isBranchChanged: boolean = false;
    branchUpdatedSubscription = this.commonDataService.branchUpdated.subscribe((d: any) => {
        this.isBranchChanged = true;
        this.branchDataUpdated = d;
    });

    constructor(
        private activatedRoute: ActivatedRoute,
        private partsService: PartsService,
        private title: Title,
        private commonDataService: CommonDataService,
        private notification: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationInsightsService: ApplicationInsightsService) {
        title.setTitle("Parts - Parts Link");
        //this.notification.hideNotification();
    }

    ngOnInit() {
        this.subscription = this.activatedRoute
            .queryParams
            .subscribe(params => {
                this.refineSearchData = null;
                this.partId = "";
                this.partSearchTerm = "";
                let searchTerm = params['searchTerm'];
                let partId = params['partId'];
                this.partSearchTerm = searchTerm;
                if (partId != undefined && partId != null && partId != "") {
                    this.partId = partId;
                }
                this.getPartOnChange();
                console.log("Parts component search term : ", searchTerm);
            });

        this.subscription = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
            this.partSearchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
            this.getPartOnChange();
        });
    }

    getPartOnChange() {
        this.searchData.partId = "";
        this.searchData = Object.assign(new PartSearch(), {
            partId: this.partId,
            partSearchTerm: this.partSearchTerm,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: true,
            isCountCheck: false,
            pageNumber: 1,
            pageSize: 100,
            includeFacets: true,
            userId: this.commonDataService.UserId,
            Facet: Object.assign(new Facet(), {})
        });
        this.getParts();
    }

    getParts(): void {
        this.partsData = null;
        //this.changeDetectorRef.detectChanges();
        this.partsService.getParts(this.searchData)
            .then(parts => {
                if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                    this.notification.errorMessage("PartsComponent", "getParts", "getParts", parts);
                }
                else {
                    let source = this.isRefineSearchSource ? SourceLocationType[SourceLocationType.PartListRefineSearch] : SourceLocationType[this.activatedRoute.snapshot.queryParams['src']];
                    let sourceName = "PartsComponent_getParts_getParts";
                    let metricName = this.applicationInsightsService.getMetricValue(sourceName);
                    let appInsightPartSearch = Object.assign(new AppInsightPartSearch(), {
                        userId: this.commonDataService.UserId,
                        searchTerm: this.partSearchTerm,
                        customerNumber: this.commonDataService.Customer.customerNumber,
                        branchNumber: this.commonDataService.Branch.code,
                        cartNumber: this.commonDataService.CartId,
                        source: source,
                        plMetricName: sourceName
                    });
                    appInsightPartSearch.results = this.applicationInsightsService.getAppInsightParts(parts.parts, JSON.stringify(appInsightPartSearch).length);
                    this.applicationInsightsService.trackMetric(metricName, appInsightPartSearch);

                    if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                        parts.parts.forEach((t) => {
                            t.hasCoupon = this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                        });
                    }

                    this.partsData = parts;
                    this.isBranchChanged = true;

                    if (this.partsData == undefined || this.partsData == null || this.partsData.parts.length <= 0) {
                        this.notification.showNotification("Part not found.", NotificationType.Error);
                        let appInsightBilling = Object.assign(new AppInsightBilling(), {
                            userId: this.commonDataService.UserId,
                            searchTerm: this.partSearchTerm,
                            customerNumber: this.commonDataService.Customer.customerNumber,
                            customerName: this.commonDataService.Customer.customerName,
                            cartNumber: this.commonDataService.CartId,
                            PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                            source: SourceLocationType[SourceLocationType.PartsResult],
                            unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
                        });
                        if (this.branchDataUpdated != undefined && this.branchDataUpdated != null) {
                            if (this.branchDataUpdated.previousBranch != undefined && this.branchDataUpdated.previousBranch != null) {
                                appInsightBilling.previousBranch = this.branchDataUpdated.previousBranch.code;
                            }
                            if (this.branchDataUpdated.newBranch != undefined && this.branchDataUpdated.newBranch != null) {
                                appInsightBilling.currentBranch = this.branchDataUpdated.newBranch.code;
                            }
                        }
                        appInsightBilling.products = "";
                        this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
                        this.isBranchChanged = false;
                    }
                }
                console.log("Parts component parts data : ", parts);
                this.isRefineSearchSource = false;
                //this.changeDetectorRef.detectChanges();
            },
            error => { });
    }

    onRefineSearchCheck(inputData: any): void {
        this.isRefineSearchSource = true;
        let searchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'];
        console.log("Parts component refine search check parameter : ", inputData);
        this.refineSearchData = inputData;
        this.searchData = Object.assign(new PartSearch(), {
            partSearchTerm: searchTerm,
            branchCode: this.commonDataService.Branch.code,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: true,
            isCountCheck: false,
            pageNumber: 1,
            pageSize: 100,
            includeFacets: true,
            Facet: inputData,
            userId: this.commonDataService.UserId
        });
        this.getParts();
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
        this.customerChangeSubscription.unsubscribe();
        this.branchUpdatedSubscription.unsubscribe();
    }
}