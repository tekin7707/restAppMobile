import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import { User } from '../models/user';
import { ToastController, Events } from 'ionic-angular';
import { NewRecord } from '../models/new_record';
import { Company } from '../models/Company';
import { Picture_s } from '../models/Picture';

@Injectable()
export class AuthService {
    constructor(
        private http: Http, 
        @Inject('restUrl') private restUrl, 
        private toastController: ToastController,
        public events: Events
    ) { }

    login(username, password): Observable<boolean> {
        let user = new User();
        user.email = username;
        user.password = password;

        let url: string = this.restUrl + "/user/login";
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        var requestOptions = new RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(user), requestOptions)
            .map(res => res.json()).catch(this._serverError)
            .map(res => {
                if (res) {//res true ise
                    localStorage.setItem("mtAuth", JSON.stringify(res));
                    console.log("authService http.post true -> loggedUser");
                    console.log(res);
                    return true;
                }
                else {
                    console.log("authService http.post false");
                    return false;
                }
            });
    }

    logout() {
        localStorage.removeItem('mtAuth');
        this.events.publish('loggedin');
        console.log("authService logout");
    }


    register(c:Company):Observable<NewRecord> {
        let url: string = this.restUrl + "/home/register";
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        var requestOptions = new RequestOptions({ headers: headers });
        console.log(JSON.stringify(c));
        return this.http.post(url, JSON.stringify(c), requestOptions).map(res => res.json());
    }

    uploadString64(c:string) {
        let picture:Picture_s={table:'user',match_id:this.getLoginUser().id,id:0,company_id:1,order:0,data:c};
        let url: string = this.restUrl + "/home/UploadMobile";
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        var requestOptions = new RequestOptions({ headers: headers });
        // console.log(JSON.stringify(c));
        // this.showToast(c);
        return this.http.post(url, JSON.stringify(picture), requestOptions);//.map(res => res.json());
    }    

    deleteUserPicture(id) {
        let url = this.restUrl + "/Home/DeletePicture/" + id;
        console.log(url);
        return this.http.get(url,this.getRequestOptions()).map(res => { });
    } 

    getUserPicture(uid:number):Observable<Picture_s>{
        let url = this.restUrl + "/Home/GetUserPicture/"+uid;
        return this.http.get(url).map(x => x.json());
    }     

    getUploadTestPicture():Observable<string>{
        let url = this.restUrl + "/Home/GetUploadTestPictureByteToStr";
        return this.http.get(url).map(x => x.text());
    } 

    isUserExist(email:string):Observable<boolean>{
        let url = this.restUrl + "/User/UserExist/" + email;
        return this.http.get(url, this.getRequestOptions()).map(x => x.json());
    }

    isLogged(): boolean {
        return true;
    }

    getLoginUser(): User {
        let temp = localStorage.getItem('mtAuth');
        if (temp) {
            let userStroge = JSON.parse(localStorage.getItem('mtAuth')) as User;
            let now1 = new Date()
            // console.log(now1);
            // console.log(userStroge.date);
            // let now =Date.parse(now1.toISOString());
            // let ld= Date.parse(userStroge.date.toISOString());
            let now =Date.parse(now1.toISOString());
            let ld= Date.parse(new Date(userStroge.date).toISOString());
            let tm = (now-ld)/60000;
            console.log(now);
            console.log(ld);
            console.log("getLoginUser Time :");
            console.log(tm);
            if(tm>userStroge.tokenminute){
                // if(tm>1){
                console.log(" T I M E O U T");
                this.logout();
            } else console.log("auth OK");
            return userStroge;
        }
        else return null;
    }

    getToken(): string {
        let temp = localStorage.getItem('mtAuth');
        if (temp) {
            let userStroge = JSON.parse(localStorage.getItem('mtAuth')) as User;
            return userStroge.token;
        }
        else return "";
    }

    getRequestOptions(): RequestOptions {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let _lu = this.getLoginUser();
        if(_lu) headers.append("Authorization", "Bearer " + _lu.token);
        return new RequestOptions({ headers: headers });
    }
    getRequestOptionsNoToken(): RequestOptions {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return new RequestOptions({ headers: headers });
    }    

    showToast(p, position?) {
        let toast = this.toastController.create({
            message: p,
            duration: 3000,
            showCloseButton: true,
            closeButtonText: "Kapat",
            position: position
            //   ,cssClass:"ion-button"
        });
        toast.present();
    }
    showToastTimer(p, t:number ,position?) {
        let toast = this.toastController.create({
            message: p,
            duration: t,
            showCloseButton: true,
            closeButtonText: "Kapat",
            position: position
            //   ,cssClass:"ion-button"
        });
        toast.present();
    }

    errShow(err: any) {
        let msgText = "Hata Oluştu.";
        if (err.status == 401) {
            msgText = err.statusText + " Yetkilendirme Hatası.";
        }
        this.showToast(msgText);
    }

    errShowCustom(text: string) {
        this.showToast(text);
    }

    private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if (err instanceof Response) {
            return Observable.throw(err.json() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }
}