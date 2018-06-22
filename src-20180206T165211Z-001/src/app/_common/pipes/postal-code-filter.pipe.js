"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PostalCodeFilterPipe = (function () {
    function PostalCodeFilterPipe() {
    }
    PostalCodeFilterPipe.prototype.transform = function (val, args) {
        var value = val && val.toString().trim().replace(/^\+|-|\(|\)/g, '') || '';
        var postalCode = '';
        switch (value.length) {
            case 5:
                postalCode = value + "-0000";
                break;
            case 9:
                postalCode = value.slice(0, 5) + "-" + value.slice(5);
                break;
            default:
                return val;
        }
        return postalCode;
    };
    return PostalCodeFilterPipe;
}());
PostalCodeFilterPipe = __decorate([
    core_1.Pipe({
        name: 'postalCode'
    })
], PostalCodeFilterPipe);
exports.PostalCodeFilterPipe = PostalCodeFilterPipe;
//# sourceMappingURL=postal-code-filter.pipe.js.map