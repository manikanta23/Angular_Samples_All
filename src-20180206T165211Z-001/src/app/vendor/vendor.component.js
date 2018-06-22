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
var common_data_service_1 = require("./../_common/services/common-data.service");
var vendors_component_1 = require("./../search/modal/vendors/vendors.component");
var vendors_service_1 = require("./../search/modal/vendors/vendors.service");
var VendorComponent = (function () {
    function VendorComponent(loader, notification, commonDataService, changeDetectorRef, vendorsService, elementRef) {
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.changeDetectorRef = changeDetectorRef;
        this.vendorsService = vendorsService;
        this.elementRef = elementRef;
        this.randomNumber = new Date().getTime();
        this.vendorNumber = "";
        this.advVendorName = "";
        this.advVendorCity = "";
        this.advVendorState = "";
        this.advVendorPostalCode = "";
        this.advVendorPhoneNumber = "";
        this.hasMessage = false;
        this.vendorMesssage = "";
        this.isDefaultVendorChecked = true;
        this.noRecordFlag = false;
        this.callbackVendorSelect = new core_1.EventEmitter();
    }
    VendorComponent.prototype.ngOnInit = function () {
        var _this = this;
        jQuery('#vendorSearchTabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.currentTarget.hash === "#pnlAdvancedVendorSearch") {
                _this.elementRef.nativeElement.querySelector('input#advVendorName').focus();
            }
            else {
                _this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
            }
        });
    };
    VendorComponent.prototype.viewFavorites = function () {
        jQuery('body').on('shown.bs.modal', '#favoriteVendorsModal', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    };
    VendorComponent.prototype.vendorSearch = function () {
        var _this = this;
        if (this.vendorNumber || this.advVendorName || this.advVendorCity || this.advVendorState || this.advVendorPostalCode || this.advVendorPhoneNumber) {
            this.hasMessage = false;
            this.vendorMesssage = "";
            this.loader.loading = true;
            console.log("Vendor component vendor number: ", this.vendorNumber);
            this.vendorsService.getVendors(this.vendorNumber, this.advVendorName, "", "", this.advVendorCity, this.advVendorState, this.advVendorPostalCode, this.advVendorPhoneNumber)
                .then(function (c) {
                if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                    _this.notification.errorMessage("VendorComponent", "vendorSearch", "getVendors", c);
                }
                else {
                    if (c.vendors == null || c.vendors.length == 0) {
                        _this.hasMessage = true;
                        _this.vendorMesssage = "No vendor found";
                    }
                    else {
                        _this.hasMessage = false;
                        _this.vendorMesssage = "";
                        if (c.vendors.length == 1) {
                            _this.vendorsService.notifyVendorSelection({ data: c.vendors[0] });
                        }
                        else if (c.vendors.length > 1) {
                            _this.vendorsService.notifyShowVendorModal({ data: c.vendors });
                        }
                    }
                }
                _this.loader.loading = false;
                console.log("Vendor component : ", c);
            }, function (error) {
                _this.loader.loading = false;
                _this.hasMessage = false;
                _this.vendorMesssage = "";
                _this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
            });
        }
    };
    VendorComponent.prototype.onVendorKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    };
    VendorComponent.prototype.onVendorNameKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.onPhoneNoKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.onPostalCodeKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.onCityKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.onStateKeypress = function (event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.onTabClick = function (isAdvanced) {
        this.vendorNumber = '';
        this.advVendorName = '';
        this.advVendorCity = '';
        this.advVendorState = '';
        this.advVendorPostalCode = '';
        this.advVendorPhoneNumber = '';
        this.noRecordFlag = false;
    };
    VendorComponent.prototype.onVendorKeydown = function (event) {
        if (event.keyCode == 9) {
            this.vendorSearch();
        }
    };
    VendorComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
    };
    return VendorComponent;
}());
__decorate([
    core_1.ViewChild('vendorsModal'),
    __metadata("design:type", vendors_component_1.VendorsModalComponent)
], VendorComponent.prototype, "vendorsModalComponent", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], VendorComponent.prototype, "callbackVendorSelect", void 0);
VendorComponent = __decorate([
    core_1.Component({
        selector: "vendor-panel",
        templateUrl: "./src/app/vendor/vendor.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        core_1.ChangeDetectorRef,
        vendors_service_1.VendorsService,
        core_1.ElementRef])
], VendorComponent);
exports.VendorComponent = VendorComponent;
//# sourceMappingURL=vendor.component.js.map