import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { Clipboard } from "ts-clipboard";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";

import { ManufacturerFilterPipe } from './../../parts/list/pipe.component';
import { Facet } from "./../../_entities/part-search.entity";
import { NationalInventoryModalService } from "./../../parts/details/national-inventory/national-inventory-modal.service";
import { SourceLocationType, ApplicationInsightsService } from "../../_common/services/application-insights.service";
import { AppInsightCustomerChange } from "../../_entities/app-insight-customer-change.entity";
import { AppInsightBilling } from "../../_entities/app-insight-billing.entity";

@Component({
    selector: "parts-list",
    templateUrl: `./src/app/parts/list/list.component.html?v=${new Date().getTime()}`
})

export class PartsListComponent implements OnInit {
    imageBaseUrl: string;
    defaultImage: string;
    @Input("parts") partsData: any = null;
    @Input("partSearchTerm") searchTerm: any = null;
    branchCode: string;
    sortBy: string = "";
    sortAsc: boolean = false;
    partsSortDirection: string = "Price High to Low";
    sourceLocationType = SourceLocationType;
    @Output() callBackRefineSearch: EventEmitter<any> = new EventEmitter();

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
        private nationalInventoryModalService: NationalInventoryModalService,
        private applicationInsightsService: ApplicationInsightsService
    ) {
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
    }

    ngOnInit() {
        if (this.isBranchChanged) {
            let appInsightBilling = Object.assign(new AppInsightBilling(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                customerNumber: this.commonDataService.Customer.customerNumber,
                customerName: this.commonDataService.Customer.customerName,
                cartNumber: this.commonDataService.CartId,
                PONumber: (this.commonDataService.PONumberValue == null || this.commonDataService.PONumberValue == undefined) ? "" : this.commonDataService.PONumberValue,
                source: SourceLocationType[SourceLocationType.PartListResult],
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
            appInsightBilling.products = this.applicationInsightsService.getAppInsightParts(this.partsData.parts, JSON.stringify(appInsightBilling).length);
            this.applicationInsightsService.trackMetric("BranchChange", appInsightBilling);
            this.isBranchChanged = false;
        }
        if (this.isCustomerChanged) {
            let appInsightCustomerChange = Object.assign(new AppInsightCustomerChange(), {
                userId: this.commonDataService.UserId,
                searchTerm: this.searchTerm,
                branchNumber: this.commonDataService.Branch.code,
                cartNumber: this.commonDataService.CartId != null ? this.commonDataService.CartId : "",
                source: SourceLocationType[SourceLocationType.PartListResult]
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
            appInsightCustomerChange.products = this.applicationInsightsService.getAppInsightParts(this.partsData.parts, JSON.stringify(appInsightCustomerChange).length);
            this.applicationInsightsService.trackMetric("CustomerChange", appInsightCustomerChange);
            this.isCustomerChanged = false;
            this.customerDataOnCustomerChange = null;
        }
    }

    selectedFacetArray: Array<Facet> = new Array<Facet>();

    @Input("refineSearch")
    set refineSearch(refineSearch: any) {
        if (refineSearch != null && refineSearch.length > 0) {
            for (let refine of refineSearch) {
                let facetItems = this.selectedFacetArray.filter(
                    (item: any) => item.facetText === refine.facetText && item.facetType === refine.facetType);

                if (facetItems.length == 0) {
                    var index = this.selectedFacetArray.indexOf(facetItems[0]);
                    if (index === -1) {
                        let facet = new Facet();
                        facet.facetText = refine.facetText;
                        facet.facetType = refine.facetType;
                        this.selectedFacetArray.push(facet);
                    }
                }

                if (refine.facetType == 'Manufacturer') {
                    let manufacturers = this.partsData.facets.manufacturer.buckets.filter((item: any) => item.val === refine.facetText);
                    if (manufacturers.length > 0) {
                        var i = this.partsData.facets.manufacturer.buckets.indexOf(manufacturers[0]);
                        this.partsData.facets.manufacturer.buckets[i].selected = i != -1;
                    }
                }
                else if (refine.facetType == 'Category') {
                    let categories = this.partsData.facets.category.buckets.filter((item: any) => item.val === refine.facetText);
                    if (categories.length > 0) {
                        var j = this.partsData.facets.category.buckets.indexOf(categories[0]);
                        this.partsData.facets.category.buckets[j].selected = j != -1;
                    }
                }
            }
        }
    }

    onFacetChange(selectedFacet: string, selectedFacetType: string, isChecked: boolean, arr: any) {

        let facetItems = this.selectedFacetArray.filter(
            (item: any) => item.facetText === selectedFacet && item.facetType === selectedFacetType);

        var index = -1;
        if (facetItems.length > 0)
            index = this.selectedFacetArray.indexOf(facetItems[0]);

        if (isChecked == true && index === -1) {

            this.selectedFacetArray = new Array<Facet>();//ToDo: New Array created to keep one facet item selected at a time. When multiple Facet item selection required just remove this line.

            let facet = new Facet();
            facet.facetText = selectedFacet;
            facet.facetType = selectedFacetType;

            this.selectedFacetArray.push(facet);
        }
        else if (isChecked == false && index != -1) {
            // Find and remove item from an array
            this.selectedFacetArray.splice(index, 1);
        }
        this.callBackRefineSearch.emit(this.selectedFacetArray);
    }

    copyToClipBoard(contentToCopy: string) {
        Clipboard.copy(contentToCopy);
        this.notification.showNotification(`${contentToCopy} copied to clipboard.`, NotificationType.Success);
    }

    openNationalInventory(part: any) {
        part.source = SourceLocationType[SourceLocationType.PartListResult];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
    }

    sortDataBy(sortBy: string, sortAsc: boolean) {
        this.sortAsc = sortAsc;
        if (this.sortAsc)
            this.partsSortDirection = "Price Low to High";
        else
            this.partsSortDirection = "Price High to Low";
        this.sortBy = sortBy;
        this.partsData.parts = this.commonDataService.sortData(this.partsData.parts, this.sortBy, this.sortAsc);
    }
}