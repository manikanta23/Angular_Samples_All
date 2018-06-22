import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "inventoryFilterPipe"
})
export class InventoryFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, function (row) {
                return ("" + row.branchCode).indexOf(query.toLowerCase()) > -1 ||
                    row.branchName.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.milesFromSource).indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.quantity).indexOf(query.toLowerCase()) > -1;
            });
        }
        return array;
    }
}