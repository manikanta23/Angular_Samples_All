"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var branch_service_1 = require("./branch.service");
var common_data_service_1 = require("./../_common/services/common-data.service");
var loader_service_1 = require("./../_common/services/loader.service");
var _ = require("lodash");
var notification_service_1 = require("./../_common/services/notification.service");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var BranchComponent = (function () {
    function BranchComponent(loader, branchService, notification, commonDataService, changeDetectorRef, builder, _sanitizer, elementRef) {
        var _this = this;
        this.loader = loader;
        this.branchService = branchService;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.changeDetectorRef = changeDetectorRef;
        this.builder = builder;
        this._sanitizer = _sanitizer;
        this.elementRef = elementRef;
        this.autocompleListFormatter = function (data) {
            var html = "<div class=\"branch-auto-element\">" + data.name + "</div>";
            return _this._sanitizer.bypassSecurityTrustHtml(html);
        };
        //this.notification.hideNotification();        
    }
    BranchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.GetUserBranchesForOrdering("");
        this.subscription = this.commonDataService.commonDataUpdated
            .subscribe(function (d) {
            _this.elementRef.nativeElement.querySelector('input#branch').value = _this.commonDataService.Branch.code + " - " + _this.commonDataService.Branch.name;
            //this.changeDetectorRef.detectChanges();
            _this.loader.loading = false;
        });
        this.myForm = this.builder.group({
            branch: "",
        });
        //this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
    };
    BranchComponent.prototype.GetUserBranchesForOrdering = function (filterKey) {
        var _this = this;
        this.branchService.GetUserBranchesForOrdering(filterKey)
            .then(function (branches) {
            if (branches.ErrorType != undefined && branches.ErrorType != null && branches.ErrorType != 200) {
                _this.notification.errorMessage("BranchComponent", "GetUserBranchesForOrdering", "GetUserBranchesForOrdering", branches);
            }
            else {
                _this.originalBranches = branches;
                _this.commonDataService.AllOriginalBranches = _this.originalBranches;
                _this.branches = _.sortBy(branches.map(function (b) { return ({ code: +b.code, name: b.code + " - " + b.name }); }), ['code', 'name']);
                var branchCode_1 = _this.commonDataService.Branch.code;
                var branch = _.filter(branches, function (row) {
                    return row.code == branchCode_1;
                });
                if (branch && branch.length > 0) {
                    _this.commonDataService.Branch = branch[0];
                }
                _this.elementRef.nativeElement.querySelector('input#branch').value = _this.commonDataService.Branch.code + " - " + _this.commonDataService.Branch.name;
            }
        }, function (error) { _this.errorMessage = error; });
    };
    BranchComponent.prototype.onBranchFocusoutEvent = function () {
        this.elementRef.nativeElement.querySelector('input#branch').value = this.commonDataService.Branch.code + " - " + this.commonDataService.Branch.name;
    };
    BranchComponent.prototype.onBranchValueChange = function (e) {
        if (e != undefined && e != null && e != [] && e != {}) {
            this.loader.loading = true;
            var branch = _.filter(this.originalBranches, function (row) {
                return row.code == e.code;
            })[0];
            console.log("Branch component selected branch : ", branch);
            this.commonDataService.Branch = branch;
            this.elementRef.nativeElement.querySelector('input#branch').value = branch.code + ' - ' + branch.name;
            this.loader.loading = false;
        }
    };
    BranchComponent.prototype.selectAllContent = function (event) {
        event.target.select();
    };
    BranchComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
    };
    return BranchComponent;
}());
BranchComponent = __decorate([
    core_1.Component({
        selector: "branch-view",
        templateUrl: "./src/app/branch/branch.component.html?v=" + new Date().getTime(),
        providers: [branch_service_1.BranchService],
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        branch_service_1.BranchService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        core_1.ChangeDetectorRef,
        forms_1.FormBuilder,
        platform_browser_1.DomSanitizer,
        core_1.ElementRef])
], BranchComponent);
exports.BranchComponent = BranchComponent;
//# sourceMappingURL=branch.component.js.map