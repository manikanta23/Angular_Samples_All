"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var parts_search_component_1 = require("./search/parts/parts-search.component");
var parts_component_1 = require("./parts/parts.component");
var cart_component_1 = require("./cart/cart.component");
var feedback_component_1 = require("./feedback/feedback.component");
var checkout_component_1 = require("./checkout/checkout.component");
var login_component_1 = require("./login/login.component");
var order_confirmation_component_1 = require("./order-confirmation/order-confirmation.component");
var user_list_component_1 = require("./user/list/user-list.component");
var coupon_component_1 = require("./coupon/coupon.component");
var coupon_management_component_1 = require("./coupon/coupon.management.component");
var coupon_file_import_component_1 = require("./coupon/coupon-file-import.component");
var auth_guard_1 = require("./_common/auth-guard");
var routes = [
    { path: "", component: parts_search_component_1.PartsSearchComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "login", component: login_component_1.LoginComponent },
    { path: "parts", component: parts_component_1.PartsComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "cart", component: cart_component_1.CartComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "feedback", component: feedback_component_1.FeedbackComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "parts/:searchTerm", component: parts_component_1.PartsComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "checkout", component: checkout_component_1.CheckoutComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "orderconfirmation", component: order_confirmation_component_1.OrderConfirmationComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "users", component: user_list_component_1.UserListComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "coupon", component: coupon_component_1.CouponComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "couponManagement", component: coupon_management_component_1.CouponManagementComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "couponFileImportSummary", component: coupon_file_import_component_1.CouponFileImportComponent, canActivate: [auth_guard_1.AuthGuard] },
    //NOTE:add your route above this line
    { path: "**", redirectTo: "" },
];
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routes.js.map