import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { NewRecord } from '../../models/new_record';
import { Company } from '../../models/Company';
import { LoginPage } from '../login/login';
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  afterRegister=false;
  name: string;
  password: string;
  password2: string;
  email: string;
  mesaj: string = "";
  isee: boolean = true;
  new_record: NewRecord;
  company: Company = { id: 0, email: "", password: "", name: "", state: 1, address: "" };
  nrok:string="";
  constructor(
    public nav: NavController,//bir yere gitmek için
    public navParams: NavParams,//gelinen sayfadan parametre okumak için
    public authService: AuthService,
    public loadingController: LoadingController,
  ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    console.log(this.email);
    if (this.password == this.password2) {

      this.authService.isUserExist(this.email).subscribe(x => {
        this.isee = x;
        if (x == false) {
          console.log("Email uygun");
          this.company.email = this.email;
          this.company.name = this.name;
          this.company.password = this.password;
          this.authService.register(this.company).subscribe(x => {
            this.new_record = x;
            console.log(x);
            this.afterRegister=true;
            this.authService.showToastTimer(x.company.name + " Eklendi. Giriş Yapabilirsiniz.",5000);
            setTimeout(x => {
              this.nav.setRoot(LoginPage);
            }, 3000);

          },
            err => {
              console.log(err);
              this.authService.errShow(err);
            });
        } else {
          this.mesaj = "Email kullanımda. Kayıtlı iseniz şifre hatırlatmayı kullanınız!";
        }
      },
        err => {
          console.log(err);
          this.authService.errShow(err);
        });


    } else {
      this.mesaj = "Şifreler Eşleşmiyor";
    }
  }

}
