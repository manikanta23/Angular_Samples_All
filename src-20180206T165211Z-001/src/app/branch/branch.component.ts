import { Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef } from "@angular/core";
import { BranchService } from "./branch.service";
import { Branch, BranchInfo } from "./../_entities/branch.entity"
import { CommonDataService } from "./../_common/services/common-data.service";
import { LoaderService } from "./../_common/services/loader.service";
import * as _ from "lodash";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
    selector: "branch-view",
    templateUrl: `./src/app/branch/branch.component.html?v=${new Date().getTime()}`,
    providers: [BranchService],
})

export class BranchComponent implements OnInit, OnDestroy {
    public branches: any;
    public myForm: FormGroup;
    errorMessage: any;
    subscription: any;
    originalBranches: any;

    constructor(private loader: LoaderService,
        private branchService: BranchService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private changeDetectorRef: ChangeDetectorRef,
        private builder: FormBuilder,
        private _sanitizer: DomSanitizer,
        private elementRef: ElementRef) {
        //this.notification.hideNotification();        
    }

    ngOnInit() {
        this.GetUserBranchesForOrdering("");
        this.subscription = this.commonDataService.commonDataUpdated
            .subscribe(
            (d: any) => {
                this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
                //this.changeDetectorRef.detectChanges();
                this.loader.loading = false;
            });
        this.myForm = this.builder.group({
            branch: "",
        });
        //this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
    }

    GetUserBranchesForOrdering(filterKey: string): void {
        this.branchService.GetUserBranchesForOrdering(filterKey)
            .then(
            branches => {
                if (branches.ErrorType != undefined && branches.ErrorType != null && branches.ErrorType != 200) {
                    this.notification.errorMessage("BranchComponent", "GetUserBranchesForOrdering", "GetUserBranchesForOrdering", branches);
                }
                else {
                    this.originalBranches = branches;
                    this.commonDataService.AllOriginalBranches = this.originalBranches;
                    this.branches = _.sortBy(branches.map(b => ({ code: +b.code, name: b.code + " - " + b.name })), ['code', 'name']);
                    let branchCode = this.commonDataService.Branch.code;
                    let branch = _.filter(<any[]>branches, function (row) {
                        return row.code == branchCode;
                    });
                    if (branch && branch.length > 0) {
                        this.commonDataService.Branch = branch[0];
                    }
                    this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
                }
            },
            error => { this.errorMessage = <any>error; });
    }

    onBranchFocusoutEvent() {
        this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
    }

    autocompleListFormatter = (data: any) => {
        let html = `<div class="branch-auto-element">${data.name}</div>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }

    onBranchValueChange(e: any) {
        if (e != undefined && e != null && e != [] && e != {}) {
            this.loader.loading = true;
            let branch = _.filter(<any[]>this.originalBranches, function (row) {
                return row.code == e.code;
            })[0];
            console.log("Branch component selected branch : ", branch);
            this.commonDataService.Branch = branch;
            this.elementRef.nativeElement.querySelector('input#branch').value = branch.code + ' - ' + branch.name;
            this.loader.loading = false;
        }
    }

    selectAllContent(event: any) {
        event.target.select();
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
    }
}