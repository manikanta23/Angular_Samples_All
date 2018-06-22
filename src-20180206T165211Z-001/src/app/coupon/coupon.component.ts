//CouponComponent.ts
import { Component } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CouponDashboardService } from "./coupon-dashboard.service";
import { CommonDataService } from "./../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var jQuery: any;
@Component({
    templateUrl: `./src/app/coupon/coupon.component.html?v=${new Date().getTime()}`
})
export class CouponComponent {
    private isUploadBtn: boolean = false;   
    private isFileImported: boolean = false;


    notificationType = NotificationType;
    fileUploadMessages: any;
    formData: FormData = new FormData();
    fileName: any;
    fileSize: any;
    fileType: any;

    couponsPermissions: any = null;

    constructor(private http: Http,
        private notification: NotificationService,
        private couponDashboardService: CouponDashboardService,
        private location: Location,
        private router: Router,
        private commonDataService: CommonDataService) {
    }

    ngOnInit() {
        this.couponsPermissions = this.commonDataService.CouponsPermissions;
    }

    //file upload event  
    fileChange(event) {

        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {

            this.formData = new FormData();
            for (let file of event.target.files) {

                var fileSize = '0';
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

                this.fileName = 'Name: ' + file.name;
                this.fileSize = 'Size: ' + fileSize;
                this.fileType = 'Type: ' + file.type;

                this.formData.append(file.name, file);
            }

            this.couponDashboardService.importCouponJsonFile(this.formData)
                .then(oc => {

                    if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                        this.notification.errorMessage("CouponComponent", "importCouponJsonFile", "importCouponJsonFile", oc);
                    }
                    else {                       
                        this.isFileImported = true;
                        this.isUploadBtn = false;
                        this.fileUploadMessages = oc;
                    }
                    console.log("CouponComponent importCouponJsonFile Data : ", this.fileUploadMessages);
                },
                error => { });
        }
        //window.location.reload();
    }

    addFilesClick() {        
        this.isUploadBtn = true;
        this.isFileImported = false;
    }
   
    uploadFilesClick() {
        this.isUploadBtn = false;
        this.isFileImported = false;
    }
    cancel() {
        this.location.back();
    }  
} 