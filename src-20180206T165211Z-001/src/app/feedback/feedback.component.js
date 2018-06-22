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
var feedback_service_1 = require("./feedback.service");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var common_data_service_1 = require("./../_common/services/common-data.service");
var loader_service_1 = require("./../_common/services/loader.service");
var notification_service_1 = require("./../_common/services/notification.service");
var feedback_entity_1 = require("./../_entities/feedback.entity");
var common_1 = require("@angular/common");
var FeedbackComponent = (function () {
    function FeedbackComponent(loader, activatedRoute, feedbackService, title, router, location, changeDetectorRef, commonDataService, notification) {
        this.loader = loader;
        this.activatedRoute = activatedRoute;
        this.feedbackService = feedbackService;
        this.title = title;
        this.router = router;
        this.location = location;
        this.changeDetectorRef = changeDetectorRef;
        this.commonDataService = commonDataService;
        this.notification = notification;
        this.feedbackinput = new feedback_entity_1.FeedbackInput();
        title.setTitle("Feedback - Parts Link");
    }
    FeedbackComponent.prototype.ngOnInit = function () { };
    FeedbackComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
    };
    FeedbackComponent.prototype.sendFeedback = function (feedbackmessage) {
        var _this = this;
        this.loader.loading = true;
        this.feedbackinput = Object.assign(new feedback_entity_1.FeedbackInput(), {
            customerNumber: this.commonDataService.Customer.customerNumber != null ? this.commonDataService.Customer.customerNumber : this.commonDataService.DefaultCustomer.customerNumber,
            branchCode: this.commonDataService.Branch.code,
            partSearchTerm: this.activatedRoute.snapshot.queryParams['partSearchTerm'],
            previousPageUrl: this.activatedRoute.snapshot.queryParams['previousPageUrl'],
            message: feedbackmessage
        });
        this.feedbackmessage = feedbackmessage;
        this.feedbackService.sendFeedback(this.feedbackinput)
            .then(function (f) {
            _this.referencenumber = f.id;
            if (f.ErrorType != undefined && f.ErrorType != null && f.ErrorType != 200) {
                _this.loader.loading = false;
                _this.notification.errorMessage("FeedbackComponent", "sendFeedback", "sendFeedback", f);
            }
            else {
                _this.notification.showNotification("Feedback sent successfully with reference number " + _this.referencenumber + ".", notification_service_1.NotificationType.Success);
                _this.feedbackmessage = "";
                _this.loader.loading = false;
                _this.location.back();
            }
            console.log("feedback Data : ", f);
        }, function (error) { });
    };
    FeedbackComponent.prototype.cancel = function () {
        this.location.back();
    };
    return FeedbackComponent;
}());
FeedbackComponent = __decorate([
    core_1.Component({
        templateUrl: "./src/app/feedback/feedback.component.html?v=" + new Date().getTime()
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService,
        router_1.ActivatedRoute,
        feedback_service_1.FeedbackService,
        platform_browser_1.Title,
        router_1.Router,
        common_1.Location,
        core_1.ChangeDetectorRef,
        common_data_service_1.CommonDataService,
        notification_service_1.NotificationService])
], FeedbackComponent);
exports.FeedbackComponent = FeedbackComponent;
//# sourceMappingURL=feedback.component.js.map