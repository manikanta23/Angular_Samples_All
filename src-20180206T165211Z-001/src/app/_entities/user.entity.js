"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User() {
        this.id = null;
        this.userName = null;
        this.firstName = null;
        this.lastName = null;
        this.emailAddress = null;
        this.isActive = false;
        this.createdOn = new Date();
        this.modifiedOn = new Date();
        this.contactId = null;
        this.defaultBranchCode = null;
        this.overrideDefaultBranchCode = null;
        this.userType = null;
    }
    return User;
}());
exports.User = User;
var UserType = (function () {
    function UserType() {
        this.id = null;
        this.code = null;
        this.name = null;
        this.isInternal = false;
    }
    return UserType;
}());
exports.UserType = UserType;
var Role = (function () {
    function Role() {
        this.id = null;
        this.name = null;
        this.isAssigned = false;
    }
    return Role;
}());
exports.Role = Role;
var EntityRole = (function () {
    function EntityRole() {
        this.entityId = null;
        this.entityName = null;
        this.role = null;
    }
    return EntityRole;
}());
exports.EntityRole = EntityRole;
//export class AdUser {
//    id: string;
//    userName: string;
//    firstName: string;
//    lastName: string;
//    emailAddress: string;
//    isActive: boolean;
//    createdOn: Date;
//    modifiedOn: Date;
//    contactId?: string;
//    defaultBranchCode?: string;
//    userType: UserType;
//    displayName: string;
//    jobTitle: string;
//} 
//# sourceMappingURL=user.entity.js.map