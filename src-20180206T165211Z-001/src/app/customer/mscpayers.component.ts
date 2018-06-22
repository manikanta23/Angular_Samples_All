import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from "@angular/core";

import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { MscPayerSearch, MscPayer } from "./../_entities/customer-search.entity";
import { CommonDataService } from "./../_common/services/common-data.service";
import { PartsSearchService } from "./../search/parts/parts-search.service";
import { CustomerModalService } from "./../search/modal/customer/customer.service";
declare var jQuery: any;
import * as _ from "lodash";

@Component({
    selector: "mscpayers-modal",
    templateUrl: `./src/app/customer/mscpayers.component.html?v=${new Date().getTime()}`
})

export class MscPayersComponent implements OnInit, OnDestroy {
    subscription: any;
    customerMSCPayerData: MscPayer;
    defaultPayer: any;
    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private partsSearchService: PartsSearchService,
        private customerModalService: CustomerModalService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        //this.notification.hideNotification();
    }

    ngOnInit() {
        if (this.commonDataService.DefaultCustomer.customerNumber == this.commonDataService.Customer.customerNumber) {
            this.defaultPayer = null;
            this.customerMSCPayerData = null;
            this.subscription = null;
            this.commonDataService.MscPayer = null;
        }

        else {

            this.subscription = this.customerModalService.notifyShowMSCPayerModalEventEmitter.subscribe((res) => {

                this.defaultPayer = null;
                this.customerMSCPayerData = null;

                if (res.hasOwnProperty('data') && res.data != null) {
                    let mscPayerSearch: MscPayerSearch = Object.assign(new MscPayerSearch(), {
                        CustomerNumber: res.data.customerNumber,
                        BranchCode: this.commonDataService.Branch.code,
                        AccountGroups: ["Z001", "Z002"]
                    });
                    this.partsSearchService.getMscPayers(mscPayerSearch)
                        .then(p => {
                            if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                                this.notification.errorMessage("MscPayersComponent", "ngOnInit", "getMscPayers", p);
                            }
                            else {
                                this.customerMSCPayerData = p;

                                if (this.customerMSCPayerData.payers.length == 1) {
                                    this.defaultPayer = this.customerMSCPayerData.payers[0];
                                }
                                else if (this.customerMSCPayerData.payers.length > 1) {
                                    let defaultPayerSelected = _.filter(<any[]>this.customerMSCPayerData.payers, function (row) {
                                        return row.isDefault == true
                                    });

                                    if (defaultPayerSelected && defaultPayerSelected.length == 1)
                                        this.defaultPayer = defaultPayerSelected;
                                    else if (defaultPayerSelected && defaultPayerSelected.length > 1)
                                        this.defaultPayer = defaultPayerSelected[0];
                                    else {
                                        this.defaultPayer = this.customerMSCPayerData.payers[0];
                                    }
                                    this.showModal();
                                }

                                this.setPayer(false);
                            }
                            console.log("MSC Payer Search: ", p);
                            this.loader.loading = false;
                        },
                        error => { this.loader.loading = false; });
                }

            });
        }
    }

    onPayerChange(payer: any) {
        this.defaultPayer = payer;
    }
    setPayer(closeModal: boolean = false) {

        let _payerNumber: string = (this.defaultPayer != null && this.defaultPayer != undefined) ? this.defaultPayer.payerNumber : "";
        let _mscCardNumber: string = (this.customerMSCPayerData != null && this.customerMSCPayerData != undefined) ? this.customerMSCPayerData.mscCardNumber : "";

        let _isMscOrFleetCustomer = this.customerMSCPayerData.payers != null && this.customerMSCPayerData.payers != undefined && this.customerMSCPayerData.payers.length > 0;

        let mscPayerSearch: any = {
            payerNumber: _payerNumber,
            mscCardNumber: _mscCardNumber,
            isMscOrFleetCustomer: _isMscOrFleetCustomer
        };
        this.commonDataService.MscPayer = mscPayerSearch;

        if (closeModal)
            this.closeModal();
    }

    showModal(): void {
        jQuery("#mscpayersModal").modal("show");
    }

    closeModal(): void {
        jQuery("#mscpayersModal").modal("hide");
    }

    ngOnDestroy() {
        //this.changeDetectorRef.detach();
        if (this.subscription != null && this.subscription != undefined)
            this.subscription.unsubscribe();
    }
}