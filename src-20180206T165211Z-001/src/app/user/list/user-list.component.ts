import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";

import { UserTypeEnum, EntityTypeEnum } from "../../_entities/enums";
import { User, Role, EntityRole } from "../../_entities/user.entity";
import { UserSearch } from "../../_entities/user-search.entity";
import { UserService } from "../user.service";
import { PagerService } from "./../../_common/services/pager.service";

declare var jQuery: any;
import * as _ from "lodash";

@Component({
    selector: "users-list",
    templateUrl: "./src/app/user/list/user-list.component.html",
    providers: [PagerService]
})
export class UserListComponent implements OnInit {
    usersData: any = null;
    searchData: UserSearch = new UserSearch();
    userId: string = "";
    userName: string = "";
    user: any = null;

    pager: any = {};
    // paged items
    pagedUsers: any[];
    filteredUsers: any[];
    filterKey: string = "";
    sortBy: string = "";
    sortAsc: boolean = false;


    constructor(
        private notification: NotificationService,
        private commonDataService: CommonDataService,
        private pagerService: PagerService,
        private userService: UserService) {
        //this.notification.hideNotification();
    }

    subscription = this.userService.UserListUpdated.subscribe((d: any) => {
        jQuery("#userDetailModal").modal("hide");
        this.getUsers();
    });

    loadUserDetail(userId: string) {
        let _user = _.filter(this.filteredUsers, function(row) {
            return row.id == userId;
        });

        if (_user != null && _user != undefined && _user.length > 0) {
            this.user = _user[0];
            this.userService.UserDataUpdated.emit(this.user);
            jQuery("#userDetailModal").modal("show");
        }
    }

    createUser() {
        this.user = null;
        this.userService.UserDataUpdated.emit(this.user);
        jQuery("#userDetailModal").modal("show");
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.userService
            .getUsers(this.searchData)
            .then(u => {
                if (u.ErrorType != undefined && u.ErrorType != null && u.ErrorType != null) {
                    this.notification.errorMessage("UserListComponent", "getUsers", "getUsers", u);
                }
                else {
                    this.usersData = u.data.users;
                    this.filterKey = "";
                    this.filteredUsers = u.data.users;
                    this.setPage(1);
                }
                console.log("User List component data : ", u);
            },
            error => { });
    }


    setPage(page: number) {
        if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.filteredUsers.length, page, 25);

        // get current page of items
        this.pagedUsers = this.filteredUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    filter = function() {

        if (this.filterKey !== '') {
            this.filteredUsers = this.usersData.filter(function(e) {
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
    }

    sortDataBy(sortBy: string) {
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
    }
}