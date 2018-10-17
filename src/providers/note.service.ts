import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';
import { Note_s } from '../models/note_s';

@Injectable()
export class NoteService {
    constructor(
        private http: Http, 
        @Inject('restUrl') private restUrl, 
        private authService: AuthService
    ) { }

    getNotes(cid?: number): Observable<Note_s[]> {
        let url = this.restUrl + "/Note/GetAll";
        url += cid ? "/" + cid : "";
        return this.http.get(url, this.authService.getRequestOptions()).map(r => r.json());
    }

    getNote(id: number): Observable<Note_s> {
        let url = this.restUrl + "/Note/Get/" + id;
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
    }

    addNote(c: Note_s): Observable<Note_s> {
        let url = this.restUrl + "/Note/Add";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => res.json());
    }

    updateNote(c: Note_s) {
        let url = this.restUrl + "/Note/Update";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => { });
    }

    deleteNote(id) {
        let url = this.restUrl + "/Note/Delete/" + id;
        console.log(url);
        return this.http.delete(url, this.authService.getRequestOptions()).map(res => { });
    }
}