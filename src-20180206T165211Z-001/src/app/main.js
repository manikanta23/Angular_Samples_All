"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app.module");
var common_data_service_1 = require("./_common/services/common-data.service");
var app_config_entity_1 = require("./_entities/app-config.entity");
function RunApplication(appsetting) {
    var appConfig = Object.assign(new app_config_entity_1.AppConfig(), {
        apiUrl: appsetting.apiUrl,
        defaultBranch: appsetting.defaultBranch,
        defaultBranchName: appsetting.defaultBranchName,
        cashCustomerId: appsetting.cashCustomerId,
        applicationInsightsKey: appsetting.applicationInsightsKey,
        notificationTimeIntervalInMin: appsetting.notificationTimeIntervalInMin,
        priceOverrideFactor: appsetting.priceOverrideFactor,
        catalogSearchUrl: appsetting.catalogSearchUrl,
        appVersion: appsetting.appVersion
    });
    platform_browser_dynamic_1.platformBrowserDynamic([
        { provide: "api.config", useValue: appConfig }
    ]).bootstrapModule(app_module_1.AppModule, [common_data_service_1.CommonDataService])
        .then(function (success) { return console.log("Ng2 Bootstrap success"); })
        .catch(function (err) { return console.error(err); });
}
exports.RunApplication = RunApplication;
//# sourceMappingURL=main.js.map