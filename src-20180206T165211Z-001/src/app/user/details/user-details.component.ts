import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter, ElementRef, OnDestroy } from "@angular/core";

import { LoaderService } from "./../../_common/services/loader.service";
import { NotificationService, NotificationType } from "./../../_common/services/notification.service";
import { CommonDataService } from "./../../_common/services/common-data.service";
import { UserService } from "../user.service";
import { User, UserType, Role, EntityRole } from "./../../_entities/user.entity";
import { EntityTypeEnum, UserTypeEnum } from "./../../_entities/enums";

@Component({
    selector: "user-details",
    templateUrl: "./src/app/user/details/user-details.component.html"
})
export class UserDetailsComponent implements OnDestroy {
    user: User = null;

    roles: Role[] = null;
    entityRoles: EntityRole[] = null;
    branchOverrides: EntityRole[] = null;
    userSearchKey: string = null;
    //adSearchResult: any;
    message: string;
    showMessage: boolean = false;

    constructor(private loader: LoaderService, private notification: NotificationService, private commonDataService: CommonDataService, private changeDetectorRef: ChangeDetectorRef, private userService: UserService, private elementRef: ElementRef) {
        this.notification.hideNotification();
    }

    subscription = this.userService.UserDataUpdated.subscribe((d: any) => {
        this.roles = null;
        this.entityRoles = null;
        this.branchOverrides = null;
        this.userSearchKey = null;

        this.user = d;
        if (this.user != null && this.user != undefined) {
            this.message = "";
            this.showMessage = false;
            this.getUserRoles();
            this.bindBranchOverridByUserId();
        }
    });

    updateCheckedRoles(role, event) {
        role.isAssigned = event.srcElement.checked;
    }

    updateUser(isActive: boolean, event) {
        this.user.isActive = isActive;
    }

    updateUserDetails() {
        // only update the user if this.user.id is set (i.e., user has already been created)
        if (this.user.id) {
            let roleIds = this.roles
                .filter(function (row) {
                    return row.isAssigned == true;
                })
                .map(r => r.id);

            this.userService.updateUser(this.user, "Windows", roleIds)
                .then(sync => {
                    if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                        this.notification.errorMessage("UserDetailsComponent", "updateUser", "updateUser", sync);
                    }
                    else {
                        if (!sync.hasError) {
                            this.notification.showNotification(this.user.firstName + " " + this.user.lastName + " (" + this.user.userName + ") updated successfully", NotificationType.Success);
                            this.userService.UserListUpdated.emit(true);
                        }
                        else {
                            if (sync.errorMessage.length > 1) {
                                this.notification.showMultilineNotification(sync.errorMessage);
                            }
                            else {
                                this.notification.showNotification(sync.errorMessage[0].message, sync.errorMessage[0].type);
                            }
                        }
                    }
                    console.log("User updated to : ", this.user);
                },
                error => { });;
        }
    }

    createUser() {
        let roleIds = this.roles
            .filter(function (row) {
                return row.isAssigned == true;
            })
            .map(r => r.id);

        this.userService.createUser(this.user, "Windows", roleIds)
            .then(sync => {
                if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                    this.notification.errorMessage("UserDetailsComponent", "createUser", "createUser", sync);
                }
                else {
                    this.notification.showNotification(this.user.firstName + " " + this.user.lastName + " (" + this.user.userName + ") created successfully", NotificationType.Success);
                    this.userService.UserListUpdated.emit(true);
                }
                console.log("User updated to : ", this.user);
            },
            error => { });;
    }

    syncUserWithSap(event) {
        // only sync the user if this.user.id is set (i.e., user has already been created)
        if (this.user.id) {
            this.userService
                .syncUserWithSap(this.user.id)
                .then(sync => {
                    if (sync.ErrorType != undefined && sync.ErrorType != null && sync.ErrorType != null) {
                        this.notification.errorMessage("UserDetailsComponent", "syncUserWithSap", "syncUserWithSap", sync);
                    }
                    else {
                        this.userService
                            .getUserEntityRoles(this.user.id)
                            .then(er => {
                                if (er.ErrorType != undefined && er.ErrorType != null && er.ErrorType != null) {
                                    this.notification.errorMessage("UserDetailsComponent", "syncUserWithSap", "getUserEntityRoles", er);
                                }
                                else {
                                    this.entityRoles = er;
                                    this.bindBranchOverridByUserId();
                                }
                                console.log("User Entity Roles data : ", er);
                            },
                            error => { });
                    }
                    console.log("User Sync With SAP response: ", sync);
                },
                error => { });
        }
    }

    getUserRoles() {
        this.userService
            .getUserRoles(this.user.id)
            .then(r => {
                if (r.ErrorType != undefined && r.ErrorType != null && r.ErrorType != null) {
                    this.notification.errorMessage("UserDetailsComponent", "getUserRoles", "getUserRoles", r);
                }
                else {
                    this.roles = r;
                }
                console.log("User Roles data : ", r);
            },
            error => { });
        this.userService
            .getUserEntityRoles(this.user.id)
            .then(er => {
                if (er.ErrorType != undefined && er.ErrorType != null && er.ErrorType != null) {
                    this.notification.errorMessage("UserDetailsComponent", "getUserRoles", "getUserEntityRoles", er);
                }
                else {
                    this.entityRoles = er;
                }
                console.log("User Entity Roles data : ", er);
            },
            error => { });
    }

    bindBranchOverridByUserId() {
        this.userService
            .getUserBranchesForOverriding(this.user.id)
            .then(b => {
                if (b.ErrorType != undefined && b.ErrorType != null && b.ErrorType != null) {
                    this.notification.errorMessage("UserDetailsComponent", "bindBranchOverridByUserId", "getUserBranchesForOverriding", b);
                }
                else {
                    this.branchOverrides = b.overrideBranches;
                }
                console.log("User branches overriding data : ", b);
            },
            error => { });
    }

    searchUsersKeypress(event: any) {
        if (event.keyCode == 13) {
            this.searchUsers();
        }
    }

    searchUsers() {

        this.roles = null;
        this.entityRoles = null;
        this.branchOverrides = null;
        this.message = "";
        this.showMessage = false;

        this.userService
            .searchUsersInActiveDirectory(this.userSearchKey)
            .then(r => {
                if (r.ErrorType != undefined && r.ErrorType != null && r.ErrorType != null) {
                    this.notification.errorMessage("UserDetailsComponent", "searchUsers", "searchUsers", r);
                }
                else {
                    if (r.adSearchResult == null) {
                        this.message = "No user found.";
                        this.showMessage = true;
                    }
                    else if (r.adSearchResult.isExist) {
                        this.message = "User already exist in partslink.";
                        this.showMessage = true;
                    }
                    else {
                        this.user = Object.assign(new User(), {
                            userName: r.adSearchResult.userName,
                            firstName: r.adSearchResult.firstName,
                            lastName: r.adSearchResult.lastName,
                            emailAddress: r.adSearchResult.emailAddress,
                            defaultBranchCode: r.adSearchResult.defaultBranchCode,
                            isActive: true,
                            userType: Object.assign(new UserType(), {
                                id: 1
                            })
                        });
                        this.branchOverrides = r.adSearchResult.overrideBranches;
                        this.getUserRoles();
                    }

                }
                console.log("User data : ", r);
            },
            error => { });
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
    }
}