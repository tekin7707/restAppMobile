import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import { Customer } from '../models/customer';
import { AuthService } from './auth.service';

@Injectable()
export class CustomerService {
    constructor(private http: Http, @Inject('restUrl') private restUrl, private authService: AuthService) { }

    // private _serverError(err: any) {
    //     console.log('sever error:', err);  // debug
    //     if (err instanceof Response) {
    //         return Observable.throw(err.json() || 'backend server error');
    //     }
    //     return Observable.throw(err || 'backend server error');
    // }

    getCustomers(cid?: number): Observable<Customer[]> {
        let url = this.restUrl + "/Customer/GetAll";
        url += cid ? "/" + cid : "";
        return this.http.get(url, this.authService.getRequestOptions()).map(r => r.json());
    }

    getCustomer(id: number): Observable<Customer> {
        let url = this.restUrl + "/Customer/Get/" + id;
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
    }

    addCustomer(c: Customer): Observable<Customer> {
        let url = this.restUrl + "/Customer/Add";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => res.json());
    }

    updateCustomer(c: Customer) {
        let url = this.restUrl + "/Customer/Update";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => { });
    }

    delCustomer(id) {
        let url = this.restUrl + "/Customer/Delete/" + id;
        console.log(url);
        return this.http.delete(url, this.authService.getRequestOptions()).map(res => { });
    }

}