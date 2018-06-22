import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { PartSearch } from "./../../_entities/part-search.entity";
import { PartsService } from "./../parts.service";
import { Clipboard } from "ts-clipboard";
import { NotesService } from "./../../parts/details/notes/notes.service";
import { Note } from "./../../_entities/notes.entity";
import { NationalInventory } from "./../../_entities/national-inventory.entity";
import { NationalInventoryModalService } from "./../../parts/details/national-inventory/national-inventory-modal.service";
import { CartSearch, Cart } from "./../../_entities/cart.entity";
import { CartService } from "./../../cart/cart.service";
import { Title } from '@angular/platform-browser';

import { PriceVerifyComponent } from "./price-verify/price-verify.component";
import { MscPriceVerifyPart } from "./../../_entities/msc-price-verify-part";

import * as _ from "lodash";
import { AppInsightQuote } from "../../_entities/app-insight-quote.entity";
import { ApplicationInsightsService, SourceLocationType } from "../../_common/services/application-insights.service";
import { AppInsightAddToCart } from "../../_entities/app-insight-add-to-cart.entity";
import { AppInsightCustomerChange } from "../../_entities/app-insight-customer-change.entity";
import { AppInsightBilling } from "../../_entities/app-insight-billing.entity";
declare var jQuery: any;

@Component({
    selector: "parts-details",
    templateUrl: `./src/app/parts/details/details.component.html?v=${new Date().getTime()}`,
    providers: [NotesService, ApplicationInsightsService]
})

