import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { LoaderService } from "./../../../_common/services/loader.service";
import { PartsService } from "./../../parts.service";
import { MscPriceVerifyPart } from "./../../../_entities/msc-price-verify-part";
import { AppInsightAddToCart } from "../../../_entities/app-insight-add-to-cart.entity";
import { ApplicationInsightsService, SourceLocationType } from "../../../_common/services/application-insights.service";

import * as _ from "lodash";

declare var jQuery: any;

@Component({
    selector: "price-verify",
    templateUrl: `./src/app/parts/details/price-verify/price-verify.component.html?v=${new Date().getTime()}`,
    providers: [ApplicationInsightsService]
})

export class PriceVerifyComponent implements OnInit {
    subscription: any;
    mscCardAccountNo: string;
    payerAccountNumber: string;
    placeholderText: string;
    searchTerm: string = "";
    source: string;

    mscPriceVerifyParts: Array<MscPriceVerifyPart>;
    parts: any;
    @Output() callbackMscPriceVerified: EventEmitter<any> = new EventEmitter();

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private commonDataService: CommonDataService,
        private partsService: PartsService,
        private applicationInsightsService: ApplicationInsightsService
    ) {

    }
    ngOnInit() {
        this.assignAccountandCardNumbers();
    }

    showModal(source) {
        this.source = source;
        jQuery("#priceVerify").modal("show");
        jQuery('.price-verify-msc').show();
    }

    closeModal(): void {
        jQuery("#priceVerify").modal("hide");
        jQuery('.price-verify-msc').hide();
    }

    assignAccountandCardNumbers() {
        this.mscCardAccountNo = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.mscCardNumber : "";

        this.payerAccountNumber = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.payerNumber : "";
    }

    mscPriceVerification() {

        let mscPriceVerifyData: any = {
            mscPriceVerifyParts: this.mscPriceVerifyParts,
            payerAccountNumber: this.payerAccountNumber,
            mscCardNumber: this.mscCardAccountNo,
            branchCode: this.commonDataService.Branch.code,
            cartId: this.commonDataService.CartId
        };

        this.loader.loading = true;
        this.partsService.getMscPriceVerification(mscPriceVerifyData)
            .then(p => {
                this.loader.loading = false;
                if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                    this.notification.errorMessage("PriceVerifyComponent", "mscPriceVerification", "getMscPriceVerification", p);
                }
                else {
                    if (p.priceVerifyItems != null && p.priceVerifyItems != undefined && p.priceVerifyItems.length > 0) {
                        let _mscPriceVerifiedData: any = {
                            isPriceVerified: p.priceVerifyItems["0"].isPriceVerified,
                            itemCategory: p.priceVerifyItems["0"].itemCategory,
                            partNumber: p.priceVerifyItems["0"].partNumber,
                            quantity: p.priceVerifyItems["0"].quantity,
                            rebate: p.priceVerifyItems["0"].rebate,
                            unitPrice: p.priceVerifyItems["0"].unitPrice
                        }



                        let isPriceVerified = _.filter(<any[]>p.priceVerifyItems, function (row) {
                            return row.isPriceVerified == true
                        });
                        if (isPriceVerified.length > 0) {
                            /*******/
                            _.each(<any[]>this.parts, function (row) {

                                let verifiedItem = _.filter(<any[]>p.priceVerifyItems, function (verifiedItemRow) {
                                    return verifiedItemRow.partNumber == row.rushPartNumber || verifiedItemRow.partNumber == row.partNumber;
                                })[0];

                                row.verifiedPrice = verifiedItem.unitPrice
                            });
                            /*******/

                            let appInsightAddToCart = Object.assign(new AppInsightAddToCart(), {
                                userId: this.commonDataService.UserId,
                                customerNumber: this.commonDataService.Customer.customerNumber,
                                customerName: this.commonDataService.Customer.customerName,
                                branchNumber: this.commonDataService.Branch.code,
                                cartNumber: this.commonDataService.CartId,
                                source: SourceLocationType[this.source]
                            });
                            appInsightAddToCart.product = this.applicationInsightsService.getAppInsightParts(this.parts, JSON.stringify(appInsightAddToCart).length);
                            this.applicationInsightsService.trackMetric("PriceVerifyComponent_priceVerify_mscPriceVerification", appInsightAddToCart);
                        }
                        this.showResponseMessage(isPriceVerified, p.messages);

                        this.callbackMscPriceVerified.emit(_mscPriceVerifiedData);
                    }
                }
                console.log("PriceVerify Component: ", p);

            },
            error => { this.loader.loading = false; });

        jQuery("#priceVerify").modal("hide");
    }

    showResponseMessage(isPriceVerified: any, messages: any) {
        let successMessageObject = { message: "The Price has been verified and adjusted.", type: NotificationType.Success };

        if (isPriceVerified && isPriceVerified.length > 0 && messages.length <= 0) {
            this.notification.showNotification(successMessageObject.message, successMessageObject.type);
        }
        else if (isPriceVerified && isPriceVerified.length > 0 && messages.length > 0) {
            messages.push(successMessageObject);
            this.notification.showMultilineNotification(messages);
        }
        else if (messages.length > 1) {
            this.notification.showMultilineNotification(messages);
        }
        else if (messages.length == 1) {
            this.notification.showNotification(messages[0].message, messages[0].type);
        }
    }

}