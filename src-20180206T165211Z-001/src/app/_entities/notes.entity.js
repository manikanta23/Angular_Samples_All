"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notes = (function () {
    function Notes() {
        this.Notes = null;
        this.SapCuratedNote = "";
    }
    return Notes;
}());
exports.Notes = Notes;
var Note = (function () {
    function Note() {
        this.NoteType = "general";
        this.Expires = "";
        this.Description = "";
        this.PartId = "";
        this.PartNumber = "";
        this.CustomerNumber = "";
        this.BranchCode = "";
        this.CreatedDate = new Date();
        this.CreatedBy = "";
        this.CreatedByUserName = "";
        this.UpdatedDate = new Date();
        this.UpdatedBy = "";
        this.UpdatedByUserName = "";
    }
    return Note;
}());
exports.Note = Note;
//# sourceMappingURL=notes.entity.js.map