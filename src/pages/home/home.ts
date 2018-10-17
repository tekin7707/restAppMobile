import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { TestService } from '../../services/test.service';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
  , providers: [TestService]
})
export class HomePage {
  mesaj = "";
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
    public testService: TestService,
    public loadingController: LoadingController
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (home_ts_constructer)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);

  }

  ionViewDidLoad() {
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      // this.getTests();
      this.getUsers();
      loader.dismiss();
    });
  }

  getUsers() {
    this.testService.getUser().subscribe(x => {
      this.users = x;
    },
      err => {
        this.authService.errShow(err);
        console.log("deleteUserDetail error");
      });
  }

  getTests() {
    this.testService.getTest().subscribe(x => {
      this.tests = x;
    });
  }

  login() {
    console.log(this.email);
    this.authService.login(this.email, this.password).subscribe(x => {
      this.sonuc = x;
      this.nav.setRoot(HomePage);
    },
      err => {
        this.authService.errShow(err);
        console.log("deleteUserDetail error");
      });
  }
}
