import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'postalCode'
})
export class PostalCodeFilterPipe implements PipeTransform {
    transform(val, args) {
        var value = val && val.toString().trim().replace(/^\+|-|\(|\)/g, '') || '';
        let postalCode = '';
        switch (value.length) {
            case 5: // ##### -> #####-0000
                postalCode = `${value}-0000`;
                break;
            case 9: // ######### -> #####-####
                postalCode = `${value.slice(0, 5)}-${value.slice(5)}`;
                break;
            default:
                return val;
        }
        return postalCode;
    }
}