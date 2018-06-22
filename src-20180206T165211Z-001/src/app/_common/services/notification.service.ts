import { Injectable } from '@angular/core';
import { ErrorInformation } from "./../../_entities/error-information.entity";

@Injectable()
export class NotificationService {
    public show: boolean = false;
    public type: NotificationType;
    public message: any;
    public isMultiline: boolean = false;


    public showNotification(message: string, type: NotificationType) {
        let arr: Array<{ message: string, type: NotificationType }> = [{ message: message, type: type }];
        this.show = true;
        this.type = type;
        this.message = arr;
        setTimeout(() => {
            this.show == false;
            this.hideNotification();
        }, 10000);
    }

    public showMultilineNotification(messageArray: Array<{ message: string, type: NotificationType }>) {
        this.show = true;
        this.isMultiline = true;
        this.type = NotificationType.MultiLine;
        this.message = messageArray;
        setTimeout(() => {
            this.show == false;
            this.hideNotification();
        }, 10000);
    }

    public showNotificationWithoutTimeout(message: string, type: NotificationType) {
        let arr: Array<{ type: NotificationType, message: string }> = [{ type: type, message: message }];
        this.show = true;
        this.isMultiline = false;
        this.type = type;
        this.message = arr;
    }

    public hideNotification() {
        this.show = false;
        this.message = "";
    }

