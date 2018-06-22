import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PartsSearchComponent } from "./search/parts/parts-search.component";
import { PartsComponent } from "./parts/parts.component";
import { BranchComponent } from "./branch/branch.component";
import { CartComponent } from "./cart/cart.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { LoginComponent } from "./login/login.component";
import { OrderConfirmationComponent } from "./order-confirmation/order-confirmation.component";
import { UserListComponent } from "./user/list/user-list.component";
import { CouponComponent } from './coupon/coupon.component';
import { CouponManagementComponent } from './coupon/coupon.management.component';
import { CouponFileImportComponent } from './coupon/coupon-file-import.component';
import { AuthGuard } from "./_common/auth-guard";

const routes: Routes = [
    { path: "", component: PartsSearchComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "parts", component: PartsComponent, canActivate: [AuthGuard] },
    { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
    { path: "feedback", component: FeedbackComponent, canActivate: [AuthGuard] },
    { path: "parts/:searchTerm", component: PartsComponent, canActivate: [AuthGuard] },
    { path: "checkout", component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: "orderconfirmation", component: OrderConfirmationComponent, canActivate: [AuthGuard] },
    { path: "users", component: UserListComponent, canActivate: [AuthGuard] },
    { path: "coupon", component: CouponComponent, canActivate: [AuthGuard] },
    { path: "couponManagement", component: CouponManagementComponent, canActivate: [AuthGuard] },
    { path: "couponFileImportSummary", component: CouponFileImportComponent, canActivate: [AuthGuard] },
    //NOTE:add your route above this line
    { path: "**", redirectTo: "" },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);