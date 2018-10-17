import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { LoginPage } from '../login/login';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../providers/customer.service';
import { CustomerDetailPage } from '../customer-detail/customer-detail';

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
  providers: [CustomerService]
})
export class CustomerPage {
  loggedUser: User;
  customers: Customer[];
  orjCustomers: Customer[];
  constructor(
    public nav: NavController,//bir yere gitmek için
    public navParams: NavParams,//gelinen sayfadan parametre okumak için
    public authService: AuthService,
    public customerService: CustomerService,
    public loadingController: LoadingController,
    public events: Events,
    public toastController: ToastController
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (customer_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
  }
  getItems(ev) {
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.customers = this.orjCustomers.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }
  itemTapped(event, _customer) {
    this.nav.push(CustomerDetailPage, {
      customer_id: _customer.id
    });
  }
  ionViewDidLoad() {
    console.log('CustomerPage ionViewDidLoad');
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getCustomers();
      loader.dismiss();
    });
  }

  getCustomers() {
    this.customerService.getCustomers(this.loggedUser.company_id).subscribe(x => {
      this.customers = x;
      this.orjCustomers = x;
      console.log("getCustomers OK");
    },
      err => {
        console.log("getcustomers error");
        this.handleError(err,LoginPage);
      });
  }
  handleError(err: any, _page: any) {
    console.log(err);
    if (err.status == 0) {
      this.authService.errShowCustom("Servise ulaşılamıyor. Bağlantı Hatası.");
      this.nav.setRoot(LoginPage);
    }
    else if (err.status == 401) {
      this.authService.errShow(err);
      this.nav.setRoot(LoginPage);
    }
    else {
      this.authService.errShow(err);
    }
  }  
}
