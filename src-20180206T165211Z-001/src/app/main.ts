import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";
import { CommonDataService } from "./_common/services/common-data.service";
import { AppConfig } from "./_entities/app-config.entity";

export function RunApplication(appsetting: any) {
    let appConfig = Object.assign(new AppConfig(), {
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
    
    platformBrowserDynamic([
        { provide: "api.config", useValue: appConfig }
    ]).bootstrapModule(AppModule, [CommonDataService])
        .then(success => console.log("Ng2 Bootstrap success"))
        .catch(err => console.error(err));
}