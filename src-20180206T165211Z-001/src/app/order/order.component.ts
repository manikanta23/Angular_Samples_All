import { Component, OnInit, Input } from "@angular/core";

import { Title } from '@angular/platform-browser';
import { NotificationService, NotificationType } from "./../_common/services/notification.service";

@Component({
    templateUrl: `./src/app/order/order.component.html?v=${new Date().getTime()}`
})
    
export class OrderComponent implements OnInit {

    constructor(private title: Title,
        private notification: NotificationService) {
        title.setTitle("Order - Parts Link");
        //this.notification.hideNotification();
    }

    ngOnInit() { }
}