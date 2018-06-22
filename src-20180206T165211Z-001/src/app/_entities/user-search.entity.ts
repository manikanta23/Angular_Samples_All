import { EntityTypeEnum, UserTypeEnum } from "./enums";

export class UserSearch {
    userId?: string;
    userName?: string;
    userTypeId?: UserTypeEnum;
    entityTypeId?: EntityTypeEnum;
}