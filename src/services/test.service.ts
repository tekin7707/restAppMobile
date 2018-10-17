import { Injectable, Inject } from '@angular/core';
import { Http} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import { User } from '../models/user';

@Injectable()
export class TestService {
    constructor(private http: Http, @Inject('restUrl') private restUrl) { }

    getUser(cid?: number): Observable<User[]> {
        let url = this.restUrl + "/User/GetAll";
        url += cid ? "/" + cid : "";
        return this.http.get(url).map(r => r.json());
    }

    getTest(): Observable<string[]> {
        let url = this.restUrl + "/Values";
        return this.http.get(url).map(r => r.json());
    }

}