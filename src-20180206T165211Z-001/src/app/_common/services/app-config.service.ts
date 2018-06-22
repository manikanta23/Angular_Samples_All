import { Injectable, Inject } from "@angular/core";
import { AppConfig } from "./../../_entities/app-config.entity";
import { CommonDataService } from "./common-data.service";

@Injectable()
export class AppConfigService {
    constructor(
        @Inject("api.config") private appConfig: AppConfig,
        private commonDataService: CommonDataService
    ) {
        console.log("Injected config:", this.appConfig);
        this.clearLocalStorage();
        sessionStorage.setItem("DefaultCustomer", JSON.stringify({ customerName: "Cash Customer", customerNumber: this.appConfig.cashCustomerId }));
        sessionStorage.setItem("DefaultBranch", JSON.stringify({ name: this.appConfig.defaultBranchName, code: this.appConfig.defaultBranch }));
        sessionStorage.setItem("API_URL", this.appConfig.apiUrl);
        sessionStorage.setItem("CatalogSearchUrl", this.appConfig.catalogSearchUrl);
        sessionStorage.setItem("App_Insights_Instrumentation_Key", this.appConfig.applicationInsightsKey);
        sessionStorage.setItem("AppVersion", this.appConfig.appVersion);
        sessionStorage.setItem("Notification_Time_Interval_In_Min", this.appConfig.notificationTimeIntervalInMin);
        sessionStorage.setItem("Price_Override_Factor", this.appConfig.priceOverrideFactor);
    }

    clearLocalStorage() {
        let removeKeyValue: string[] = ["DefaultCustomer", "DefaultBranch", "API_URL", "App_Insights_Instrumentation_Key"];
        for (var key in removeKeyValue) {
            let localKey = removeKeyValue[key];
            sessionStorage.removeItem(localKey);
        }
    }
}