import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';
import { Movement_List, Movement_s } from '../models/Movement';
import { MovementType } from '../models/MovementType';

@Injectable()
export class MovementService {
    constructor(
        private http: Http,
        @Inject('restUrl') private restUrl,
        private authService: AuthService
    ) { }

    // private _serverError(err: any) {
    //     console.log('sever error:', err);  // debug
    //     if (err instanceof Response) {
    //         return Observable.throw(err.json() || 'backend server error');
    //     }
    //     return Observable.throw(err || 'backend server error');
    // }

    getMovementList(cid?:number):Observable<Movement_List[]>{
        let url= this.restUrl+"/movement/getAll";
        url += cid ? "/"+cid : "";
        console.log(url);
        
        return this.http.get(url, this.authService.getRequestOptions()).map(x=>x.json());
      }
    
      getMovement(id:number):Observable<Movement_s>{
        let url= this.restUrl+"/movement/get/"+id;
        return this.http.get(url, this.authService.getRequestOptions()).map(x=>x.json());//.catch(this._serverError);
      }
    
      setDate(d:Date):Date{
        return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()))
       } 
    
      addMovement(c: Movement_s): Observable<Movement_s> {
        let url = this.restUrl + "/Movement/Add";
        console.log("service addMovement");
        console.log(c);
        console.log(c.movement.date);
        c.movement.date = this.setDate(c.movement.date);
        console.log(c.movement.date);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => res.json());
      }  
    
      updateMovement(c: Movement_s){
        let url = this.restUrl + "/Movement/Update";
        console.log(c);
        c.movement.date = this.setDate(c.movement.date);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => {});
      }   
    
      deleteMovement(id: number, table: string) {
        let url = this.restUrl + "/"+table+"/Delete/" + id;
        console.log(url);
        return this.http.delete(url, this.authService.getRequestOptions()).map(res => { });
      }

      //#region MovementType Proccess
      getMovementTypes(cid?: number): Observable<MovementType[]> {
        let url = this.restUrl + "/MovementType/GetAll";
        url += cid ? "/" + cid : "";
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
      }
    
      getMovementType(id: number): Observable<MovementType> {
        let url = this.restUrl + "/MovementType/Get/" + id;
        return this.http.get(url, this.authService.getRequestOptions()).map(x => x.json());
      }
    
      addMovementType(c: MovementType): Observable<MovementType> {
        let url = this.restUrl + "/MovementType/Add";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => res.json());
      }
    
      updateMovementType(c: MovementType) {
        let url = this.restUrl + "/MovementType/Update";
        console.log(c);
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), this.authService.getRequestOptions()).map(res => { });
      }
      deleteMovementType(id: number) {
        let url = this.restUrl + "MovementType/Delete/" + id;
        console.log(url);
        return this.http.delete(url, this.authService.getRequestOptions()).map(res => { });
      }
    
    
}