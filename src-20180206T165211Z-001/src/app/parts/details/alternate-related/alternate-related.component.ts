import { Component, OnInit, Input } from "@angular/core";
import { PartsService } from "./../../parts.service";
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NotificationService, NotificationType } from "./../../../_common/services/notification.service";
import { PartSearch } from "./../../../_entities/part-search.entity";
import { CommonDataService } from "./../../../_common/services/common-data.service";
import { Clipboard } from "ts-clipboard";
import { NationalInventoryModalService } from "./../national-inventory/national-inventory-modal.service";
import { CartService } from "./../../../cart/cart.service";
import { CartSearch, Cart } from "./../../../_entities/cart.entity";
import { PagerService } from "./../../../_common/services/pager.service";
import { SourceLocationType, ApplicationInsightsService } from "../../../_common/services/application-insights.service";
import { AppInsightAddToCart } from "../../../_entities/app-insight-add-to-cart.entity";

@Component({
    selector: "alternate-related-parts",
    templateUrl: `./src/app/parts/details/alternate-related/alternate-related.component.html?v=${new Date().getTime()}`,
    providers: [PartsService, PagerService, ApplicationInsightsService]
})

export class AlternateRelatedComponent implements OnInit {
    errorMessage: any;
    imageBaseUrl: string;
    defaultImage: string;
    searchData: PartSearch = new PartSearch();
    @Input("parts-data") partsData: any = null;
    @Input("is-related-flag") isRelatedFlag: boolean = true;
    @Input("detail-part") detailPart: any = null;
    part: any;
    branchCode: string;
    addtoCartParameters: Cart = new Cart();
    // pager object
    pager: any = {};
    // paged items
    pagedAlternateRelatedParts: any[];
    relatedParts: any;
    alternaterelatedCoreOption: string = "NOCORER";
    source: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private partsService: PartsService,
        private title: Title,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private cartService: CartService,
        private notification: NotificationService,
        private nationalInventoryModalService: NationalInventoryModalService,
        private applicationInsightsService: ApplicationInsightsService) {
        //this.notification.hideNotification();
        this.imageBaseUrl = this.commonDataService.Images_Base_URL;
        this.defaultImage = this.commonDataService.Default_Image_URL;
        this.branchCode = this.commonDataService.Branch.code;
    }

    ngOnInit() {
        if (this.isRelatedFlag) {
            this.assignChartOptions();
        }
        this.source = this.isRelatedFlag ? SourceLocationType.RelatedParts : SourceLocationType.AlternateParts;
        console.log("Alternate-Related component parts data : ", this.partsData);
        this.setPage(1);
    }

    copyToClipBoard(contentToCopy: string) {
        Clipboard.copy(contentToCopy);
        this.notification.showNotification(`${contentToCopy} copied to clipboard.`, NotificationType.Success);
    }

    openNationalInventory(part: any) {
        part.type = this.isRelatedFlag ? 'related' : 'alternate'
        part.source = this.isRelatedFlag ? SourceLocationType[SourceLocationType.RelatedParts] : SourceLocationType[SourceLocationType.AlternateParts];
        this.nationalInventoryModalService.notifyNationalInventoryModal(part);
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

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.partsData.parts.length, page, 4);

        // get current page of items
        this.pagedAlternateRelatedParts = this.partsData.parts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    alternaterelatedCoreOptionChange(alternaterelatedCoreOption) {
        this.alternaterelatedCoreOption = alternaterelatedCoreOption;
    }

    addToCart(addToCartItem: any) {
        let trackingParameters: any;
        let source: string = '';
        if (this.isRelatedFlag) {
            trackingParameters = JSON.stringify({
                "AddedFrom": "RelatedPart",
                "PartId": this.detailPart.partId,
                "GroupRelatedPartId": this.detailPart.groupRelatedpartId,
                "BranchCode": this.commonDataService.Branch.code,
                "MaterialId": this.detailPart.rushPartNumber
            });
            source = SourceLocationType[SourceLocationType.RelatedParts];
        }
        else {
            trackingParameters = JSON.stringify({
                "AddedFrom": "AlternatePart",
                "PartId": this.detailPart.partId,
                "GroupPartId": this.detailPart.groupId,
                "BranchCode": this.commonDataService.Branch.code
            });
            source = SourceLocationType[SourceLocationType.AlternateParts];
        }

        let sourceName = "AlternateRelatedComponent_addToCart";
        let metricName = this.applicationInsightsService.getMetricValue(sourceName);
        let appInsightAddToCart = Object.assign(new AppInsightAddToCart(), {
            userId: this.commonDataService.UserId,
            customerNumber: this.commonDataService.Customer.customerNumber,
            customerName: this.commonDataService.Customer.customerName,
            branchNumber: this.commonDataService.Branch.code,
            cartNumber: this.commonDataService.CartId,
            source: source,
            plMetricName: sourceName
        });
        appInsightAddToCart.product = this.applicationInsightsService.getAppInsightParts(addToCartItem, JSON.stringify(appInsightAddToCart).length);
        this.applicationInsightsService.trackMetric(metricName, appInsightAddToCart);

        this.addtoCartParameters = Object.assign(new Cart(), {
            userId: this.commonDataService.UserId,
            branchCode: this.branchCode,
            customerNumber: this.commonDataService.Customer.customerNumber,
            partNumber: addToCartItem.rushPartNumber,
            description: addToCartItem.description,
            customerPrice: addToCartItem.customerPrice,
            quantity: addToCartItem.quantity,
            coreOption: this.alternaterelatedCoreOption,
            coreprice: addToCartItem.corePrice,
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
            TrackingParameters: trackingParameters,
            binLocation: addToCartItem.binLocation,
            QuantityAvailable: addToCartItem.quantityAvailable,
            CorePurchasePrice: addToCartItem.corePrice,
            isSpecialPricing: addToCartItem.isSpecialPricing
        });

        this.cartService.addToCart(this.addtoCartParameters)
            .then(carts => {
                if (carts.ErrorType != undefined && carts.ErrorType != null && carts.ErrorType != 200) {
                    this.notification.errorMessage("AlternateRelatedComponent", "addToCart", "addToCart", carts);
                }
                else {
                    this.notification.showNotification(`${addToCartItem.rushPartNumber} ${addToCartItem.description} with ${addToCartItem.quantity} quantity added successfully.`, NotificationType.Success);

                }
                console.log("Alternate-Related component AddtoCart : ", addToCartItem);
            },
            error => { });
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

    assignChartOptions() {
        if (this.partsData != undefined && this.partsData != null && this.partsData.parts.length > 0) {
            for (var i = 0; i < this.partsData.parts.length; i++) {
                let relevancePercent: number = this.partsData.parts[i].confidence;
                this.partsData.parts[i].chartOptions = this.getChartOptions(relevancePercent);
            }
        }
    }

    getChartOptions(relevancePercent: number) {
        let relevance: number = this.getRelevance(relevancePercent);
        return {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                margin: [-8, -8, -8, -8],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
            },
            exporting: {
                enabled: false
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    size: '80%',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                states: {
                    hover: {
                        enabled: false
                    }
                },
                animation: false,
                borderWidth: 1,
                borderColor: '#EEB111',
                showInLegend: false,
                type: 'pie',
                data: [{
                    y: relevance,
                    color: '#EEB111'
                }, {
                    y: (100 - relevance),
                    color: '#FAE894'
                }]
            }],
            credits: {
                enabled: false
            }
        };
    }

    getRelevance(relevancePercent: number) {
        if (relevancePercent <= 10) {
            return 10;
        }
        else if (relevancePercent <= 20) {
            return 20;
        }
        else if (relevancePercent <= 30) {
            return 30;
        }
        else if (relevancePercent <= 40) {
            return 40;
        }
        else if (relevancePercent <= 50) {
            return 50;
        }
        else if (relevancePercent <= 60) {
            return 60;
        }
        else if (relevancePercent <= 70) {
            return 70;
        }
        else if (relevancePercent <= 80) {
            return 80;
        }
        else if (relevancePercent <= 90) {
            return 90;
        }
        else {
            return 100;
        }
    }
}
