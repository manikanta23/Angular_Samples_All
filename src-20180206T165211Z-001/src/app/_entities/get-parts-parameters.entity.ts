export class GetPartsParameters {
    PartSearchTerm: string;
    BranchCode: string;
    CustomerNumber: string;
    PageNumber?: number = 1;
    PageSize?: number = 10;
    FacetText?: string = null;
    FacetType?: string = null;
    Manufacturer?: string = null;
    Description?: string = null;
    Oem?: string = null;
    VmrsCode?: string = null;
}