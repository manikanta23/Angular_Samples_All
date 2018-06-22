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
var notification_service_1 = require("./../../../_common/services/notification.service");
var parts_search_service_1 = require("./../../../search/parts/parts-search.service");
var pager_service_1 = require("./../../../_common/services/pager.service");
var common_data_service_1 = require("./../../../_common/services/common-data.service");
var router_1 = require("@angular/router");
var CreatePartModalComponent = (function () {
    function CreatePartModalComponent(notification, changeDetectorRef, elementRef, partsSearchService, pagerService, commonDataService, router) {
        this.notification = notification;
        this.changeDetectorRef = changeDetectorRef;
        this.elementRef = elementRef;
        this.partsSearchService = partsSearchService;
        this.pagerService = pagerService;
        this.commonDataService = commonDataService;
        this.router = router;
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.filter = function () {
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
        };
    }
    CreatePartModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.partsSearchService.notifyShowCreatePartModalEventEmitter.subscribe(function (res) {
            _this.multiplePartsData = null;
            _this.createPartResults = null;
            if (res.hasOwnProperty('data') && res.data != null) {
                _this.filterKey = "";
                _this.multiplePartsData = res.data.priceTapeResults;
                _this.filteredMultipleParts = res.data.priceTapeResults;
                var externalPartNumber = res.data.externalPartNumber;
                console.log("Create Part modal component show modal event subscription : ", res.data);
                if (_this.multiplePartsData == null || _this.multiplePartsData == undefined || _this.multiplePartsData.length === 0) {
                    _this.notification.showMultilineNotification(res.data.messages);
                }
                else if (externalPartNumber != null && externalPartNumber.length > 0 && (_this.multiplePartsData.length === 1)) {
                    _this.notification.showMultilineNotification(res.data.messages);
                    console.log("Single part returned, part number: ", externalPartNumber);
                    _this.router.navigate(['parts'], { queryParams: { searchTerm: externalPartNumber } });
                }
                else if (_this.multiplePartsData.length > 1) {
                    _this.setPage(1);
                    _this.showModal();
                }
            }
            else {
                _this.notification.showNotification("No records found to create part.", notification_service_1.NotificationType.Error);
            }
        });
    };
    CreatePartModalComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredMultipleParts.length, page, 6);
        // get current page of items
        this.createPartResults = this.filteredMultipleParts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    CreatePartModalComponent.prototype.sortDataBy = function (sortBy) {
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
    };
    CreatePartModalComponent.prototype.showModal = function () {
        jQuery("#createPartModal").modal("show");
    };
    CreatePartModalComponent.prototype.closeModal = function () {
        jQuery("#createPartModal").modal("hide");
    };
    CreatePartModalComponent.prototype.onPartNoSelect = function (part) {
        console.log(" On create Part modal component selected part : ", part);
        this.closeModal();
        this.partsSearchService.notifyCreatePartSelection({ data: part });
    };
    CreatePartModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return CreatePartModalComponent;
}());
CreatePartModalComponent = __decorate([
    core_1.Component({
        selector: "create-part-modal",
        templateUrl: "./src/app/search/modal/create-part/create-part.component.html?v=" + new Date().getTime(),
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        core_1.ChangeDetectorRef,
        core_1.ElementRef,
        parts_search_service_1.PartsSearchService,
        pager_service_1.PagerService,
        common_data_service_1.CommonDataService,
        router_1.Router])
], CreatePartModalComponent);
exports.CreatePartModalComponent = CreatePartModalComponent;
//# sourceMappingURL=create-part.component.js.map