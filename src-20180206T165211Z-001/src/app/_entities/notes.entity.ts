export class Notes {
    TotalNotes: number;
    Notes: Note[] = null;
    SapCuratedNote: string = "";
}

export class Note {
    NoteId: number;
    NoteType: string = "general";
    Expires: string = "";
    Description: string = "";
    IsCrossParts: boolean;
    IsPartsInBrand: boolean;
    PartId: string = "";
    PartNumber: string = "";
    CustomerNumber: string = "";
    BranchCode: string = "";
    CreatedDate?: Date = new Date();
    CreatedBy?: string = "";
    CreatedByUserName: string = "";
    UpdatedDate?: Date = new Date();
    UpdatedBy?: string = "";
    UpdatedByUserName: string = "";
}