import highcharts = require("highcharts");
import { NgModule, ErrorHandler, Injector } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import 'rxjs/Rx';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Http, XHRBackend, RequestOptions } from "@angular/http";
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { AppInsightsModule } from 'ng2-appinsights';
import { ChartModule } from 'angular2-highcharts';
import { PopoverModule } from 'ngx-popover';
import { AccordionModule } from 'ngx-accordion';

//base
import { AppComponent } from "./app.component";
import { routing } from "./app.routes";

//common
import { AuthGuard } from "./_common/auth-guard";
import { CustomErrorHandler } from "./_common/custom-error-handler";

//common directives
import { DefaultImageDirective } from "./_common/directives/image-error.directive";
import { CustomerNumberFilterPipe } from "./_common/pipes/customer-number-filter.pipe";
import { NotificationTimeFilterPipe } from "./_common/pipes/notification-time-filter.pipe";
import { PostalCodeFilterPipe } from "./_common/pipes/postal-code-filter.pipe";
import { TelephoneNumberFilterPipe } from "./_common/pipes/telephone-number-filter.pipe";

//common services
import { AppConfigService } from './_common/services/app-config.service';
import { HttpService } from "./_common/services/http.service";
import { AuthenticationService } from "./_common/services/authentication.service";
import { PagerService } from "./_common/services/pager.service";
import { LoaderService } from "./_common/services/loader.service";
import { NotificationService } from "./_common/services/notification.service";
import { CommonDataService } from "./_common/services/common-data.service";
import { ApplicationInsightsService } from "./_common/services/application-insights.service";

//parts
import { PartsComponent } from "./parts/parts.component";
import { PartsService } from "./parts/parts.service";
import { PartsListComponent } from "./parts/list/list.component";
import { PartsDetailsComponent } from "./parts/details/details.component";
import { AlternateRelatedComponent } from "./parts/details/alternate-related/alternate-related.component";
import { NationalInventoryComponent } from "./parts/details/national-inventory/national-inventory.component";
import { PriceVerifyComponent } from "./parts/details/price-verify/price-verify.component";


//feedback
import { FeedbackComponent } from "./feedback/feedback.component";
import { FeedbackService } from "./feedback/feedback.service";

//branches
import { BranchComponent } from "./branch/branch.component";
import { BranchService } from "./branch/branch.service";

//search
import { HeaderSearchComponent } from "./search/header/header-search.component";
import { PartsSearchComponent } from "./search/parts/parts-search.component";
import { FavouritesModalComponent } from "./search/modal/favourites/favourites.component";
import { FavouritesFilterPipe } from "./search/modal/favourites/favourites-filter.pipe";
import { FavouritesService } from "./search/modal/favourites/favourites.service";
import { PartsSearchService } from "./search/parts/parts-search.service";
import { CustomerModalComponent } from "./search/modal/customer/customer.component";
import { NationalInventoryService } from "./parts/details/national-inventory/national-inventory.service";
import { NationalInventoryModalService } from "./parts/details/national-inventory/national-inventory-modal.service";
import { CustomerFilterPipe } from "./customer/customer-filter.pipe";
import { CustomerModalService } from "./search/modal/customer/customer.service";
import { FavouriteVendorsModalComponent } from "./search/modal/favourite-vendors/favourite-vendors.component";
import { VendorsService } from "./search/modal/vendors/vendors.service";
import { VendorsModalComponent } from "./search/modal/vendors/vendors.component";
import { CreatePartModalComponent } from "./search/modal/create-part/create-part.component";
import { CouponService } from "./search/modal/coupon/coupon.service";
import { CouponModalComponent } from "./search/modal/coupon/coupon.component";


//users
import { UserListComponent } from "./user/list/user-list.component";
import { UserDetailsComponent } from "./user/details/user-details.component";
import { UserService } from "./user/user.service";

// pipes
import { ManufacturerFilterPipe } from './parts/list/pipe.component';
import { InventoryFilterPipe } from './parts/details/national-inventory/national-inventory-filter.pipe';

