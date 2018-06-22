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
var common_data_service_1 = require("./../../_common/services/common-data.service");
var notification_service_1 = require("./../../_common/services/notification.service");
var user_search_entity_1 = require("../../_entities/user-search.entity");
var user_service_1 = require("../user.service");
var pager_service_1 = require("./../../_common/services/pager.service");
var _ = require("lodash");
var UserListComponent = (function () {
    function UserListComponent(notification, commonDataService, pagerService, userService) {
        var _this = this;
        this.notification = notification;
        this.commonDataService = commonDataService;
        this.pagerService = pagerService;
        this.userService = userService;
        this.usersData = null;
        this.searchData = new user_search_entity_1.UserSearch();
        this.userId = "";
        this.userName = "";
        this.user = null;
        this.pager = {};
        this.filterKey = "";
        this.sortBy = "";
        this.sortAsc = false;
        this.subscription = this.userService.UserListUpdated.subscribe(function (d) {
            jQuery("#userDetailModal").modal("hide");
            _this.getUsers();
        });
        this.filter = function () {
            if (this.filterKey !== '') {
                this.filteredUsers = this.usersData.filter(function (e) {
                    return ((e.userName && e.userName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.firstName && e.firstName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.lastName && e.lastName.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.emailAddress && e.emailAddress.toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1) ||
                        (e.defaultBranchCode && ("" + e.defaultBranchCode).toLowerCase().indexOf(this.filterKey.toLowerCase()) > -1)) == true;
                }.bind(this));
                this.setPage(1);
            }
            else {
                this.filteredUsers = this.usersData;
                this.setPage(1);
            }
        };
        //this.notification.hideNotification();
    }
    UserListComponent.prototype.loadUserDetail = function (userId) {
        var _user = _.filter(this.filteredUsers, function (row) {
            return row.id == userId;
        });
        if (_user != null && _user != undefined && _user.length > 0) {
            this.user = _user[0];
            this.userService.UserDataUpdated.emit(this.user);
            jQuery("#userDetailModal").modal("show");
        }
    };
    UserListComponent.prototype.createUser = function () {
        this.user = null;
        this.userService.UserDataUpdated.emit(this.user);
        jQuery("#userDetailModal").modal("show");
    };
    UserListComponent.prototype.ngOnInit = function () {
        this.getUsers();
    };
    UserListComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService
            .getUsers(this.searchData)
            .then(function (u) {
            if (u.ErrorType != undefined && u.ErrorType != null && u.ErrorType != null) {
                _this.notification.errorMessage("UserListComponent", "getUsers", "getUsers", u);
            }
            else {
                _this.usersData = u.data.users;
                _this.filterKey = "";
                _this.filteredUsers = u.data.users;
                _this.setPage(1);
            }
            console.log("User List component data : ", u);
        }, function (error) { });
    };
    UserListComponent.prototype.setPage = function (page) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredUsers.length, page, 25);
        // get current page of items
        this.pagedUsers = this.filteredUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    UserListComponent.prototype.sortDataBy = function (sortBy) {
        if (this.sortBy == sortBy)
            this.sortAsc = !this.sortAsc;
        else
            this.sortAsc = true;
        this.sortBy = sortBy;
        this.filteredUsers = this.commonDataService.sortData(this.filteredUsers, this.sortBy, this.sortAsc);
        if (this.pager.pages && this.pager.pages.length)
            this.setPage(this.pager.currentPage);
        else
            this.setPage(1);
    };
    return UserListComponent;
}());
UserListComponent = __decorate([
    core_1.Component({
        selector: "users-list",
        templateUrl: "./src/app/user/list/user-list.component.html",
        providers: [pager_service_1.PagerService]
    }),
    __metadata("design:paramtypes", [notification_service_1.NotificationService,
        common_data_service_1.CommonDataService,
        pager_service_1.PagerService,
        user_service_1.UserService])
], UserListComponent);
exports.UserListComponent = UserListComponent;
//# sourceMappingURL=user-list.component.js.map