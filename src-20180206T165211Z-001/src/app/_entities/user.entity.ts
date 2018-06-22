import { EntityTypeEnum, UserTypeEnum } from "./enums";

export class User {
    id: string = null;
    userName: string = null;
    firstName: string = null;
    lastName: string = null;
    emailAddress: string = null;
    isActive: boolean = false;
    createdOn: Date = new Date();
    modifiedOn: Date = new Date();
    contactId?: string = null;
    defaultBranchCode?: string = null;
    overrideDefaultBranchCode?: string = null;
    userType: UserType = null;
}

export class UserType {
    id: string = null;
    code: string = null;
    name: string = null;
    isInternal: boolean = false;
}

export class Role {
    id: string = null;
    name: string = null;
    entityTypeId: EntityTypeEnum;
    isAssigned: boolean = false;
}

export class EntityRole {
    entityId: string = null;
    entityName: string = null;
    role: Role = null;
}

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