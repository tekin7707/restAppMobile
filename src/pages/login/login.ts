import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string = "";
  password: string = "";
  sonuc: boolean = false;
  users: User[];
  loggedUser: User;
  tests: string[];
  constructor(
    public nav: NavController,//bir yere gitmek için
    public navParams: NavParams,//gelinen sayfadan parametre okumak için
    public authService: AuthService,
    public loadingController: LoadingController,
    public events: Events
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (login_ts_constructer) -> ");
    console.log(this.loggedUser);
    if (this.loggedUser) this.nav.setRoot(HomePage);
  }

  ionViewDidLoad() {
    // let loader = this.loadingController.create();
    // loader.setContent("L o a d i n g");
    // loader.present().then(() => {
    //   loader.dismiss();
    // });
  }

  login() {
    console.log(this.email);
    this.authService.login(this.email, this.password).subscribe(x => {
      this.events.publish('loggedin');
      this.nav.setRoot(HomePage);
    },
    err => {
      console.log(err);
      this.authService.errShowCustom("Email veya Şifre Hatalı");
    });
  }
  register(){
    this.nav.setRoot(RegisterPage);
  }

}
