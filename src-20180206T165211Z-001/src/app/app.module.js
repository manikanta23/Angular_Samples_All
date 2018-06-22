"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var highcharts = require("highcharts");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
require("rxjs/Rx");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var ng2_auto_complete_1 = require("ng2-auto-complete");
var ng2_appinsights_1 = require("ng2-appinsights");
var angular2_highcharts_1 = require("angular2-highcharts");
var ngx_popover_1 = require("ngx-popover");
var ngx_accordion_1 = require("ngx-accordion");
//base
var app_component_1 = require("./app.component");
var app_routes_1 = require("./app.routes");
//common
var auth_guard_1 = require("./_common/auth-guard");
var custom_error_handler_1 = require("./_common/custom-error-handler");
//common directives
var image_error_directive_1 = require("./_common/directives/image-error.directive");
var customer_number_filter_pipe_1 = require("./_common/pipes/customer-number-filter.pipe");
var notification_time_filter_pipe_1 = require("./_common/pipes/notification-time-filter.pipe");
var postal_code_filter_pipe_1 = require("./_common/pipes/postal-code-filter.pipe");
var telephone_number_filter_pipe_1 = require("./_common/pipes/telephone-number-filter.pipe");
//common services
var app_config_service_1 = require("./_common/services/app-config.service");
var http_service_1 = require("./_common/services/http.service");
var authentication_service_1 = require("./_common/services/authentication.service");
var pager_service_1 = require("./_common/services/pager.service");
var loader_service_1 = require("./_common/services/loader.service");
var notification_service_1 = require("./_common/services/notification.service");
var common_data_service_1 = require("./_common/services/common-data.service");
var application_insights_service_1 = require("./_common/services/application-insights.service");
//parts
var parts_component_1 = require("./parts/parts.component");
var parts_service_1 = require("./parts/parts.service");
var list_component_1 = require("./parts/list/list.component");
var details_component_1 = require("./parts/details/details.component");
var alternate_related_component_1 = require("./parts/details/alternate-related/alternate-related.component");
var national_inventory_component_1 = require("./parts/details/national-inventory/national-inventory.component");
var price_verify_component_1 = require("./parts/details/price-verify/price-verify.component");
//feedback
var feedback_component_1 = require("./feedback/feedback.component");
var feedback_service_1 = require("./feedback/feedback.service");
//branches
var branch_component_1 = require("./branch/branch.component");
var branch_service_1 = require("./branch/branch.service");
//search
var header_search_component_1 = require("./search/header/header-search.component");
var parts_search_component_1 = require("./search/parts/parts-search.component");
var favourites_component_1 = require("./search/modal/favourites/favourites.component");
var favourites_filter_pipe_1 = require("./search/modal/favourites/favourites-filter.pipe");
var favourites_service_1 = require("./search/modal/favourites/favourites.service");
var parts_search_service_1 = require("./search/parts/parts-search.service");
var customer_component_1 = require("./search/modal/customer/customer.component");
var national_inventory_service_1 = require("./parts/details/national-inventory/national-inventory.service");
var national_inventory_modal_service_1 = require("./parts/details/national-inventory/national-inventory-modal.service");
var customer_filter_pipe_1 = require("./customer/customer-filter.pipe");
var customer_service_1 = require("./search/modal/customer/customer.service");
var favourite_vendors_component_1 = require("./search/modal/favourite-vendors/favourite-vendors.component");
var vendors_service_1 = require("./search/modal/vendors/vendors.service");
var vendors_component_1 = require("./search/modal/vendors/vendors.component");
var create_part_component_1 = require("./search/modal/create-part/create-part.component");
var coupon_service_1 = require("./search/modal/coupon/coupon.service");
var coupon_component_1 = require("./search/modal/coupon/coupon.component");
//users
var user_list_component_1 = require("./user/list/user-list.component");
var user_details_component_1 = require("./user/details/user-details.component");
var user_service_1 = require("./user/user.service");
// pipes
var pipe_component_1 = require("./parts/list/pipe.component");
var national_inventory_filter_pipe_1 = require("./parts/details/national-inventory/national-inventory-filter.pipe");
//carts
var cart_component_1 = require("./cart/cart.component");
var cart_service_1 = require("./cart/cart.service");
var open_cart_component_1 = require("./cart/open.cart.component");
var hot_flag_component_1 = require("./cart/procurement-modal/hot-flag.component");
var known_part_buyout_component_1 = require("./cart/procurement-modal/known-part-buyout.component");
var stock_transfer_order_component_1 = require("./cart/procurement-modal/stock-transfer-order.component");
//part buyout
var partbuyout_component_1 = require("./search/modal/partbuyout/partbuyout.component");
//checkout
var checkout_component_1 = require("./checkout/checkout.component");
//customer
var customer_component_2 = require("./customer/customer.component");
var mscpayers_component_1 = require("./customer/mscpayers.component");
//login
var login_component_1 = require("./login/login.component");
//order
var order_confirmation_component_1 = require("./order-confirmation/order-confirmation.component");
//vendor
var vendor_component_1 = require("./vendor/vendor.component");
//UserNotificationService
var user_notification_service_1 = require("./notification/user.notification.service");
//coupon.component
var coupon_component_2 = require("./coupon/coupon.component");
var coupon_management_component_1 = require("./coupon/coupon.management.component");
var coupon_file_import_component_1 = require("./coupon/coupon-file-import.component");
var coupon_dashboard_service_1 = require("./coupon/coupon-dashboard.service");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, app_routes_1.routing, forms_1.FormsModule, http_1.HttpModule, forms_1.ReactiveFormsModule, ng2_auto_complete_1.Ng2AutoCompleteModule, ng2_appinsights_1.AppInsightsModule, angular2_highcharts_1.ChartModule.forRoot(highcharts), ngx_popover_1.PopoverModule, ngx_accordion_1.AccordionModule],
        declarations: [
            //add pipes, directives and components here
            image_error_directive_1.DefaultImageDirective,
            app_component_1.AppComponent,
            parts_search_component_1.PartsSearchComponent,
            parts_component_1.PartsComponent,
            list_component_1.PartsListComponent,
            details_component_1.PartsDetailsComponent,
            header_search_component_1.HeaderSearchComponent,
            branch_component_1.BranchComponent,
            favourites_component_1.FavouritesModalComponent,
            coupon_component_1.CouponModalComponent,
            branch_component_1.BranchComponent,
            pipe_component_1.ManufacturerFilterPipe,
            cart_component_1.CartComponent,
            open_cart_component_1.OpenCartComponent,
            hot_flag_component_1.HotFlagComponent,
            known_part_buyout_component_1.KnownPartBuyoutComponent,
            stock_transfer_order_component_1.StockTransferOrderComponent,
            feedback_component_1.FeedbackComponent,
            partbuyout_component_1.PartBuyoutModalComponent,
            alternate_related_component_1.AlternateRelatedComponent,
            favourites_filter_pipe_1.FavouritesFilterPipe,
            customer_component_1.CustomerModalComponent,
            customer_component_2.CustomerComponent,
            mscpayers_component_1.MscPayersComponent,
            customer_filter_pipe_1.CustomerFilterPipe,
            national_inventory_component_1.NationalInventoryComponent,
            national_inventory_filter_pipe_1.InventoryFilterPipe,
            checkout_component_1.CheckoutComponent,
            login_component_1.LoginComponent,
            order_confirmation_component_1.OrderConfirmationComponent,
            customer_number_filter_pipe_1.CustomerNumberFilterPipe,
            favourite_vendors_component_1.FavouriteVendorsModalComponent,
            vendor_component_1.VendorComponent,
            vendors_component_1.VendorsModalComponent,
            notification_time_filter_pipe_1.NotificationTimeFilterPipe,
            user_list_component_1.UserListComponent,
            user_details_component_1.UserDetailsComponent,
            price_verify_component_1.PriceVerifyComponent,
            create_part_component_1.CreatePartModalComponent,
            postal_code_filter_pipe_1.PostalCodeFilterPipe,
            telephone_number_filter_pipe_1.TelephoneNumberFilterPipe,
            coupon_component_2.CouponComponent,
            coupon_management_component_1.CouponManagementComponent,
            coupon_file_import_component_1.CouponFileImportComponent
        ],
        providers: [
            // add services here
            app_config_service_1.AppConfigService,
            auth_guard_1.AuthGuard,
            {
                provide: http_1.Http,
                useFactory: function (backend, options, commonDataService, injector) {
                    return new http_service_1.HttpService(backend, options, commonDataService, injector);
                },
                deps: [http_1.XHRBackend, http_1.RequestOptions, common_data_service_1.CommonDataService, core_1.Injector]
            },
            { provide: core_1.ErrorHandler, useClass: custom_error_handler_1.CustomErrorHandler },
            authentication_service_1.AuthenticationService,
            pager_service_1.PagerService,
            loader_service_1.LoaderService,
            notification_service_1.NotificationService,
            common_data_service_1.CommonDataService,
            parts_service_1.PartsService,
            branch_service_1.BranchService,
            favourites_service_1.FavouritesService,
            parts_search_service_1.PartsSearchService,
            cart_service_1.CartService,
            feedback_service_1.FeedbackService,
            customer_service_1.CustomerModalService,
            national_inventory_service_1.NationalInventoryService,
            national_inventory_modal_service_1.NationalInventoryModalService,
            vendors_service_1.VendorsService,
            user_notification_service_1.UserNotificationService,
            user_service_1.UserService,
            application_insights_service_1.ApplicationInsightsService,
            coupon_service_1.CouponService,
            coupon_dashboard_service_1.CouponDashboardService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map