import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Picture } from '../models/Picture';

@Injectable()
export class UserService {
    constructor(
        private http: Http,
        @Inject('restUrl') private restUrl,
        private authService: AuthService
    ) {

    }

    // private _serverError(err: any) {
    //     console.log('sever error:', err);  // debug
    //     if (err instanceof Response) {
    //         return Observable.throw(err.json() || 'backend server error');
    //     }
    //     return Observable.throw(err || 'backend server error');
    // }

    getUsers(cid?: number): Observable<User[]> {
        let url = this.restUrl + "/User/GetAll";
        url += cid ? "/" + cid : "";
        return this.http.get(url, this.authService.getRequestOptions()).map(r => r.json());//.catch(this._serverError);
    }

    getUser(id: number): Observable<User> {
        let url = this.restUrl + "/User/Get/" + id;
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
    }

    addUser(c: User): Observable<User> {
        let url = this.restUrl + "/User/Add";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => res.json());
    }

    updateUser(c: User) {
        let url = this.restUrl + "/User/Update";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => { });
    }

    delUser(id) {
        let url = this.restUrl + "/User/Delete/" + id;
        console.log(url);
        return this.http.delete(url, this.authService.getRequestOptions()).map(res => { });
    }

    upload(fileToUpload: any, match_id: number, table: string): Observable<Picture[]> {
        let url = this.restUrl + "/home/upload";
        let input = new FormData();
        input.append("file", fileToUpload);
        input.append("table", table);
        input.append("match_id", match_id + "");
        return this.http.post(url, input).map(res => res.json());
    }

    getUserPicture(id: number): Observable<Picture> {
        let url = this.restUrl + "/User/GetUserPicture/" + id;
        console.log(url);
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
    }

}