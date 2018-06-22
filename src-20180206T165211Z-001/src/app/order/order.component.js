"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var notification_service_1 = require("./../_common/services/notification.service");
var OrderComponent = (function () {
    function OrderComponent(title, notification) {
        this.title = title;
        this.notification = notification;
        title.setTitle("Order - Parts Link");
        //this.notification.hideNotification();
    }
    OrderComponent.prototype.ngOnInit = function () { };
    return OrderComponent;
}());
OrderComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/order/order.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [platform_browser_1.Title,
        notification_service_1.NotificationService])
], OrderComponent);
exports.OrderComponent = OrderComponent;
//# sourceMappingURL=order.component.js.map