    errorMessage(componentName: string, componentFunctionName: string, serviceFunctionName: string, res: ErrorInformation) {
        let commonMsg: string = " If refreshing the page doesn't help, please submit a feedback form.";
        switch (res.ErrorType) {
            case 0:
                this.showNotificationWithoutTimeout("Error has occurred while processing your request. Please contact your system administrator.", NotificationType.Error);
                break;
            case 401:
                //this.showNotification(res.Message + "  Please wait, system will re-authenticate the user and redirect to the current screen.", NotificationType.Error);
                break;
            case 403:
                this.showNotificationWithoutTimeout(res.Message, NotificationType.Error);
                break;
            default:
                switch (componentName + "_" + componentFunctionName + "_" + serviceFunctionName) {
                    case "BranchComponent_GetUserBranchesForOrdering_GetUserBranchesForOrdering":
                        this.showNotificationWithoutTimeout("Error:1, An error occurred during the get branches request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_getDefaultBranchValue_CheckDefaultBranchValue":
                        this.showNotificationWithoutTimeout("Error:2, An error occurred during the get default branch value request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_getCarts_getCarts":
                        this.showNotificationWithoutTimeout("Error:3, An error occurred during the get carts request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_setCartAdjustedPrice_UpdateForAdjustedPrice":
                        this.showNotificationWithoutTimeout("Error:4, An error occurred during the adjust price request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_removeCartItems_DeleteCartItem":
                        this.showNotificationWithoutTimeout("Error:5, An error occurred during the remove cart item request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_updateCartItems_UpdateCartItem":
                        this.showNotificationWithoutTimeout("Error:6, An error occurred during the update cart item request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_getCarts_getCarts":
                        this.showNotificationWithoutTimeout("Error:7, An error occurred during the get carts request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_getAlternateShippingCustomers_getCustomers":
                        this.showNotificationWithoutTimeout("Error:8, An error occurred during the get alternate shipping addresses request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_getBillingTypeCustomers_getCustomers":
                        this.showNotificationWithoutTimeout("Error:9, An error occurred during the get customer's billing types request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_placeOrder_placeOrder":
                        this.showNotificationWithoutTimeout("Error:10, An error occurred during the place order request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_UpdateCartItem_UpdateCartItem":
                        this.showNotificationWithoutTimeout("Error:11, An error occurred during the update cart item request." + commonMsg, NotificationType.Error);
                        break;
                    case "CustomerComponent_customerSearch_getCustomers":
                        this.showNotificationWithoutTimeout("Error:12, An error occurred during the get customer request." + commonMsg, NotificationType.Error);
                        break;
                    case "FeedbackComponent_sendFeedback_sendFeedback":
                        this.showNotificationWithoutTimeout("Error:13, An error occurred during the send feedback request." + commonMsg, NotificationType.Error);
                        break;
                    case "LoginComponent_getToken_getToken":
                        this.showNotificationWithoutTimeout("Error:14, An error occurred during the get token request." + commonMsg, NotificationType.Error);
                        break;
                    case "OrderConfirmationComponent_GetOrderConfirmation_getOrderConfirmationResult":
                        this.showNotificationWithoutTimeout("Error:15, An error occurred during the get order confirmation result request." + commonMsg, NotificationType.Error);
                        break;
                    case "AlternateRelatedComponent_addToCart_addToCart":
                        this.showNotificationWithoutTimeout("Error:16, An error occurred during the add to cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsDetailsComponent_getRelatedParts_getRelatedParts":
                        this.showNotificationWithoutTimeout("Error:17, An error occurred during the get related parts request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsDetailsComponent_getAlternateParts_getAlternateParts":
                        this.showNotificationWithoutTimeout("Error:18, An error occurred during the get alternate parts request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsDetailsComponent_getNotes_getNotes":
                        this.showNotificationWithoutTimeout("Error:19, An error occurred during the get notes request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsDetailsComponent_createNotes_createNotes":
                        this.showNotificationWithoutTimeout("Error:20, An error occurred during the create note request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsDetailsComponent_addToCart_addToCart":
                        this.showNotificationWithoutTimeout("Error:21, An error occurred during the add to cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "NationalInventoryComponent_getInventory_getInventory":
                        this.showNotificationWithoutTimeout("Error:22, An error occurred during the get national inventory request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsComponent_getParts_getParts":
                        this.showNotificationWithoutTimeout("Error:23, An error occurred during the get parts request." + commonMsg, NotificationType.Error);
                        break;
                    case "HeaderSearchComponent_getCarts_getCarts":
                        this.showNotificationWithoutTimeout("Error:24, An error occurred during the get carts request." + commonMsg, NotificationType.Error);
                        break;
                    case "HeaderSearchComponent_removeCartItems_DeleteCartItem":
                        this.showNotificationWithoutTimeout("Error:25, An error occurred during the remove cart item request." + commonMsg, NotificationType.Error);
                        break;
                    case "HeaderSearchComponent_removeCarts_DeleteCart":
                        this.showNotificationWithoutTimeout("Error:26, An error occurred during the remove cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "FavouritesModalComponent_getFavourites_getFavourites":
                        this.showNotificationWithoutTimeout("Error:27, An error occurred during the get favorites request." + commonMsg, NotificationType.Error);
                        break;
                    case "FavouritesModalComponent_removeFavourites_DeleteFavourites":
                        this.showNotificationWithoutTimeout("Error:28, An error occurred during the remove customer from favorite request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartBuyoutModalComponent_addToCart_addToCart":
                        this.showNotificationWithoutTimeout("Error:29, An error occurred during the add part buyout to cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsSearchComponent_getCartCount_CartCount":
                        this.showNotificationWithoutTimeout("Error:30, An error occurred during the get cart count request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsSearchComponent_addToFavourites_CreateFavourites":
                        this.showNotificationWithoutTimeout("Error:31, An error occurred during the add to favorites request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsSearchComponent_removeFavourites_DeleteFavourites":
                        this.showNotificationWithoutTimeout("Error:32, An error occurred during the remove customer from favorite request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartsSearchComponent_partSearch_getPartCount":
                        this.showNotificationWithoutTimeout("Error:33, An error occurred during the get part count request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_getCustomerDetails_getCustomers":
                        this.showNotificationWithoutTimeout("Error:34, An error occurred during the get customer's details request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_DeleteCartItem_DeleteCartItem":
                        this.showNotificationWithoutTimeout("Error:35, An error occurred during the remove Freight/Delivery line request." + commonMsg, NotificationType.Error);
                        break;
                    case "CheckoutComponent_addToCart_addToCart":
                        this.showNotificationWithoutTimeout("Error:36, An error occurred during the add to cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "VendorComponent_vendorSearch_getVendors":
                        this.showNotificationWithoutTimeout("Error:37, An error occurred during the get vendors request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartBuyoutModalComponent_removeFavouriteVendors_deleteFavouriteVendors":
                        this.showNotificationWithoutTimeout("Error:38, An error occurred during the remove vendor from favorite request." + commonMsg, NotificationType.Error);
                        break;
                    case "PartBuyoutModalComponent_addToFavouriteVendors_createFavouriteVendors":
                        this.showNotificationWithoutTimeout("Error:39, An error occurred during the add to favorites request." + commonMsg, NotificationType.Error);
                        break;
                    case "FavouriteVendorsModalComponent_getFavouriteVendors_getFavouriteVendors":
                        this.showNotificationWithoutTimeout("Error:40, An error occurred during the get favorite vendors request." + commonMsg, NotificationType.Error);
                        break;
                    case "FavouriteVendorsModalComponent_removeFavouriteVendors_deleteFavouriteVendors":
                        this.showNotificationWithoutTimeout("Error:41, An error occurred during the remove vendor from favorite request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_initBuyout_getVendorPrice":
                        this.showNotificationWithoutTimeout("Error:42, An error occurred during the get Vendor Price request." + commonMsg, NotificationType.Error);
                        break;
                    case "NationalInventoryComponent_addToCart_getVendorPrice":
                        this.showNotificationWithoutTimeout("Error:43, An error occurred during the get Vendor Price request." + commonMsg, NotificationType.Error);
                        break;
                    case "NationalInventoryComponent_addToCart_addToCart":
                        this.showNotificationWithoutTimeout("Error:44, An error occurred during the add to cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "NationalInventoryComponent_getParts_getParts":
                        this.showNotificationWithoutTimeout("Error:45, An error occurred during the get parts request." + commonMsg, NotificationType.Error);
                        break;
                    case "HeaderSearchComponent_partSearch_getPartCount":
                        this.showNotificationWithoutTimeout("Error:46, An error occurred during the get part count request." + commonMsg, NotificationType.Error);
                        break;
                    case "NationalInventoryComponent_addToCart_DeleteCartItem":
                        this.showNotificationWithoutTimeout("Error:47, An error occurred during the remove cart item request." + commonMsg, NotificationType.Error);
                        break;
                    case "OrderConfirmationComponent_downloadInvoice_downloadInvoice":
                        this.showNotificationWithoutTimeout("Error:48, An error occurred during the download invoice request." + commonMsg, NotificationType.Error);
                        break;
                    case "OrderConfirmationComponent_getPickTicket_getPickTicket":
                        this.showNotificationWithoutTimeout("Error:49, An error occurred during the get pick ticket request." + commonMsg, NotificationType.Error);
                        break;
                    case "OrderConfirmationComponent_getPrintTicket_getPrintTicket":
                        this.showNotificationWithoutTimeout("Error:50, An error occurred during the get print ticket request." + commonMsg, NotificationType.Error);
                        break;
                    case "AppComponent_removeCarts_DeleteCart":
                        this.showNotificationWithoutTimeout("Error:51, An error occurred during the remove cart request." + commonMsg, NotificationType.Error);
                        break;
                    case "AppComponent_showDailySalesReport_getUserSalesMetrics":
                        this.showNotificationWithoutTimeout("Error:52, An error occurred during the user sales metrics request." + commonMsg, NotificationType.Error);
                        break;
                    case "AppComponent_getUserNotifications_getNotifications":
                        this.showNotificationWithoutTimeout("Error:53, An error occurred during the user notification request." + commonMsg, NotificationType.Error);
                        break;
                    case "AppComponent_markNotification_markNotification":
                        this.showNotificationWithoutTimeout("Error:54, An error occurred during the mark notification as read request." + commonMsg, NotificationType.Error);
                        break;
                    case "AppComponent_markAllNotification_markAllNotification":
                        this.showNotificationWithoutTimeout("Error:54, An error occurred during the mark all notifications as read request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_getUsers_getUsers":
                        this.showNotificationWithoutTimeout("Error:55, An error occurred during the get user request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_updateUser_updateUser":
                        this.showNotificationWithoutTimeout("Error:56, An error occurred during the update user request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_createUser_createUser":
                        this.showNotificationWithoutTimeout("Error:57, An error occurred during the create user request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_syncUserWithSap_syncUserWithSap":
                        this.showNotificationWithoutTimeout("Error:58, An error occurred during the snyc user with SAP request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_syncUserWithSap_getUserEntityRoles":
                        this.showNotificationWithoutTimeout("Error:59, An error occurred during the get entity roles (snyc user with SAP) request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_getUserRoles_getUserRoles":
                        this.showNotificationWithoutTimeout("Error:60, An error occurred during the get user roles request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_getUserRoles_getUserEntityRoles":
                        this.showNotificationWithoutTimeout("Error:61, An error occurred during the get entity roles (user roles) request." + commonMsg, NotificationType.Error);
                        break;
                    case "UserListComponent_searchUsers_searchUsers":
                        this.showNotificationWithoutTimeout("Error:62, An error occurred during the search user request." + commonMsg, NotificationType.Error);
                        break;
                    case "MscPayersComponent_ngOnInit_getMscPayers":
                        this.showNotificationWithoutTimeout("Error:63, An error occurred during the mscpayers search request." + commonMsg, NotificationType.Error);
                        break;
                    case "PriceVerifyComponent_mscPriceVerification_getMscPriceVerification":
                        this.showNotificationWithoutTimeout("Error:64, An error occurred during the mscpayers search request." + commonMsg, NotificationType.Error);
                    case "CartComponent_hidePricingAlertPopup_SetUserIsPricingAlert":
                        this.showNotificationWithoutTimeout("Error:65, An error occurred during the user price verification request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_searchCoupons_searchCoupons":
                        this.showNotificationWithoutTimeout("Error:66, An error occurred during coupon search request." + commonMsg, NotificationType.Error);
                        break;
                    case "CartComponent_addCouponToCart_addCouponToCart":
                        this.showNotificationWithoutTimeout("Error:67, An error occurred during coupon apply request." + commonMsg, NotificationType.Error);
                        break;
                    case "OpenCartComponent_getOpenCarts_getOpenCarts":
                        this.showNotificationWithoutTimeout("Error:68, An error occurred during get open carts request." + commonMsg, NotificationType.Error);
                        break;
                    case "OpenCartComponent_customerSearch_getCustomers":
                        this.showNotificationWithoutTimeout("Error:69, An error occurred during customer's details request." + commonMsg, NotificationType.Error);
                        break;
                    case "OrderConfirmationComponent_downloadPurchaseOrder_downloadPurchaseOrder":
                        this.showNotificationWithoutTimeout("Error:70, An error occurred during the Create PO request." + commonMsg, NotificationType.Error);
                        break;
                    default:
                        this.showNotificationWithoutTimeout("An unusual error occurred. Please submit a feedback form so we can check into it.", NotificationType.Error);
                        break;
                }
                break;
        }
    }
}
export enum NotificationType {

    Success = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Abort = 4,
    MultiLine = 5
}