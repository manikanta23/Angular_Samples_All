export class Branch {
    userId: string;
    query: string = "";
    take: number = 500;
}

export class BranchInfo {
    Id: string = "";
    Code: string = "";
    Name: string = "";
    Street: string = "";
    City: string = "";
    State: string = "";
    Zip: string = "";
    Country: string = "";
    Phone: string = "";
    Fax: string = "";
    NotificationEmailAddresses: string = "";
    AllowDelivery: boolean;
    AllowPickUp: boolean;
    IsActive: boolean;
}
