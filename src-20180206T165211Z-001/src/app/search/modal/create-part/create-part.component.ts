import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { PartsSearchService } from "./../../../search/parts/parts-search.service";
import { ExtendPart } from "./../../../_entities/extend-part.entity";
import { PagerService } from "./../../../_common/services/pager.service";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from "lodash";
declare var jQuery: any;

@Component({
    selector: "create-part-modal",
    templateUrl: `./src/app/search/modal/create-part/create-part.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]

})

export class CreatePartModalComponent implements OnInit {
    subscription: any;
    multiplePartsData: any;
    pager: any = {};
    // paged items
    createPartResults: any[];
    filteredMultipleParts: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;

    constructor(
        private notification: NotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private partsSearchService: PartsSearchService,
        private pagerService: PagerService,
        private commonDataService: CommonDataService,
        private router: Router
    ) {

    }
    ngOnInit() {
        this.subscription = this.partsSearchService.notifyShowCreatePartModalEventEmitter.subscribe((res) => {
            this.multiplePartsData = null;
            this.createPartResults = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                this.filterKey = "";
                this.multiplePartsData = res.data.priceTapeResults;
                this.filteredMultipleParts = res.data.priceTapeResults;
                let externalPartNumber: string = res.data.externalPartNumber;
                console.log("Create Part modal component show modal event subscription : ", res.data);
                if (this.multiplePartsData == null || this.multiplePartsData == undefined || this.multiplePartsData.length === 0) {
                    this.notification.showMultilineNotification(res.data.messages);
                }
                else if (externalPartNumber != null && externalPartNumber.length > 0 && (this.multiplePartsData.length === 1)) {
                    this.notification.showMultilineNotification(res.data.messages);
                    console.log("Single part returned, part number: ", externalPartNumber);
                    this.router.navigate(['parts'], { queryParams: { searchTerm: externalPartNumber } });
                }
                else if (this.multiplePartsData.length > 1) {
                    this.setPage(1);
                    this.showModal();
                }
            }
            else {
                this.notification.showNotification("No records found to create part.", NotificationType.Error);
            }
        });
    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredMultipleParts.length, page, 6);

        // get current page of items
        this.createPartResults = this.filteredMultipleParts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {
        if (this.filterKey !== '') {
            this.filteredMultipleParts = this.multiplePartsData.filter(function (e) {
                return ((e.materialNumber && e.materialNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.materialDescription && ("" + e.materialDescription).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.manufacturerNumber && e.manufacturerNumber.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.priceTapeIndicator && e.priceTapeIndicator.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.supersededPartNo && e.supersededPartNo.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.informationText && ("" + e.informationText).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1));

            }.bind(this));

            this.setPage(1);
        }
        else {
            this.filteredMultipleParts = this.multiplePartsData;
            this.setPage(1);
        }
    }

    sortDataBy(sortBy: string) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;

        this.sortBy = sortBy;

        this.filteredMultipleParts = this.commonDataService.sortData(this.filteredMultipleParts, this.sortBy, this.sortAsc);

        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    }

    showModal(): void {
        jQuery("#createPartModal").modal("show");
    }

    closeModal(): void {
        jQuery("#createPartModal").modal("hide");
    }


    onPartNoSelect(part: any): void {
        console.log(" On create Part modal component selected part : ", part);
        this.closeModal();
        this.partsSearchService.notifyCreatePartSelection({ data: part });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}



