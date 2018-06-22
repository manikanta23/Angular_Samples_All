import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "manufacturerFilterPipe"
})
export class ManufacturerFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, function (row) {
                return row.val.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
        }
        return array;
    }
}