//carts
import { CartComponent } from "./cart/cart.component";
import { CartService } from "./cart/cart.service";
import { OpenCartComponent } from "./cart/open.cart.component";
import { HotFlagComponent } from './cart/procurement-modal/hot-flag.component';
import { KnownPartBuyoutComponent } from './cart/procurement-modal/known-part-buyout.component';
import { StockTransferOrderComponent } from './cart/procurement-modal/stock-transfer-order.component'

//part buyout
import { PartBuyoutModalComponent } from "./search/modal/partbuyout/partbuyout.component";

//checkout
import { CheckoutComponent } from "./checkout/checkout.component";

//customer
import { CustomerComponent } from "./customer/customer.component";
import { MscPayersComponent } from "./customer/mscpayers.component";

//login
import { LoginComponent } from "./login/login.component";

//order
import { OrderConfirmationComponent } from "./order-confirmation/order-confirmation.component";

//vendor
import { VendorComponent } from "./vendor/vendor.component";

//UserNotificationService
import { UserNotificationService } from "./notification/user.notification.service";

//coupon.component
import { CouponComponent } from "./coupon/coupon.component";
import { CouponManagementComponent } from "./coupon/coupon.management.component";
import { CouponFileImportComponent } from './coupon/coupon-file-import.component';
import { CouponDashboardService } from "./coupon/coupon-dashboard.service";

@NgModule({
    imports: [BrowserModule, routing, FormsModule, HttpModule, ReactiveFormsModule, Ng2AutoCompleteModule, AppInsightsModule, ChartModule.forRoot(highcharts), PopoverModule, AccordionModule],
    declarations: [
        //add pipes, directives and components here
        DefaultImageDirective,
        AppComponent,
        PartsSearchComponent,
        PartsComponent,
        PartsListComponent,
        PartsDetailsComponent,
        HeaderSearchComponent,
        BranchComponent,
        FavouritesModalComponent,
        CouponModalComponent,
        BranchComponent,
        ManufacturerFilterPipe,
        CartComponent,
        OpenCartComponent,
        HotFlagComponent,
        KnownPartBuyoutComponent,
        StockTransferOrderComponent,
        FeedbackComponent,
        PartBuyoutModalComponent,
        AlternateRelatedComponent,
        FavouritesFilterPipe,
        CustomerModalComponent,
        CustomerComponent,
        MscPayersComponent,
        CustomerFilterPipe,
        NationalInventoryComponent,
        InventoryFilterPipe,
        CheckoutComponent,
        LoginComponent,
        OrderConfirmationComponent,
        CustomerNumberFilterPipe,
        FavouriteVendorsModalComponent,
        VendorComponent,
        VendorsModalComponent,
        NotificationTimeFilterPipe,
        UserListComponent,
        UserDetailsComponent,
        PriceVerifyComponent,
        CreatePartModalComponent,
        PostalCodeFilterPipe,
        TelephoneNumberFilterPipe,
        CouponComponent,
        CouponManagementComponent,
        CouponFileImportComponent
    ],
    providers: [
        // add services here
        AppConfigService,
        AuthGuard,
        {
            provide: Http,
            useFactory: (backend: XHRBackend, options: RequestOptions, commonDataService: CommonDataService, injector: Injector) => {
                return new HttpService(backend, options, commonDataService, injector);
            },
            deps: [XHRBackend, RequestOptions, CommonDataService, Injector]
        },
        { provide: ErrorHandler, useClass: CustomErrorHandler },        
        AuthenticationService,
        PagerService,
        LoaderService,
        NotificationService,
        CommonDataService,
        PartsService,
        BranchService,
        FavouritesService,
        PartsSearchService,
        CartService,
        FeedbackService,
        CustomerModalService,
        NationalInventoryService,
        NationalInventoryModalService,
        VendorsService,
        UserNotificationService,
        UserService,
        ApplicationInsightsService,
        CouponService,
        CouponDashboardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
