import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "customerNumberFilter"
})

export class CustomerNumberFilterPipe implements PipeTransform {
    transform(value: string, args: string[]): any {
            return parseInt(value, 10) //convert to int
    }
}