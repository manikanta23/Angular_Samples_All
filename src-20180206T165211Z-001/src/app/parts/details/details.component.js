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
var common_data_service_1 = require("./../../_common/services/common-data.service");
var notification_service_1 = require("./../../_common/services/notification.service");
var part_search_entity_1 = require("./../../_entities/part-search.entity");
var parts_service_1 = require("./../parts.service");
var ts_clipboard_1 = require("ts-clipboard");
var notes_service_1 = require("./../../parts/details/notes/notes.service");
var notes_entity_1 = require("./../../_entities/notes.entity");
var national_inventory_modal_service_1 = require("./../../parts/details/national-inventory/national-inventory-modal.service");
var cart_entity_1 = require("./../../_entities/cart.entity");
var cart_service_1 = require("./../../cart/cart.service");
var platform_browser_1 = require("@angular/platform-browser");
var price_verify_component_1 = require("./price-verify/price-verify.component");
var msc_price_verify_part_1 = require("./../../_entities/msc-price-verify-part");
var application_insights_service_1 = require("../../_common/services/application-insights.service");
var app_insight_add_to_cart_entity_1 = require("../../_entities/app-insight-add-to-cart.entity");
var app_insight_customer_change_entity_1 = require("../../_entities/app-insight-customer-change.entity");
var app_insight_billing_entity_1 = require("../../_entities/app-insight-billing.entity");
var PartsDetailsComponent = (function () {
    function PartsDetailsComponent(notification, commonDataService, partsService, cartService, title, notesService, changeDetectorRef, nationalInventoryModalService, elementRef, applicationInsightsService) {
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.partsService = partsService;
        this.cartService = cartService;
        this.title = title;
        this.notesService = notesService;
        this.changeDetectorRef = changeDetectorRef;
        this.nationalInventoryModalService = nationalInventoryModalService;
        this.elementRef = elementRef;
        this.applicationInsightsService = applicationInsightsService;
        this.partsData = null;
        this.searchTerm = null;
        this.getAlternatesChecked = false;
        this.searchData = new part_search_entity_1.PartSearch();
        this.sapCuratedNote = null;
        this.description = "";
        this.noteSortDirection = "Newest to Oldest";
        this.sortBy = "";
        this.sortAsc = false;
        this.addtoCartParameters = new cart_entity_1.Cart();
        this.isPriceAdjustmentActive = false;
        this.detailCoreOption = "NOCORER";
        this.priceAdjustmentMessage = "";
        this.catalogSearchUrl = this.commonDataService.CatalogSearchUrl;
        this.isSpecialPricing = false;
        this.isMscOrFleetCustomer = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
            ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        this.mscPayerSubscription = null;
        this.isCustomerChangedValue = false;
        this.isCustomerChangedChange = new core_1.EventEmitter();
        this.customerDataOnCustomerChange = null;
        this.isBranchChangedValue = false;
        this.isBranchChangedChange = new core_1.EventEmitter();
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
        title.setTitle("Details - Parts Link");
    }
    Object.defineProperty(PartsDetailsComponent.prototype, "isCustomerChanged", {
        get: function () {
            return this.isCustomerChangedValue;
        },
        set: function (val) {
            this.isCustomerChangedValue = val;
            this.isCustomerChangedChange.emit(this.isCustomerChangedValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartsDetailsComponent.prototype, "isBranchChanged", {
        get: function () {
            return this.isBranchChangedValue;
        },
        set: function (val) {
            this.isBranchChangedValue = val;
            this.isBranchChangedChange.emit(this.isBranchChangedValue);
        },
        enumerable: true,
        configurable: true
    });
    PartsDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchData = Object.assign(new part_search_entity_1.PartSearch(), {
            partId: this.partsData.parts[0].partId,
            branchCode: this.branchCode,
            customerNumber: this.commonDataService.Customer.customerNumber,
            includePriceAndAvailability: true,
            groupRelatedPartId: this.partsData.parts[0].groupRelatedpartId,
            materialId: this.partsData.parts[0].rushPartNumber,
            groupId: this.partsData.parts[0].groupId,
            userId: this.commonDataService.UserId
        });
        this.getRelatedParts();
        if (this.partsData.parts[0].groupId != 0)
            this.getAlternateParts();
        else
            this.getAlternatesChecked = true;
        this.mscPayerSubscription = this.commonDataService.mscPayerUpdated.subscribe(function (d) {
            _this.isMscOrFleetCustomer = (_this.commonDataService.MscPayer != null && _this.commonDataService.MscPayer != undefined)
                ? _this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        });
        this.getNotes();
        this.part = this.partsData.parts[0];
        this.part.quantity = 1;
        this.lastModifiedPrice = this.part.listPrice;
        console.log("Details component part : ", this.part);
        if (this.isBranchChanged) {
            var appInsightBilling = Object.assign(new app_insight_billing_entity_1.AppInsightBilling(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                customerNumber: this.commonDataService.Customer.customerNumber,
                customerName: this.commonDataService.Customer.customerName,
                cartNumber: this.commonDataService.CartId,
                PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartDetailResult],
                unitNumber: (this.commonDataService.UnitNumberValue == null || this.commonDataService.UnitNumberValue == undefined) ? "" : this.commonDataService.UnitNumberValue
            });
            if (this.branchDataUpdated != undefined && this.branchDataUpdated != null) {
                if (this.branchDataUpdated.previousBranch != undefined && this.branchDataUpdated.previousBranch != null) {
                    appInsightBilling.previousBranch = this.branchDataUpdated.previousBranch.code;
                }
                if (this.branchDataUpdated.newBranch != undefined && this.branchDataUpdated.newBranch != null) {
                    appInsightBilling.currentBranch = this.branchDataUpdated.newBranch.code;
                }
            }
            appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.part, JSON.stringify(appInsightBilling).length);
            this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
            this.isBranchChanged = false;
        }
        if (this.isCustomerChanged) {
            var appInsightCustomerChange = Object.assign(new app_insight_customer_change_entity_1.AppInsightCustomerChange(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                branchNumber: this.commonDataService.Branch.code,
                cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
                source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartDetailResult]
            });
            if (this.customerDataOnCustomerChange != undefined && this.customerDataOnCustomerChange != null) {
                if (this.customerDataOnCustomerChange.previousCustomer != undefined && this.customerDataOnCustomerChange.previousCustomer != null) {
                    appInsightCustomerChange.previousCustomerNumber = this.customerDataOnCustomerChange.previousCustomer.customerNumber;
                    appInsightCustomerChange.previousCustomerName = this.customerDataOnCustomerChange.previousCustomer.customerName;
                }
                if (this.customerDataOnCustomerChange.newCustomer != undefined && this.customerDataOnCustomerChange.newCustomer != null) {
                    appInsightCustomerChange.currentCustomerNumber = this.customerDataOnCustomerChange.newCustomer.customerNumber;
                    appInsightCustomerChange.currentCustomerName = this.customerDataOnCustomerChange.newCustomer.customerName;
                }
            }
            appInsightCustomerChange.products = this.applicationInsightsService.getAppInsightParts(this.part, JSON.stringify(appInsightCustomerChange).length);
            this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
            this.isCustomerChanged = false;
            this.customerDataOnCustomerChange = null;
        }
    };
    PartsDetailsComponent.prototype.ngAfterViewInit = function () {
        this.elementRef.nativeElement.querySelector('input#txtQuantity').focus();
    };
    PartsDetailsComponent.prototype._keyPress = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    PartsDetailsComponent.prototype.togglePricePanel = function () {
        this.isPriceAdjustmentActive = !this.isPriceAdjustmentActive;
        if (this.isPriceAdjustmentActive) {
            jQuery('#PriceAdjustmentForm').ready(function () {
                jQuery('#adjustedPrice').val('');
                jQuery('#adjustedPrice').focus();
            });
        }
        else {
            jQuery('#QuantityPriceForm').ready(function () {
                jQuery('#txtQuantity').focus();
            });
        }
    };
    PartsDetailsComponent.prototype.setAdjustedPrice = function (part, adjustedPrice, priceOverrideReasonId) {
        this.priceAdjustmentMessage = "";
        console.log("Details component adjust price part : ", part);
        //var priceTobeAdjusted = $("#customerPrice" + partIdValue).text();
        var priceOverrideLowerLimit = part.yourPrice;
        var priceTobeAdjusted = part.listPrice;
        var priceOverrideFactor = this.commonDataService.Price_Override_Factor;
        //adjusted Price is within x% of cost price, e.g. 10%
        var calulatedPercentagePrice = (priceTobeAdjusted * priceOverrideFactor) / 100;
        var lowerLimit = priceTobeAdjusted - calulatedPercentagePrice;
        //let isCoupon: boolean = _.includes(this.commonDataService.Coupons, part.rushPartNumber);
        var isCoupon = this.commonDataService.CouponCriteria.some(function (v) { return part.rushPartNumber.indexOf(v) >= 0; });
        if (!isCoupon && !(adjustedPrice >= lowerLimit && adjustedPrice >= priceOverrideLowerLimit)) {
            this.notification.showNotification("You are violating the adjustment limit.", notification_service_1.NotificationType.Error);
        }
        else {
            this.partwithAdjustedPrice = part;
            this.partwithAdjustedPrice.adjustedPrice = adjustedPrice;
            this.partwithAdjustedPrice.finalPrice = adjustedPrice;
            this.partwithAdjustedPrice.priceOverrideReasonId = priceOverrideReasonId;
            this.priceAdjustmentMessage = "Are You Sure? Remember! Coupons, Discounts, or Fee Credits must be entered as a negative value (e.g. $ -5.00)";
            jQuery("#confirmationPriceAdjustment").modal("show");
        }
    };
    PartsDetailsComponent.prototype.onPriceAdjustmentConfirmationYes = function () {
        this.lastModifiedPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.adjustedPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.finalPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.priceOverrideReasonId = this.partwithAdjustedPrice.priceOverrideReasonId;
        this.togglePricePanel();
    };
    PartsDetailsComponent.prototype.onPriceAdjustmentConfirmationNo = function () {
        this.part.adjustedPrice = null;
        this.part.finalPrice = this.partwithAdjustedPrice.finalPrice;
    };
    PartsDetailsComponent.prototype.getRelatedParts = function () {
        var _this = this;
        this.partsService.getRelatedParts(this.searchData)
            .then(function (parts) {
            if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                _this.relatedParts = [];
                _this.notification.errorMessage("PartsDetailsComponent", "getRelatedParts", "getRelatedParts", parts);
            }
            else {
                if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                    parts.parts.forEach(function (t) {
                        t.hasCoupon = _this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                    });
                }
                _this.relatedParts = parts;
            }
            console.log("Details component related part : ", _this.relatedParts);
            //this.changeDetectorRef.detectChanges();
        }, function (error) { });
    };
    PartsDetailsComponent.prototype.getAlternateParts = function () {
        var _this = this;
        console.log("Details component get alternate parts parameters : ", this.searchData);
        this.partsService.getAlternateParts(this.searchData)
            .then(function (parts) {
            if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                _this.alternateParts = [];
                _this.notification.errorMessage("PartsDetailsComponent", "getAlternateParts", "getAlternateParts", parts);
            }
            else {
                if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                    parts.parts.forEach(function (t) {
                        t.hasCoupon = _this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                    });
                }
                _this.alternateParts = parts;
            }
            _this.getAlternatesChecked = true;
            console.log("Details component alternate parts : ", _this.alternateParts);
            //this.changeDetectorRef.detectChanges();
        }, function (error) { });
    };
    PartsDetailsComponent.prototype.getNotes = function () {
        var _this = this;
        var partId = this.partsData.parts[0].partId;
        var partNumber = this.partsData.parts[0].rushPartNumber;
        var noteId;
        //
        this.notesService.getNotes(partId, partNumber, noteId)
            .then(function (getAllNotes) {
            if (getAllNotes.ErrorType != undefined && getAllNotes.ErrorType != null && getAllNotes.ErrorType != 200) {
                _this.notification.errorMessage("PartsDetailsComponent", "getNotes", "getNotes", getAllNotes);
            }
            else {
                _this.allNotes = getAllNotes.notes;
                _this.sapCuratedNote = getAllNotes.sapCuratedNote;
                _this.noteSortDirection = "Newest to Oldest";
                _this.sortAsc = false;
            }
            console.log("Details component notes : ", _this.allNotes);
            //this.changeDetectorRef.detectChanges();
        }, function (error) { });
    };
    PartsDetailsComponent.prototype.createNotes = function () {
        var _this = this;
        var newNote = Object.assign(new notes_entity_1.Note(), {
            Description: this.description,
            BranchCode: this.branchCode,
            userId: this.commonDataService.UserId,
            CustomerNumber: this.commonDataService.Customer.customerNumber,
            CreatedBy: this.commonDataService.UserId,
            UpdatedBy: this.commonDataService.UserId,
            PartId: this.partsData.parts[0].partId,
            PartNumber: this.partsData.parts[0].rushPartNumber
        });
        this.notesService.createNotes(newNote)
            .then(function (addnewNote) {
            if (addnewNote.ErrorType != undefined && addnewNote.ErrorType != null && addnewNote.ErrorType != 200) {
                _this.notification.errorMessage("PartsDetailsComponent", "createNotes", "createNotes", addnewNote);
            }
            else {
                _this.getNotes();
            }
            _this.description = "";
        }, function (error) { });
    };
    PartsDetailsComponent.prototype.copyToClipBoard = function (contentToCopy) {
        ts_clipboard_1.Clipboard.copy(contentToCopy);
        this.notification.showNotification(contentToCopy + " copied to clipboard.", notification_service_1.NotificationType.Success);
    };
    PartsDetailsComponent.prototype.openNationalInventory = function (part) {
        part.source = application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartDetailResult];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
    };
    PartsDetailsComponent.prototype.partdetailCoreOptionChange = function (detailCoreOption) {
        this.detailCoreOption = detailCoreOption;
    };
    PartsDetailsComponent.prototype.addToCart = function (addToCartItem) {
        var _this = this;
        this.addtoCartParameters = Object.assign(new cart_entity_1.Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.branchCode,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: addToCartItem.rushPartNumber,
            description: addToCartItem.description,
            customerPrice: addToCartItem.customerPrice,
            quantity: addToCartItem.quantity,
            coreOption: this.detailCoreOption,
            corePrice: addToCartItem.corePrice,
            corePartNumber: addToCartItem.corePart,
            partId: addToCartItem.partId,
            listPrice: addToCartItem.listPrice,
            adjustedPrice: addToCartItem.adjustedPrice,
            priceOverrideReasonId: addToCartItem.priceOverrideReasonId,
            PartNumOnly: addToCartItem.partNumberOnly,
            vmrsCode: addToCartItem.vmrsCode,
            vmrsDescription: addToCartItem.vmrsDescription,
            manufacturer: addToCartItem.manufacturer,
            cateogory: addToCartItem.cateogory,
            binLocation: addToCartItem.binLocation,
            rebateField: (addToCartItem.rebate != undefined && addToCartItem.rebate != null) ? addToCartItem.rebate : null,
            isPriceVerified: (addToCartItem.isPriceVerified != undefined && addToCartItem.isPriceVerified != null) ? addToCartItem.isPriceVerified : null,
            verifiedPrice: (addToCartItem.verifiedPrice != undefined && addToCartItem.verifiedPrice != null) ? addToCartItem.verifiedPrice : null,
            deliveryType: "",
            QuantityAvailable: addToCartItem.quantityAvailable,
            CorePurchasePrice: addToCartItem.corePrice,
            isSpecialPricing: addToCartItem.isSpecialPricing
        });
        var sourceName = "PartsDetailsComponent_addToCart";
        var metricName = this.applicationInsightsService.getMetricValue(sourceName);
        var appInsightAddToCart = Object.assign(new app_insight_add_to_cart_entity_1.AppInsightAddToCart(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            source: application_insights_service_1.SourceLocationType[application_insights_service_1.SourceLocationType.PartDetailResult],
            plMetricName: sourceName
        });
        appInsightAddToCart.product = this.applicationInsightsService.getAppInsightParts(addToCartItem, JSON.stringify(appInsightAddToCart).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightAddToCart);
        this.cartService.addToCart(this.addtoCartParameters)
            .then(function (carts) {
            if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                _this.notification.errorMessage("PartsDetailsComponent", "addToCart", "addToCart", carts);
            }
            else {
                _this.notification.showNotification(addToCartItem.rushPartNumber + " " + addToCartItem.description + " with " + addToCartItem.quantity + " quantity added successfully.", notification_service_1.NotificationType.Success);
            }
            console.log("Details component add to carts : ", carts);
        }, function (error) { });
    };
    PartsDetailsComponent.prototype.sortDataBy = function (sortBy, sortAsc) {
        this.sortAsc = sortAsc;
        if (this.sortAsc)
            this.noteSortDirection = "Oldest to Newest";
        else
            this.noteSortDirection = "Newest to Oldest";
        this.sortBy = sortBy;
        this.allNotes = this.commonDataService.sortData(this.allNotes, this.sortBy, this.sortAsc);
    };
    PartsDetailsComponent.prototype.changeQuntity = function (part, e) {
        if (e.which == 38)
            part.quantity = +(part.quantity) + 1;
        else if (e.which == 40 && part.quantity > 1)
            part.quantity = part.quantity - 1;
        //else if ((e.which == 8 || e.which == 46) && !part.quantity)
        //    part.quantity = 1;
        //else if (part.quantity == 0)
        //    part.quantity = 1;
    };
    PartsDetailsComponent.prototype.onQuantityFocusout = function (part, e) {
        var quantity = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            part.quantity = 1;
        }
    };
    PartsDetailsComponent.prototype.hidenotification = function () {
        this.notification.hideNotification();
    };
    PartsDetailsComponent.prototype.showMscPriceVerifyPopup = function (part) {
        var mscPriceVerifyParts = new Array();
        var parts = new Array();
        var _mscPart = new msc_price_verify_part_1.MscPriceVerifyPart();
        _mscPart.PartNumber = part.rushPartNumber;
        _mscPart.Quantity = part.quantity;
        _mscPart.UnitPrice = this.lastModifiedPrice; //part.listPrice; //adjustedPrice
        mscPriceVerifyParts.push(_mscPart);
        parts.push(part);
        this.priceVerifyComponent.mscPriceVerifyParts = mscPriceVerifyParts;
        this.priceVerifyComponent.parts = parts;
        this.priceVerifyComponent.showModal(application_insights_service_1.SourceLocationType.PartDetailPriceVerify);
    };
    PartsDetailsComponent.prototype.onMscPriceVerified = function (mscPriceVerifiedData) {
        console.log("onMscPriceVerified : ", mscPriceVerifiedData);
        if (mscPriceVerifiedData != null && mscPriceVerifiedData != undefined) {
            this.part.adjustedPrice = 0;
            this.part.rebateField = mscPriceVerifiedData.rebate;
            this.part.isPriceVerified = mscPriceVerifiedData.isPriceVerified;
            this.part.verifiedPrice = mscPriceVerifiedData.unitPrice;
            this.lastModifiedPrice = mscPriceVerifiedData.unitPrice;
        }
    };
    PartsDetailsComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
        this.mscPayerSubscription.unsubscribe();
    };
    return PartsDetailsComponent;
}());
__decorate([
    core_1.Input("part-detail"),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "partsData", void 0);
__decorate([
    core_1.Input("partSearchTerm"),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "searchTerm", void 0);
__decorate([
    core_1.ViewChild('priceVerify'),
    __metadata("design:type", price_verify_component_1.PriceVerifyComponent)
], PartsDetailsComponent.prototype, "priceVerifyComponent", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "isCustomerChangedChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PartsDetailsComponent.prototype, "isCustomerChanged", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "customerDataOnCustomerChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "isBranchChangedChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PartsDetailsComponent.prototype, "isBranchChanged", null);
__decorate([
    core_1.Input("branchDataUpdated"),
    __metadata("design:type", Object)
], PartsDetailsComponent.prototype, "branchDataUpdated", void 0);
PartsDetailsComponent = __decorate([
    core_1.Component({
        selector: "parts-details",
        templateUrl: "./src/app/parts/details/details.component.html?v=" + new Date().getTime(),
        providers: [notes_service_1.NotesService, application_insights_service_1.ApplicationInsightsService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        parts_service_1.PartsService,
        cart_service_1.CartService,
        platform_browser_1.Title,
        notes_service_1.NotesService,
        core_1.ChangeDetectorRef,
        national_inventory_modal_service_1.NationalInventoryModalService,
        core_1.ElementRef,
        application_insights_service_1.ApplicationInsightsService])
], PartsDetailsComponent);
exports.PartsDetailsComponent = PartsDetailsComponent;
//# sourceMappingURL=details.component.js.map