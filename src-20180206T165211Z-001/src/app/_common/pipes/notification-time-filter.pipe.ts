import { Pipe, ChangeDetectorRef } from "@angular/core";
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Pipe({
    name: 'notificationTimeFilter',
    pure: false
})
export class NotificationTimeFilterPipe extends AsyncPipe {
    timer: Observable<string>;

    constructor(ref: ChangeDetectorRef) {
        super(ref);
    }

    transform(obj: any, args?: any[]): any {
        let msgDate = new Date(obj);
        if (msgDate instanceof Date) {

            if (!this.timer) {
                this.timer = this.getObservable(msgDate);
            }

            return super.transform(this.timer);//  (this.timer, args);
        }

        return super.transform(msgDate);//(obj, args);
    }

    private getObservable(obj: Date) {
        return Observable.interval(1000).startWith(0).map(() => {
            var result: string;
            // current time
            let today = new Date();
            let now = new Date().getTime();

            // time since message was sent in seconds
            let delta = (now - obj.getTime()) / 1000;

            // format string
            if (delta < 10) {
                result = 'now';
            }
            else if (delta < 60) { // sent in last minute
                result = 'few secs ago';
            }
            else if (delta < 3600) { // sent in last hour
                result = Math.floor(delta / 60) + ' mins ago';
            }
            else if (delta < 86400 && today.getDate() == obj.getDate() && today.getMonth() === obj.getMonth() && today.getFullYear() === obj.getFullYear()) { // sent on same day
                result = Math.floor(delta / 3600) + ' hrs ago';
            }
            else if (today.getDate() - obj.getDate() === 1 && today.getMonth() === obj.getMonth() && today.getFullYear() === obj.getFullYear()) { // sent yesterday
                result = 'yesterday at ' + this.getFormatedTime(obj);
            }
            else { // sent more than one day ago
                //result = Math.floor(delta / 86400) + ' days ago';
                result = this.getFormatedDate(obj) + " " + this.getFormatedTime(obj);
            }
            return result;
        });
    };

    private getFormatedDate(date) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let strDate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + ('0' + date.getDate()).slice(-2) + ", " + date.getFullYear();
        return strDate;
    }

    private getFormatedTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
}