export class NationalInventory {
    InventoryResult: InventoryResult[] = null;
}

export class InventoryResult {
    PartId: string;
    PartNumber: string;
    BranchCode: string;
    BranchName: string;
    Quantity: number;
    MilesFromSource: number;
    partsQuantity: number = 1;
}
