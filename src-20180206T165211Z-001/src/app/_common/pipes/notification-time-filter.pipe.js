"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var common_1 = require("@angular/common");
var Observable_1 = require("rxjs/Observable");
var NotificationTimeFilterPipe = (function (_super) {
    __extends(NotificationTimeFilterPipe, _super);
    function NotificationTimeFilterPipe(ref) {
        return _super.call(this, ref) || this;
    }
    NotificationTimeFilterPipe.prototype.transform = function (obj, args) {
        var msgDate = new Date(obj);
        if (msgDate instanceof Date) {
            if (!this.timer) {
                this.timer = this.getObservable(msgDate);
            }
            return _super.prototype.transform.call(this, this.timer); //  (this.timer, args);
        }
        return _super.prototype.transform.call(this, msgDate); //(obj, args);
    };
    NotificationTimeFilterPipe.prototype.getObservable = function (obj) {
        var _this = this;
        return Observable_1.Observable.interval(1000).startWith(0).map(function () {
            var result;
            // current time
            var today = new Date();
            var now = new Date().getTime();
            // time since message was sent in seconds
            var delta = (now - obj.getTime()) / 1000;
            // format string
            if (delta < 10) {
                result = 'now';
            }
            else if (delta < 60) {
                result = 'few secs ago';
            }
            else if (delta < 3600) {
                result = Math.floor(delta / 60) + ' mins ago';
            }
            else if (delta < 86400 && today.getDate() == obj.getDate() && today.getMonth() === obj.getMonth() && today.getFullYear() === obj.getFullYear()) {
                result = Math.floor(delta / 3600) + ' hrs ago';
            }
            else if (today.getDate() - obj.getDate() === 1 && today.getMonth() === obj.getMonth() && today.getFullYear() === obj.getFullYear()) {
                result = 'yesterday at ' + _this.getFormatedTime(obj);
            }
            else {
                //result = Math.floor(delta / 86400) + ' days ago';
                result = _this.getFormatedDate(obj) + " " + _this.getFormatedTime(obj);
            }
            return result;
        });
    };
    ;
    NotificationTimeFilterPipe.prototype.getFormatedDate = function (date) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var strDate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + ('0' + date.getDate()).slice(-2) + ", " + date.getFullYear();
        return strDate;
    };
    NotificationTimeFilterPipe.prototype.getFormatedTime = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };
    return NotificationTimeFilterPipe;
}(common_1.AsyncPipe));
NotificationTimeFilterPipe = __decorate([
    core_1.Pipe({
        name: 'notificationTimeFilter',
        pure: false
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], NotificationTimeFilterPipe);
exports.NotificationTimeFilterPipe = NotificationTimeFilterPipe;
//# sourceMappingURL=notification-time-filter.pipe.js.map