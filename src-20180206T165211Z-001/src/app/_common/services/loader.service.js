"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LoaderService = (function () {
    function LoaderService() {
        this.loadingVal = false;
        this.loadingFlagUpdated = new core_1.EventEmitter();
    }
    Object.defineProperty(LoaderService.prototype, "loading", {
        get: function () { return this.loadingVal; },
        set: function (value) { this.loadingVal = value; this.loadingFlagUpdated.emit(value); },
        enumerable: true,
        configurable: true
    });
    ;
    return LoaderService;
}());
LoaderService = __decorate([
    core_1.Injectable()
], LoaderService);
exports.LoaderService = LoaderService;
//# sourceMappingURL=loader.service.js.map