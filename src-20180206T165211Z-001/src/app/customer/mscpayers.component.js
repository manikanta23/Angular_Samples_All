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
var loader_service_1 = require("./../_common/services/loader.service");
var notification_service_1 = require("./../_common/services/notification.service");
var customer_search_entity_1 = require("./../_entities/customer-search.entity");
var common_data_service_1 = require("./../_common/services/common-data.service");
var parts_search_service_1 = require("./../search/parts/parts-search.service");
var customer_service_1 = require("./../search/modal/customer/customer.service");
var _ = require("lodash");
var MscPayersComponent = (function () {
    function MscPayersComponent(loader, notification, commonDataService, partsSearchService, customerModalService, changeDetectorRef) {
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.partsSearchService = partsSearchService;
        this.customerModalService = customerModalService;
        this.changeDetectorRef = changeDetectorRef;
        //this.notification.hideNotification();
    }
    MscPayersComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.commonDataService.DefaultCustomer.customerNumber == this.commonDataService.Customer.customerNumber) {
            this.defaultPayer = null;
            this.customerMSCPayerData = null;
            this.subscription = null;
            this.commonDataService.MscPayer = null;
        }
        else {
            this.subscription = this.customerModalService.notifyShowMSCPayerModalEventEmitter.subscribe(function (res) {
                _this.defaultPayer = null;
                _this.customerMSCPayerData = null;
                if (res.hasOwnProperty('data') && res.data != null) {
                    var mscPayerSearch = Object.assign(new customer_search_entity_1.MscPayerSearch(), {
                        CustomerNumber: res.data.customerNumber,
                        BranchCode: _this.commonDataService.Branch.code,
                        AccountGroups: ["Z001", "Z002"]
                    });
                    _this.partsSearchService.getMscPayers(mscPayerSearch)
                        .then(function (p) {
                        if (p.ErrorType != undefined && p.ErrorType != null && p.ErrorType != 200) {
                            _this.notification.errorMessage("MscPayersComponent", "ngOnInit", "getMscPayers", p);
                        }
                        else {
                            _this.customerMSCPayerData = p;
                            if (_this.customerMSCPayerData.payers.length == 1) {
                                _this.defaultPayer = _this.customerMSCPayerData.payers[0];
                            }
                            else if (_this.customerMSCPayerData.payers.length > 1) {
                                var defaultPayerSelected = _.filter(_this.customerMSCPayerData.payers, function (row) {
                                    return row.isDefault == true;
                                });
                                if (defaultPayerSelected && defaultPayerSelected.length == 1)
                                    _this.defaultPayer = defaultPayerSelected;
                                else if (defaultPayerSelected && defaultPayerSelected.length > 1)
                                    _this.defaultPayer = defaultPayerSelected[0];
                                else {
                                    _this.defaultPayer = _this.customerMSCPayerData.payers[0];
                                }
                                _this.showModal();
                            }
                            _this.setPayer(false);
                        }
                        console.log("MSC Payer Search: ", p);
                        _this.loader.loading = false;
                    }, function (error) { _this.loader.loading = false; });
                }
            });
        }
    };
    MscPayersComponent.prototype.onPayerChange = function (payer) {
        this.defaultPayer = payer;
    };
    MscPayersComponent.prototype.setPayer = function (closeModal) {
        if (closeModal === void 0) { closeModal = false; }
        var _payerNumber = (this.defaultPayer != null && this.defaultPayer != undefined) ? this.defaultPayer.payerNumber : "";
        var _mscCardNumber = (this.customerMSCPayerData != null && this.customerMSCPayerData != undefined) ? this.customerMSCPayerData.mscCardNumber : "";
        var _isMscOrFleetCustomer = this.customerMSCPayerData.payers != null && this.customerMSCPayerData.payers != undefined && this.customerMSCPayerData.payers.length > 0;
        var mscPayerSearch = {
            payerNumber: _payerNumber,
            mscCardNumber: _mscCardNumber,
            isMscOrFleetCustomer: _isMscOrFleetCustomer
        };
        this.commonDataService.MscPayer = mscPayerSearch;
        if (closeModal)
            this.closeModal();
    };
    MscPayersComponent.prototype.showModal = function () {
        jQuery("#mscpayersModal").modal("show");
    };
    MscPayersComponent.prototype.closeModal = function () {
        jQuery("#mscpayersModal").modal("hide");
    };
    MscPayersComponent.prototype.ngOnDestroy = function () {
        //this.changeDetectorRef.detach();
        if (this.subscription != null && this.subscription != undefined)
            this.subscription.unsubscribe();
    };
    return MscPayersComponent;
}());
MscPayersComponent = __decorate([
    core_1.Component({
        selector: "mscpayers-modal",
        templateUrl: "./src/app/customer/mscpayers.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        parts_search_service_1.PartsSearchService,
        customer_service_1.CustomerModalService,
        core_1.ChangeDetectorRef])
], MscPayersComponent);
exports.MscPayersComponent = MscPayersComponent;
//# sourceMappingURL=mscpayers.component.js.map