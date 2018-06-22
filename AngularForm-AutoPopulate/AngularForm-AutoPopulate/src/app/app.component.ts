import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder,
  Validators,ReactiveFormsModule  } from '@angular/forms';

  import { EmployeeService } from './app.service';



import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  userDetails : FormGroup;
 public model: any;
 employee:any[];

 

  constructor(private _fb: FormBuilder,private _employeeService : EmployeeService){
  }

  ngOnInit(){
    this.userDetails = this._fb.group({
      userName:'',
      IsAvailable: false,
      userInfo : this._fb.group({
        firstName :'',
        lastName:'',
        address:''
      })
     
    });

  //   this._employeeService.getEmployees().subscribe(

  //     (employeeData) => {
  //       if(employeeData == null){
  //        console.log("Employee with specific data not exists.");
  //       }else{
  //         this.employee = employeeData;
  //       }
  //     },
  //     (error) => {  console.log(error); }
  //   )

  //   console.log(this.employee);

  this.employee = [{"UserName": "test1", "Firstname": "y","LastName":"z","Address":"1"},
  {"UserName": "test2", "Firstname": "y","LastName":"z","Address":"1"},
  {"UserName": "test3", "Firstname": "y","LastName":"z","Address":"1"},
  {"UserName": "test4", "Firstname": "y","LastName":"z","Address":"1"},
  {"UserName": "test5", "Firstname": "y","LastName":"z","Address":"1"}];
    
  }



  GetDetails(){
    console.log((this.userDetails));
  }

  search = (text$: Observable<string>) => text$
                      .debounceTime(200)
                      .distinctUntilChanged()
                      .map(term => term.length < 2 ? []
                        : this.employee.filter(v => v.UserName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

 formatter = (x: {UserName: string}) => x.UserName;

}
