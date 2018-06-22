export class PartSearch {
    partId: string = "";
    partSearchTerm: string = "";
    branchCode: string = "";
    customerNumber: string = "";
    includePriceAndAvailability: boolean = true;
    isCountCheck: boolean = true;
    includeNotExtendedParts: boolean = false;
    partNumber: string = "";
    oem: string = "";
    manufacturer: string = "";
    description: string = "";
    vmrsCode: string = "";
    pageNumber: number = 1;
    pageSize: number = 100;
    includeFacets: boolean = true;
    IsReman: boolean;
    Specification: string[];
    ListPrice: Float32Array;
    IsObsolete: boolean;
    SupersededPartNumber: string;
    Core: boolean;
    MaterialId: string;
    CorePart: string;
    CorePrice: Float32Array;
    GroupId: number;
    GroupRelatedPartId: number;
    BranchName: string;
    binLocation: string = "";
    userId: string = "";
    Facet: Facet[] = null;
    couponId: string;
    couponCode: string;
}

export class Facet {
    facetText: string = null;
    facetType: string = "";
}