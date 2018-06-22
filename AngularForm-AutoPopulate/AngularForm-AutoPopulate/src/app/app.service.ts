import { Injectable  } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

import { HttpClient} from '@angular/common/http';



@Injectable()
export class EmployeeService {

    constructor(private _http:HttpClient){}

    // getEmployeeByCode(empCode: string): Observable<IEmployee> {
    //     return this._http.get("http://localhost:50803/api/Employee?code=" + empCode)
    //                 .map((response: Response) => <IEmployee>response.json())
    //                 .catch(this.handleError);
    // }

    
    getEmployees(): Observable<any[]>{
         // To convert Observable<Response> to Observable<IEmployee[]>
        // we are using the map operator
        return this._http.get('./assets/typeHead.json')
                         .map((response: Response) => <any[]>response.json())
                         .catch(this.handleError);
    }



    
    handleError(error:Response){
        console.error(error);
        return Observable.throw(error);
    }
}