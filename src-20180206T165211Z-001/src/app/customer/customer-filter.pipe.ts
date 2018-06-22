import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "customerFilter"
})
export class CustomerFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, function (row) {
                return row.customerName.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.customerName2.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.customerNumber).toLowerCase().indexOf(query.toLowerCase()) > -1 ||                    
                    row.streetAddress.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.city.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    row.state.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.postalCode).toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.phoneNumber).toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                    ("" + row.orderCount).indexOf(query.toLowerCase()) > -1 ||
                    row.accountManager.toLowerCase().indexOf(query.toLowerCase()) > -1 ||                    
                    ("" + row.mscAccountNumber).toLowerCase().indexOf(query.toLowerCase()) > -1;                
            });
        }
        return array;
    }
}