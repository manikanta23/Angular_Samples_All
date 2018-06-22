import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { CartService } from "./cart.service";
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonDataService } from "./../_common/services/common-data.service";
import { CustomerSearch } from "./../_entities/customer-search.entity";
import { PartsSearchService } from "./../search/parts/parts-search.service";
import { CustomerModalService } from "./../search/modal/customer/customer.service";
import { PagerService } from "./../_common/services/pager.service";
import { LoaderService } from "./../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../_common/services/notification.service";

declare var jQuery: any;
import * as _ from "lodash";

@Component({
    selector: "open-cart-panel",
    templateUrl: `./src/app/cart/open.cart.component.html?v=${new Date().getTime()}`,
    providers: [PagerService]
})

export class OpenCartComponent implements OnInit, OnDestroy {

    openCarts: any = null;
    showOpenCartLoader: boolean = false;
    // pager object
    pager: any = {};
    // paged items
    pagedOpenCarts: any[];
    filteredOpenCarts: any[];

    filterByBranch: boolean = false;
    filterByCustomer: boolean = false;

    selectedBranchCode: string = this.commonDataService.Branch.code;
    selectedCustomerNumber: string = this.commonDataService.Customer.customerNumber;

    constructor(private loader: LoaderService,
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private cartService: CartService,
        private partsSearchService: PartsSearchService,
        private customerModalService: CustomerModalService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
        //this.notification.hideNotification();
    }

    subscription = this.commonDataService.commonDataUpdated.subscribe((d: any) => {
        this.selectedBranchCode = this.commonDataService.Branch.code;
        this.selectedCustomerNumber = this.commonDataService.Customer.customerNumber;

        //Once user logged in then show all open carts for user (i.e. at logged/first time dont apply any filter).
        //And if user searches any customer, then apply customer search filter.
        if ((this.selectedCustomerNumber != this.commonDataService.DefaultCustomer.customerNumber) && this.filterByCustomer == false)
        {
            this.filterByCustomer = true;
        }

        if (this.filterByCustomer || this.filterByBranch) {
            this.filterCart();
        }
    });

    ngOnInit() {
        this.getOpenCarts();
    }

    getOpenCarts(): void {

        this.showOpenCartLoader = true;
        this.cartService.getOpenCarts(this.commonDataService.UserId)
            .then(oc => {
                this.showOpenCartLoader = false;
                if (oc.ErrorType != undefined && oc.ErrorType != null && oc.ErrorType != 200) {
                    this.notification.errorMessage("OpenCartComponent", "getOpenCarts", "getOpenCarts", oc);
                }
                else {
                    this.openCarts = oc.openCarts;
                    this.filteredOpenCarts = oc.openCarts;
                    console.log("filteredOpenCarts Data : ", this.filteredOpenCarts);
                    this.setPage(1);
                }
                console.log("Open Carts Data : ", oc);
            },
            error => { this.showOpenCartLoader = false; });
    }

    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredOpenCarts.length, page, 10);

        // get current page of items
        this.pagedOpenCarts = this.filteredOpenCarts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    // filtering by branch and customer number 
    filterCart(): void {
        let branchCode = this.commonDataService.Branch.code;
        let customerNumber = this.commonDataService.Customer.customerNumber;
        let paddedCustomerNumber = _.padStart(customerNumber, 10, '0');
        let trimmedCustomerNumber = _.trimStart(customerNumber,'0');

        if (this.filterByBranch && this.filterByCustomer) {
            this.filteredOpenCarts = _.filter(<any[]>this.openCarts, function (row) {
                return row.branchCode == branchCode && (row.customerNumber == trimmedCustomerNumber || row.customerNumber == paddedCustomerNumber);
            });
        } else if (this.filterByBranch) {
            this.filteredOpenCarts = _.filter(<any[]>this.openCarts, function (row) {
                return row.branchCode == branchCode;
            });
        } else if (this.filterByCustomer) {
            this.filteredOpenCarts = _.filter(<any[]>this.openCarts, function (row) {
                return row.customerNumber == trimmedCustomerNumber || row.customerNumber == paddedCustomerNumber;
            });
        } else {
            this.filteredOpenCarts = this.openCarts;
        }
        this.setPage(1);
    }

    goToCart(cart: any) {

        //To check current customer and selected carts customer is same or not
        let customer = this.commonDataService.Customer;
        let mscPayer = this.commonDataService.MscPayer;

        if (cart.branchCode == this.commonDataService.Branch.code) {
            this.navigateTocart(cart, customer, mscPayer);
        }
        else {
            //1. change branch

            this.loader.loading = true;
            let allOriginalBranches = this.commonDataService.AllOriginalBranches;
            if (allOriginalBranches != null) {
                let branch = _.filter(<any[]>allOriginalBranches, function (row) {
                    return row.code == cart.branchCode;
                })[0];
                console.log("Branch component selected branch : ", branch);
                this.commonDataService.Branch = branch;

                if (branch != null && branch != undefined) {
                    this.navigateTocart(cart, customer, mscPayer);
                }
                else {
                    this.notification.showNotification("Branch of selected cart is not available.", NotificationType.Error);
                }
            }
            else {
                this.notification.showNotification("Branches not available. Please try refreshing the page.", NotificationType.Error);
            }
        }
    }
    navigateTocart(cart: any, customer: any, mscPayer: any) {
        //If current customer and selected carts customer is same or not
        if (cart.customerNumber == customer.customerNumber) {
            this.commonDataService.cleanCheckoutData();
            this.commonDataService.Customer = customer;
            this.commonDataService.MscPayer = mscPayer;
            this.commonDataService.CartId = cart.cartId;
            //navigate....
            this.router.navigate(['/cart']);
        }
        else {
            //search and change customer
            this.customerSearch(cart);
        }
    }

    customerSearch(cart: any) {
        if (cart.customerNumber) {
            this.loader.loading = true;

            let customerSearch: CustomerSearch = Object.assign(new CustomerSearch(), {
                CustomerType: "AG",
                CustomerNumber: cart.customerNumber,
                BranchCode: cart.branchCode,
                AccountGroups: ["Z001", "Z002"],
                CustomerName: "",
                City: "",
                State: "",
                PostalCode: "",
                PhoneNumber: "",
                UserId: this.commonDataService.UserId
            });

            this.partsSearchService.getCustomers(customerSearch)
                .then(c => {
                    let searchterm = this.activatedRoute.snapshot.queryParams['searchTerm'];
                    if (c.ErrorType != undefined && c.ErrorType != null && c.ErrorType != 200) {
                        this.notification.errorMessage("OpenCartComponent", "customerSearch", "getCustomers", c);
                    }
                    else {

                        if (c.customers.length == 1) {
                            this.commonDataService.Coupons = null;
                            this.commonDataService.CouponVendors = null;

                            //set customer
                            this.commonDataService.Customer = c.customers[0];
                            //set cart number
                            this.commonDataService.CartId = cart.cartId;
                            //set mscPayerchange
                            this.customerModalService.notifyShowMSCPayerCustomerModal({ data: c.customers[0] });
                            //navigate....
                            this.router.navigate(['/cart']);
                        }
                    }
                    this.loader.loading = false;
                    //this.changeDetectorRef.detectChanges();
                    console.log("Customer component : ", c);
                },
                error => { this.loader.loading = false; });
        }
    }

    ngOnDestroy() {
    }
}
