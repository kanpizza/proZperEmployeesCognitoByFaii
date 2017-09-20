import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Employee } from 'assets/Data/employee.types';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmployeeService {

    static nextId = "a";
    private _url = "assets/Data/Employees.json";
    constructor(private _http: Http) {
    }

    getEmployees(): any {
        return this._http.get(this._url)
            .map((response: Response) => <Employee[]>response.json().Employees)
            // .do(data => console.log("Employee data" + JSON.stringify(data)))
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Internal Server error');
    }

}