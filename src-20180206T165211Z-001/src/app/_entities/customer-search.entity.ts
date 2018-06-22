export class CustomerSearch {
    CustomerId?: string = "";
    CustomerType?: string = "";
    CustomerNumber?: string = "";
    CustomerName?: string = "";
    PhoneNumber?: string = "";
    StreetAddress?: string = "";
    City?: string = "";
    State?: string = "";
    PostalCode?: string = "";
    PayerNumber?: string = "";
    AccountManager?: string = "";
    AccountGroups?: string[] = null;
    BranchCode?: string = "";
    UserId: string = "";
}

export class MscPayerSearch {
    CustomerNumber?: string = "";
    AccountGroups?: string[] = null;
    BranchCode?: string = "";
    SalesOrganization: string = "1000";
    IncludeShipTo: boolean = true;
}

export class MscPayer {
    mscCardNumber: string = "";
    payers: Payer[] = null;
    shipTos: ShipTo[] = null;
}
export class Payer {
    isDefault: boolean;
    name: string;
    payerNumber: string;
}
export class ShipTo {
    isDefault: boolean;
    mscCardNumber: string;
    name: string;
    payerNumber: string;
}