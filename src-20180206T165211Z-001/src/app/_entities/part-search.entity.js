"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PartSearch = (function () {
    function PartSearch() {
        this.partId = "";
        this.partSearchTerm = "";
        this.branchCode = "";
        this.customerNumber = "";
        this.includePriceAndAvailability = true;
        this.isCountCheck = true;
        this.includeNotExtendedParts = false;
        this.partNumber = "";
        this.oem = "";
        this.manufacturer = "";
        this.description = "";
        this.vmrsCode = "";
        this.pageNumber = 1;
        this.pageSize = 100;
        this.includeFacets = true;
        this.binLocation = "";
        this.userId = "";
        this.Facet = null;
    }
    return PartSearch;
}());
exports.PartSearch = PartSearch;
var Facet = (function () {
    function Facet() {
        this.facetText = null;
        this.facetType = "";
    }
    return Facet;
}());
exports.Facet = Facet;
//# sourceMappingURL=part-search.entity.js.map