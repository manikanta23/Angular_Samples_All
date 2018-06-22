import { Component } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CouponDashboardService } from "./coupon-dashboard.service";
import { CommonDataService } from "./../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from "./../_common/services/pager.service";
declare var jQuery: any;

@Component({
    templateUrl: `./src/app/coupon/coupon-file-import.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]
})
export class CouponFileImportComponent {

    notificationType = NotificationType;
    // pager object
    pager: any = {};
    // paged items
    pagedFiletems: any[];
    fileItems: Array<any> = new Array<any>();
    filteredFiletems: Array<any> = new Array<any>();
    filterKey: string = '';
    sortBy: string = "";
    sortAsc: boolean = false;
    dataLoadMessage: string = null;
    isDataLoading: boolean = false;
    couponsPermissions: any = null;

    constructor(private http: Http,
        private notification: NotificationService,
        private couponDashboardService: CouponDashboardService,
        private pagerService: PagerService,
        private router: Router,
        private commonDataService: CommonDataService) {
    }

    ngOnInit() {
        this.couponsPermissions = this.commonDataService.CouponsPermissions;

        if (this.couponsPermissions && (this.couponsPermissions.hasImportCouponsPermissions || this.couponsPermissions.hasReadCouponsPermissions))
            this.getCouponFileImportsSummary();
    }

    getCouponFileImportsSummary() {
        this.dataLoadMessage = "Loading coupon file imports summary data...";
        this.isDataLoading = true;
        this.couponDashboardService.getCouponFileImportsSummary()
            .then(oc => {
                this.isDataLoading = false;
                if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                    this.notification.errorMessage("CouponFileImportComponent", "getCouponFileImportsSummary", "getCouponFileImportsSummary", oc);
                }
                else {
                    this.fileItems = oc;
                    this.filteredFiletems = this.fileItems;
                    this.setPage(1);

                    if (this.fileItems == null || this.fileItems.length <= 0)
                        this.dataLoadMessage = "No records found."
                    else
                        this.dataLoadMessage = null;
                }
                console.log("Coupon File Imports Summary : ", oc);
            },
            error => { this.isDataLoading = false; });

    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredFiletems.length, page, 10);

        // get current page of items
        this.pagedFiletems = this.filteredFiletems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function () {

        if (this.filterKey !== '') {
            this.filteredFiletems = this.fileItems.filter(function (e) {
                return ((e.fileName && e.fileName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                    (e.status && e.status.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
            }.bind(this));

            this.setPage(1);
        }
        else {
            this.filteredFiletems = this.fileItems;
            this.setPage(1);
        }
    }

    sortDataBy(sortBy: string) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;

        this.sortBy = sortBy;

        this.filteredFiletems = this.commonDataService.sortData(this.filteredFiletems, this.sortBy, this.sortAsc);

        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    }
    onToggleAccordion(fileItem: any) {
        this.filteredFiletems.forEach(item => {
            if (item.id != fileItem.id)
                item.isOpened = false;
        });

        fileItem.isOpened = fileItem.isOpened ? false : true;
    }
} 