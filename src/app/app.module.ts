import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Contacts } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms'
import { AndroidPermissions} from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';

import { HttpModule } from "@angular/http";
import { AuthService } from '../providers/auth.service';
import { LoginPage } from '../pages/login/login';
import { CustomerPage } from '../pages/customer/customer';
import { CustomerDetailPage } from '../pages/customer-detail/customer-detail';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { MovementPage } from '../pages/movement/movement';
import { MovementDetailPage } from '../pages/movement-detail/movement-detail';
import { RegisterPage } from '../pages/register/register';
import { NotePage } from '../pages/note/note';
import { NoteDetailPage } from '../pages/note-detail/note-detail';
import { MyTestPage } from '../pages/my-test/my-test';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
    , MyTestPage
    , LoginPage
    , CustomerPage
    , CustomerDetailPage
    , UserDetailPage
    , MovementPage
    , MovementDetailPage
    , RegisterPage
    , NotePage
    , NoteDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
    , MyTestPage
    , LoginPage
    , CustomerPage
    , CustomerDetailPage
    , UserDetailPage
    , MovementPage
    , MovementDetailPage
    , RegisterPage
    , NotePage
    , NoteDetailPage
  ],
  providers: [
    Camera,
    Sim,
    Contacts,
    SMS,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
    , { provide: "restUrl", useValue: "http://rest.webticaret.xyz/api" }
    // , { provide: "restUrl", useValue: "http://localhost:54823/api" }
    , AuthService
  ]
})
export class AppModule { }
