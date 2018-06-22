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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var ng2_appinsights_1 = require("ng2-appinsights");
var common_data_service_1 = require("./services/common-data.service");
var loader_service_1 = require("./services/loader.service");
var CustomErrorHandler = (function () {
    function CustomErrorHandler(http, appinsightsService, commonDataService, loader) {
        this.http = http;
        this.appinsightsService = appinsightsService;
        this.commonDataService = commonDataService;
        this.loader = loader;
    }
    CustomErrorHandler.prototype.handleError = function (error) {
        this.appinsightsService.trackException(error, "CustomErrorHandler", { "applicaion_Version": this.commonDataService.AppVersion });
        var hasRejection = error.rejection !== undefined && error.rejection !== null;
        var myError = {
            message: error.message,
            originalStack: error.originalStack,
            rejectionMessageId: hasRejection ? error.rejection.messageId : '',
            rejectionMessage: hasRejection ? error.rejection.message : '',
            stack: error.stack
        };
        console.log("Custom Error Handler : ", myError);
        this.loader.loading = false;
    };
    return CustomErrorHandler;
}());
CustomErrorHandler = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        ng2_appinsights_1.AppInsightsService,
        common_data_service_1.CommonDataService,
        loader_service_1.LoaderService])
], CustomErrorHandler);
exports.CustomErrorHandler = CustomErrorHandler;
//# sourceMappingURL=custom-error-handler.js.map