import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from "@angular/core";
import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";
import { CommonDataService } from "./../_common/services/common-data.service";
import { VendorsModalComponent } from "./../search/modal/vendors/vendors.component";
import { VendorsService } from "./../search/modal/vendors/vendors.service";
declare var jQuery: any;

@Component({
    selector: "vendor-panel",
    templateUrl: `./src/app/vendor/vendor.component.html?v=${new Date().getTime()}`
})

export class VendorComponent implements OnInit, OnDestroy {

    @ViewChild('vendorsModal') vendorsModalComponent: VendorsModalComponent;
    randomNumber: number = new Date().getTime();
    vendorNumber: string = "";
    advVendorName: string = "";
    advVendorCity: string = "";
    advVendorState: string = "";
    advVendorPostalCode: string = "";
    advVendorPhoneNumber: string = "";
    hasMessage: boolean = false;
    vendorMesssage: string = "";
    isDefaultVendorChecked: boolean = true;
    noRecordFlag: boolean = false;

    @Output() callbackVendorSelect: EventEmitter<any> = new EventEmitter();

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private changeDetectorRef: ChangeDetectorRef,
        private vendorsService: VendorsService,
        private elementRef: ElementRef
    ) {
    }

    ngOnInit() {
        jQuery('#vendorSearchTabs a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            if (e.currentTarget.hash === "#pnlAdvancedVendorSearch") {
                this.elementRef.nativeElement.querySelector('input#advVendorName').focus();
            }
            else {
                this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
            }
        });
    }
    viewFavorites() {
        jQuery('body').on('shown.bs.modal', '#favoriteVendorsModal', function () {
            jQuery('input:visible:enabled:first', this).focus();
        });
    }

    vendorSearch() {
        if (this.vendorNumber || this.advVendorName || this.advVendorCity || this.advVendorState || this.advVendorPostalCode || this.advVendorPhoneNumber) {
            this.hasMessage = false;
            this.vendorMesssage = "";
            this.loader.loading = true;
            console.log("Vendor component vendor number: ", this.vendorNumber);
            this.vendorsService.getVendors(this.vendorNumber, this.advVendorName, "", "", this.advVendorCity, this.advVendorState, this.advVendorPostalCode, this.advVendorPhoneNumber)
                .then(c => {
                    if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                        this.notification.errorMessage("VendorComponent", "vendorSearch", "getVendors", c);
                    }
                    else {
                        if (c.vendors == null || c.vendors.length == 0) {
                            this.hasMessage = true;
                            this.vendorMesssage = "No vendor found";
                        }
                        else {
                            this.hasMessage = false;
                            this.vendorMesssage = "";
                            if (c.vendors.length == 1) {
                                this.vendorsService.notifyVendorSelection({ data: c.vendors[0] });
                            }
                            else if (c.vendors.length > 1) {
                                this.vendorsService.notifyShowVendorModal({ data: c.vendors });
                            }
                        }
                    }
                    this.loader.loading = false;
                    console.log("Vendor component : ", c);
                },
                error => {
                    this.loader.loading = false;
                    this.hasMessage = false;
                    this.vendorMesssage = "";
                    this.elementRef.nativeElement.querySelector('input#txtVendorNumber').focus();
                });
        }
    }

    onVendorKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
        var regex = new RegExp("^[a-zA-Z0-9*]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    onVendorNameKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    }

    onPhoneNoKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    }

    onPostalCodeKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    }

    onCityKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    }

    onStateKeypress(event) {
        if (event.keyCode == 13) {
            this.vendorSearch();
        }
    }

    onTabClick(isAdvanced: boolean) {
        this.vendorNumber = '';
        this.advVendorName = '';
        this.advVendorCity = '';
        this.advVendorState = '';
        this.advVendorPostalCode = '';
        this.advVendorPhoneNumber = '';
        this.noRecordFlag = false;
    }

    onVendorKeydown(event) {
        if (event.keyCode == 9) {
            this.vendorSearch();
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }
}