"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TelephoneNumberFilterPipe = (function () {
    function TelephoneNumberFilterPipe() {
    }
    TelephoneNumberFilterPipe.prototype.transform = function (val, args) {
        var value = val && val.toString().trim().replace(/^\+|-|\(|\)/g, '') || '';
        if (value.match(/[^0-9]/)) {
            return val;
        }
        var country, city, number;
        switch (value.length) {
            case 10:
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;
            case 11:
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;
            case 12:
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;
            default:
                return val;
        }
        if (country == 1) {
            country = "";
        }
        number = number.slice(0, 3) + '-' + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
    };
    return TelephoneNumberFilterPipe;
}());
TelephoneNumberFilterPipe = __decorate([
    core_1.Pipe({
        name: 'telephoneNumber'
    })
], TelephoneNumberFilterPipe);
exports.TelephoneNumberFilterPipe = TelephoneNumberFilterPipe;
//# sourceMappingURL=telephone-number-filter.pipe.js.map