export class PartsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    imageBaseUrl: string;
    defaultImage: string;
    @Input("part-detail") partsData: any = null;
    @Input("partSearchTerm") searchTerm: any = null;
    relatedParts: any;
    alternateParts: any;
    getAlternatesChecked: boolean = false;
    searchData: PartSearch = new PartSearch();
    allNotes: any;
    sapCuratedNote: any = null;
    description: string = "";
    noteSortDirection: string = "Newest to Oldest";
    sortBy: string = "";
    sortAsc: boolean = false;
    part: any;
    branchCode: string;
    addtoCartParameters: Cart = new Cart();
    isPriceAdjustmentActive: boolean = false;
    detailCoreOption: string = "NOCORER";
    priceAdjustmentMessage: string = "";
    adjustedPrice: any;
    partwithAdjustedPrice: any;
    catalogSearchUrl: string = this.commonDataService.CatalogSearchUrl;
    isSpecialPricing: boolean = false;
    lastModifiedPrice: number;
    isMscOrFleetCustomer: boolean = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
        ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
    mscPayerSubscription: any = null;

    @ViewChild('priceVerify') priceVerifyComponent: PriceVerifyComponent;

    isCustomerChangedValue: boolean = false;
    @Output() isCustomerChangedChange = new EventEmitter();
    @Input()
    get isCustomerChanged() {
        return this.isCustomerChangedValue;
    }
    set isCustomerChanged(val) {
        this.isCustomerChangedValue = val;
        this.isCustomerChangedChange.emit(this.isCustomerChangedValue);
    }
    @Input() customerDataOnCustomerChange: any = null;

    isBranchChangedValue: boolean = false;
    @Output() isBranchChangedChange = new EventEmitter();
    @Input()
    get isBranchChanged() {
        return this.isBranchChangedValue;
    }
    set isBranchChanged(val) {
        this.isBranchChangedValue = val;
        this.isBranchChangedChange.emit(this.isBranchChangedValue);
    }
    @Input("branchDataUpdated") branchDataUpdated: any;

    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private partsService: PartsService,
        private cartService: CartService,
        private title: Title,
        private notesService: NotesService,
        private changeDetectorRef: ChangeDetectorRef,
        private nationalInventoryModalService: NationalInventoryModalService,
        private elementRef: ElementRef,
        private applicationInsightsService: ApplicationInsightsService
    ) {
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
        title.setTitle("Details - Parts Link");
    }

    ngOnInit() {
        this.searchData = Object.assign(new PartSearch(), {
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

        this.mscPayerSubscription = this.commonDataService.mscPayerUpdated.subscribe((d: any) => {
            this.isMscOrFleetCustomer = (this.commonDataService.MscPayer != null && this.commonDataService.MscPayer != undefined)
                ? this.commonDataService.MscPayer.isMscOrFleetCustomer : false;
        });

        this.getNotes();
        this.part = this.partsData.parts[0];
        this.part.quantity = 1;
        this.lastModifiedPrice = this.part.listPrice;
        console.log("Details component part : ", this.part);

        if (this.isBranchChanged) {
            let appInsightBilling = Object.assign(new AppInsightBilling(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                customerNumber: this.commonDataService.Customer.customerNumber,
                customerName: this.commonDataService.Customer.customerName,
                cartNumber: this.commonDataService.CartId,
                PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                source: SourceLocationType[SourceLocationType.PartDetailResult],
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
            let appInsightCustomerChange = Object.assign(new AppInsightCustomerChange(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                branchNumber: this.commonDataService.Branch.code,
                cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
                source: SourceLocationType[SourceLocationType.PartDetailResult]
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
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.querySelector('input#txtQuantity').focus();
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        // console.log(inputChar, e.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    togglePricePanel() {
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
    }

    setAdjustedPrice(part: any, adjustedPrice: number, priceOverrideReasonId: string) {
        this.priceAdjustmentMessage = "";
        console.log("Details component adjust price part : ", part);
        //var priceTobeAdjusted = $("#customerPrice" + partIdValue).text();
        let priceOverrideLowerLimit: any = part.yourPrice;
        let priceTobeAdjusted: any = part.listPrice;

        let priceOverrideFactor: any = this.commonDataService.Price_Override_Factor;
        //adjusted Price is within x% of cost price, e.g. 10%
        let calulatedPercentagePrice: any = (priceTobeAdjusted * priceOverrideFactor) / 100;
        let lowerLimit: any = priceTobeAdjusted - calulatedPercentagePrice;

        //let isCoupon: boolean = _.includes(this.commonDataService.Coupons, part.rushPartNumber);
        let isCoupon: boolean = this.commonDataService.CouponCriteria.some(function (v) { return part.rushPartNumber.indexOf(v) >= 0; });

        if (!isCoupon && !(adjustedPrice >= lowerLimit && adjustedPrice >= priceOverrideLowerLimit)) {
            this.notification.showNotification("You are violating the adjustment limit.", NotificationType.Error);
        }
        else {
            this.partwithAdjustedPrice = part;
            this.partwithAdjustedPrice.adjustedPrice = adjustedPrice;
            this.partwithAdjustedPrice.finalPrice = adjustedPrice;
            this.partwithAdjustedPrice.priceOverrideReasonId = priceOverrideReasonId;
            this.priceAdjustmentMessage = "Are You Sure? Remember! Coupons, Discounts, or Fee Credits must be entered as a negative value (e.g. $ -5.00)";
            jQuery("#confirmationPriceAdjustment").modal("show");
        }
    }

    onPriceAdjustmentConfirmationYes() {
        this.lastModifiedPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.adjustedPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.finalPrice = this.partwithAdjustedPrice.adjustedPrice;
        this.part.priceOverrideReasonId = this.partwithAdjustedPrice.priceOverrideReasonId;
        this.togglePricePanel();
    }

    onPriceAdjustmentConfirmationNo() {
        this.part.adjustedPrice = null;
        this.part.finalPrice = this.partwithAdjustedPrice.finalPrice;
    }

    getRelatedParts(): void {
        this.partsService.getRelatedParts(this.searchData)
            .then(parts => {
                if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                    this.relatedParts = [];
                    this.notification.errorMessage("PartsDetailsComponent", "getRelatedParts", "getRelatedParts", parts);
                }
                else {
                    if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                        parts.parts.forEach((t) => {
                            t.hasCoupon = this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                        });
                    }
                    this.relatedParts = parts;
                }
                console.log("Details component related part : ", this.relatedParts);
                //this.changeDetectorRef.detectChanges();
            },
            error => { });
    }

    getAlternateParts(): void {
        console.log("Details component get alternate parts parameters : ", this.searchData);
        this.partsService.getAlternateParts(this.searchData)
            .then(parts => {
                if (parts.ErrorType != undefined && parts.ErrorType != null && parts.ErrorType != 200) {
                    this.alternateParts = [];
                    this.notification.errorMessage("PartsDetailsComponent", "getAlternateParts", "getAlternateParts", parts);
                }
                else {
                    if (parts != undefined && parts != null && parts.parts != undefined && parts.parts != null && parts.parts.length > 0) {
                        parts.parts.forEach((t) => {
                            t.hasCoupon = this.commonDataService.checkPartCouponVendorAssociation(t.rushPartNumber);
                        });
                    }
                    this.alternateParts = parts;
                }
                this.getAlternatesChecked = true;
                console.log("Details component alternate parts : ", this.alternateParts);
                //this.changeDetectorRef.detectChanges();
            },
            error => { });
    }

    getNotes(): void {
        let partId: string = this.partsData.parts[0].partId;
        let partNumber: string = this.partsData.parts[0].rushPartNumber;
        let noteId: number;
        //
        this.notesService.getNotes(partId, partNumber, noteId)
            .then(getAllNotes => {
                if (getAllNotes.ErrorType != undefined && getAllNotes.ErrorType != null && getAllNotes.ErrorType != 200) {
                    this.notification.errorMessage("PartsDetailsComponent", "getNotes", "getNotes", getAllNotes);
                }
                else {
                    this.allNotes = getAllNotes.notes;
                    this.sapCuratedNote = getAllNotes.sapCuratedNote;
                    this.noteSortDirection = "Newest to Oldest";
                    this.sortAsc = false;
                }
                console.log("Details component notes : ", this.allNotes);
                //this.changeDetectorRef.detectChanges();
            },
            error => { });
    }

    createNotes() {
        let newNote: Note = Object.assign(new Note(), {
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
            .then(addnewNote => {
                if (addnewNote.ErrorType != undefined && addnewNote.ErrorType != null && addnewNote.ErrorType != 200) {
                    this.notification.errorMessage("PartsDetailsComponent", "createNotes", "createNotes", addnewNote);
                }
                else {
                    this.getNotes();
                }
                this.description = "";
            },
            error => { });
    }

    copyToClipBoard(contentToCopy: string) {
        Clipboard.copy(contentToCopy);
        this.notification.showNotification(`${contentToCopy} copied to clipboard.`, NotificationType.Success);
    }

    openNationalInventory(part: any) {
        part.source = SourceLocationType[SourceLocationType.PartDetailResult];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
    }

    partdetailCoreOptionChange(detailCoreOption) {
        this.detailCoreOption = detailCoreOption;
    }

    addToCart(addToCartItem: any) {
        this.addtoCartParameters = Object.assign(new Cart(), {
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

        let sourceName = "PartsDetailsComponent_addToCart";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightAddToCart = Object.assign(new AppInsightAddToCart(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            source: SourceLocationType[SourceLocationType.PartDetailResult],
            plMetricName: sourceName
        });
        appInsightAddToCart.product = this.applicationInsightsService.getAppInsightParts(addToCartItem, JSON.stringify(appInsightAddToCart).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightAddToCart);

        this.cartService.addToCart(this.addtoCartParameters)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("PartsDetailsComponent", "addToCart", "addToCart", carts);
                }
                else {
                    this.notification.showNotification(`${addToCartItem.rushPartNumber} ${addToCartItem.description} with ${addToCartItem.quantity} quantity added successfully.`, NotificationType.Success);
                }
                console.log("Details component add to carts : ", carts);
            },
            error => { });
    }

    sortDataBy(sortBy: string, sortAsc: boolean) {
        this.sortAsc = sortAsc;
        if (this.sortAsc)
            this.noteSortDirection = "Oldest to Newest";
        else
            this.noteSortDirection = "Newest to Oldest";
        this.sortBy = sortBy;
        this.allNotes = this.commonDataService.sortData(this.allNotes, this.sortBy, this.sortAsc);
    }

    changeQuntity(part: any, e: any) {
        if (e.which == 38)
            part.quantity = +(part.quantity) + 1;
        else if (e.which == 40 && part.quantity > 1)
            part.quantity = part.quantity - 1;
        //else if ((e.which == 8 || e.which == 46) && !part.quantity)
        //    part.quantity = 1;
        //else if (part.quantity == 0)
        //    part.quantity = 1;
    }

    onQuantityFocusout(part: any, e: any) {
        let quantity: any = e.srcElement.value;
        if (!quantity || quantity == 0) {
            e.srcElement.value = "1";
            part.quantity = 1;
        }
    }

    hidenotification() {
        this.notification.hideNotification();
    }


    showMscPriceVerifyPopup(part) {
        let mscPriceVerifyParts: Array<MscPriceVerifyPart> = new Array<MscPriceVerifyPart>();
        let parts: Array<any> = new Array<any>();
        let _mscPart = new MscPriceVerifyPart()
        _mscPart.PartNumber = part.rushPartNumber;
        _mscPart.Quantity = part.quantity;
        _mscPart.UnitPrice = this.lastModifiedPrice; //part.listPrice; //adjustedPrice


        mscPriceVerifyParts.push(_mscPart);
        parts.push(part);

        this.priceVerifyComponent.mscPriceVerifyParts = mscPriceVerifyParts;
        this.priceVerifyComponent.parts = parts;
        this.priceVerifyComponent.showModal(SourceLocationType.PartDetailPriceVerify);
    }

    onMscPriceVerified(mscPriceVerifiedData: any) {
        console.log("onMscPriceVerified : ", mscPriceVerifiedData);
        if (mscPriceVerifiedData != null && mscPriceVerifiedData != undefined) {
            this.part.adjustedPrice = 0;
            this.part.rebateField = mscPriceVerifiedData.rebate;
            this.part.isPriceVerified = mscPriceVerifiedData.isPriceVerified;
            this.part.verifiedPrice = mscPriceVerifiedData.unitPrice;
            this.lastModifiedPrice = mscPriceVerifiedData.unitPrice;
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.mscPayerSubscription.unsubscribe();
    }
}