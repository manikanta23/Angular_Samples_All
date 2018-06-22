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
var loader_service_1 = require("./../../_common/services/loader.service");
var notification_service_1 = require("./../../_common/services/notification.service");
var common_data_service_1 = require("./../../_common/services/common-data.service");
var user_service_1 = require("../user.service");
var user_entity_1 = require("./../../_entities/user.entity");
var UserDetailsComponent = (function () {
    function UserDetailsComponent(loader, notification, commonDataService, changeDetectorRef, userService, elementRef) {
        var _this = this;
        this.loader = loader;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.changeDetectorRef = changeDetectorRef;
        this.userService = userService;
        this.elementRef = elementRef;
        this.user = null;
        this.roles = null;
        this.entityRoles = null;
        this.branchOverrides = null;
        this.userSearchKey = null;
        this.showMessage = false;
        this.subscription = this.userService.UserDataUpdated.subscribe(function (d) {
            _this.roles = null;
            _this.entityRoles = null;
            _this.branchOverrides = null;
            _this.userSearchKey = null;
            _this.user = d;
            if (_this.user != null && _this.user != undefined) {
                _this.message = "";
                _this.showMessage = false;
                _this.getUserRoles();
                _this.bindBranchOverridByUserId();
            }
        });
        this.notification.hideNotification();
    }
    UserDetailsComponent.prototype.updateCheckedRoles = function (role, event) {
        role.isAssigned = event.srcElement.checked;
    };
    UserDetailsComponent.prototype.updateUser = function (isActive, event) {
        this.user.isActive = isActive;
    };
    UserDetailsComponent.prototype.updateUserDetails = function () {
        var _this = this;
        // only update the user if this.user.id is set (i.e., user has already been created)
        if (this.user.id) {
            var roleIds = this.roles
                .filter(function (row) {
                return row.isAssigned == true;
            })
                .map(function (r) { return r.id; });
            this.userService.updateUser(this.user, "Windows", roleIds)
                .then(function (sync) {
                if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                    _this.notification.errorMessage("UserDetailsComponent", "updateUser", "updateUser", sync);
                }
                else {
                    if (!sync.hasError) {
                        _this.notification.showNotification(_this.user.firstName + " " + _this.user.lastName + " (" + _this.user.userName + ") updated successfully", notification_service_1.NotificationType.Success);
                        _this.userService.UserListUpdated.emit(true);
                    }
                    else {
                        if (sync.errorMessage.length > 1) {
                            _this.notification.showMultilineNotification(sync.errorMessage);
                        }
                        else {
                            _this.notification.showNotification(sync.errorMessage[0].message, sync.errorMessage[0].type);
                        }
                    }
                }
                console.log("User updated to : ", _this.user);
            }, function (error) { });
            ;
        }
    };
    UserDetailsComponent.prototype.createUser = function () {
        var _this = this;
        var roleIds = this.roles
            .filter(function (row) {
            return row.isAssigned == true;
        })
            .map(function (r) { return r.id; });
        this.userService.createUser(this.user, "Windows", roleIds)
            .then(function (sync) {
            if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                _this.notification.errorMessage("UserDetailsComponent", "createUser", "createUser", sync);
            }
            else {
                _this.notification.showNotification(_this.user.firstName + " " + _this.user.lastName + " (" + _this.user.userName + ") created successfully", notification_service_1.NotificationType.Success);
                _this.userService.UserListUpdated.emit(true);
            }
            console.log("User updated to : ", _this.user);
        }, function (error) { });
        ;
    };
    UserDetailsComponent.prototype.syncUserWithSap = function (event) {
        var _this = this;
        // only sync the user if this.user.id is set (i.e., user has already been created)
        if (this.user.id) {
            this.userService
                .syncUserWithSap(this.user.id)
                .then(function (sync) {
                if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                    _this.notification.errorMessage("UserDetailsComponent", "syncUserWithSap", "syncUserWithSap", sync);
                }
                else {
                    _this.userService
                        .getUserEntityRoles(_this.user.id)
                        .then(function (er) {
                        if (er.ErrorType != undefined && er.ErrorType != null && er.ErrorType != null) {
                            _this.notification.errorMessage("UserDetailsComponent", "syncUserWithSap", "getUserEntityRoles", er);
                        }
                        else {
                            _this.entityRoles = er;
                            _this.bindBranchOverridByUserId();
                        }
                        console.log("User Entity Roles data : ", er);
                    }, function (error) { });
                }
                console.log("User Sync With SAP response: ", sync);
            }, function (error) { });
        }
    };
    UserDetailsComponent.prototype.getUserRoles = function () {
        var _this = this;
        this.userService
            .getUserRoles(this.user.id)
            .then(function (r) {
            if (r.ErrorType != undefined && r.ErrorType != null && r.ErrorType != null) {
                _this.notification.errorMessage("UserDetailsComponent", "getUserRoles", "getUserRoles", r);
            }
            else {
                _this.roles = r;
            }
            console.log("User Roles data : ", r);
        }, function (error) { });
        this.userService
            .getUserEntityRoles(this.user.id)
            .then(function (er) {
            if (er.ErrorType != undefined && er.ErrorType != null && er.ErrorType != null) {
                _this.notification.errorMessage("UserDetailsComponent", "getUserRoles", "getUserEntityRoles", er);
            }
            else {
                _this.entityRoles = er;
            }
            console.log("User Entity Roles data : ", er);
        }, function (error) { });
    };
    UserDetailsComponent.prototype.bindBranchOverridByUserId = function () {
        var _this = this;
        this.userService
            .getUserBranchesForOverriding(this.user.id)
            .then(function (b) {
            if (b.ErrorType != undefined && b.ErrorType != null && b.ErrorType != null) {
                _this.notification.errorMessage("UserDetailsComponent", "bindBranchOverridByUserId", "getUserBranchesForOverriding", b);
            }
            else {
                _this.branchOverrides = b.overrideBranches;
            }
            console.log("User branches overriding data : ", b);
        }, function (error) { });
    };
    UserDetailsComponent.prototype.searchUsersKeypress = function (event) {
        if (event.keyCode == 13) {
            this.searchUsers();
        }
    };
    UserDetailsComponent.prototype.searchUsers = function () {
        var _this = this;
        this.roles = null;
        this.entityRoles = null;
        this.branchOverrides = null;
        this.message = "";
        this.showMessage = false;
        this.userService
            .searchUsersInActiveDirectory(this.userSearchKey)
            .then(function (r) {
            if (r.ErrorType != undefined && r.ErrorType != null && r.ErrorType != null) {
                _this.notification.errorMessage("UserDetailsComponent", "searchUsers", "searchUsers", r);
            }
            else {
                if (r.adSearchResult == null) {
                    _this.message = "No user found.";
                    _this.showMessage = true;
                }
                else if (r.adSearchResult.isExist) {
                    _this.message = "User already exist in partslink.";
                    _this.showMessage = true;
                }
                else {
                    _this.user = Object.assign(new user_entity_1.User(), {
                        userName: r.adSearchResult.userName,
                        firstName: r.adSearchResult.firstName,
                        lastName: r.adSearchResult.lastName,
                        emailAddress: r.adSearchResult.emailAddress,
                        defaultBranchCode: r.adSearchResult.defaultBranchCode,
                        isActive: true,
                        userType: Object.assign(new user_entity_1.UserType(), {
                            id: 1
                        })
                    });
                    _this.branchOverrides = r.adSearchResult.overrideBranches;
                    _this.getUserRoles();
                }
            }
            console.log("User data : ", r);
        }, function (error) { });
    };
    UserDetailsComponent.prototype.ngOnDestroy = function () {
        this.changeDetectorRef.detach();
    };
    return UserDetailsComponent;
}());
UserDetailsComponent = __decorate([
    core_1.Component({
        selector: "user-details",
        templateUrl: "./src/app/user/details/user-details.component.html"
    }),
    __metadata("design:paramtypes", [loader_service_1.LoaderService, notification_service_1.NotificationService, common_data_service_1.CommonDataService, core_1.ChangeDetectorRef, user_service_1.UserService, core_1.ElementRef])
], UserDetailsComponent);
exports.UserDetailsComponent = UserDetailsComponent;
//# sourceMappingURL=user-details.component.js.map