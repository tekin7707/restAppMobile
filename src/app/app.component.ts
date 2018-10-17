import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { User } from '../models/user';
import { AuthService } from '../providers/auth.service';
import { LoginPage } from '../pages/login/login';
import { CustomerPage } from '../pages/customer/customer';
import { MovementPage } from '../pages/movement/movement';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { NotePage } from '../pages/note/note';
import { MyTestPage } from '../pages/my-test/my-test';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;
  loggedUser: User;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authService: AuthService,
    public events: Events
  ) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
      , { title: 'Müşteriler', component: CustomerPage }
      , { title: 'Hareketler', component: MovementPage }
      , { title: 'Notlarım', component: NotePage }
      , { title: 'Kullanıcı Ayarları', component: UserDetailPage }
      , { title: 'Test', component: MyTestPage }
      // ,{ title: 'Çıkış', component: LogoutPage }
    ];
    this.events.subscribe('loggedin', () => {
      this.loggedUser = this.authService.getLoginUser();
    });

    this.loggedUser = this.authService.getLoginUser();
  }//of constructor

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

 
  openPage(page) {
    console.log("openPage->" + page.title);
    this.loggedUser = this.authService.getLoginUser();
    this.loggedUser = this.authService.getLoginUser();
    if (this.loggedUser) this.nav.setRoot(page.component);
    else this.nav.setRoot(LoginPage);
  }

  logout() {
    localStorage.removeItem('mtAuth');
    this.loggedUser = this.authService.getLoginUser();
    console.log("appcomponent logout");
    this.nav.setRoot(LoginPage);
  }

  login() {
    console.log("appcomponent login");
    this.loggedUser = this.authService.getLoginUser();
    this.nav.setRoot(LoginPage);
  }
}
