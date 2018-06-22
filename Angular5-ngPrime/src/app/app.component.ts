import {Component, OnInit} from '@angular/core';
import { Car } from '../domain/car';
import { CarService} from '../services/Carservice';

// import {SelectItem} from 'primeng/api';


    interface City {
    name: string;
    code: string;
    }

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [CarService]
})
export class AppComponent implements OnInit{

    selectedCity: City;

    cities: City[];

    // cities1: SelectItem[];
    selectedCity1: City;

    enterEmail:string = "";
    
    displayDialog: boolean = false;
    
    car: Car = new PrimeCar();
    
    selectedCar: Car;
    
    newCar: boolean;
    
    cars: Car[];

    cols: any[];


    //START:
    display: boolean = false;

    selectedCities: string[] = [];
    

showDialog() {
    this.display = true;
}

onDialogClose(event) {
   this.display = event;
}

//END:
    
    constructor(private carService: CarService) {

        this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
//   this.cities1 = [
//             {label:'Select City', value:null},
//             {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
//             {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
//             {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
//             {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
//             {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
//         ];
     }
    
    ngOnInit() {
        this.carService.getCarsSmall().then(cars => this.cars = cars);

        this.cols = [
            { field: 'vin', header: 'Vin' },
            { field: 'year', header: 'Year' },
            { field: 'brand', header: 'Brand' },
            { field: 'color', header: 'Color' }
        ];
    }
    
    onScroll () {
        console.log('scrolled!!')
    }

    validCheck(){
        let email = this.enterEmail;
    }
    showDialogToAdd() {
        this.newCar = true;
        this.car = new PrimeCar();
        this.displayDialog = true;
    }
    
    save() {
        const cars = [...this.cars];
        if (this.newCar) {
            cars.push(this.car);
        } else {
            cars[this.findSelectedCarIndex()] = this.car;
        }
        this.cars = cars;
        this.car = null;
        this.displayDialog = false;
    }
    
    delete() {
        const index = this.findSelectedCarIndex();
        this.cars = this.cars.filter((val, i) => i != index);
        this.car = null;
        this.displayDialog = false;
    }
    
    onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }
    
    cloneCar(c: Car): Car {
        const car = new PrimeCar();
        for (const prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
    
    findSelectedCarIndex(): number {
        return this.cars.indexOf(this.selectedCar);
    }
    displayPopup(){
        this.displayDialog = true;
    }
}

export class PrimeCar implements Car {
    
    constructor(public vin?, public year?, public brand?, public color?) {}
}
