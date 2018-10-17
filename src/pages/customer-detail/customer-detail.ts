import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer, LoadingController } from 'ionic-angular';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../providers/customer.service';
import { CustomerPage } from '../customer/customer';
import { AuthService } from '../../providers/auth.service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-customer-detail',
  templateUrl: 'customer-detail.html',
  providers: [CustomerService]
})
export class CustomerDetailPage {
  customer: Customer;
  cid: number;
  mode: string = "detail";//-insert -update -delete -confirm
  constructor(
    public authService: AuthService,
    public customerService: CustomerService,
    public loadingController: LoadingController,
    public nav: NavController,
    public navParams: NavParams
  ) {
    this.cid = navParams.get('customer_id');
    console.log('CustomerDetailPage constructer cid:', this.cid);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerDetailPage');
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getCustomer(this.cid);
      loader.dismiss();
    });
  }
  prepare(_m, fab: FabContainer) {
    fab.close();
    this.mode = _m;
    console.log(_m);
    if (_m == 'insert') {
      this.customer.id = 0;
      this.customer.name = "";
      this.customer.pname = "";
      this.customer.psurname = "";
      this.customer.vd = "";
      this.customer.vn = "";
      this.customer.address = "";
    }
    else if (_m == 'edit') {

    }
    else if (_m == 'delete') {
    }
  }

  confirm() {
    console.log("confirm Customer ");
    if (this.customer.id > 0) {
      if (this.mode == 'delete') {
        console.log("delete :" + this.customer.id);
        this.delete();
      } else {
        console.log("edit :" + this.customer.id);
        this.update();
      }
    }
    else {
      console.log("new");
      this.create();
    }
  }

  update() {
    this.customerService.updateCustomer(this.customer).subscribe(x => {
      console.log("update ok.");
      this.authService.showToast(this.customer.name + " Güncellendi.");
      setTimeout(x => {
        this.nav.setRoot(CustomerPage);
      }, 2000);
    },
      err => {
        console.log("updatecustomer error");
        this.handleError(err, LoginPage);
      });
  }

  create() {
    this.customerService.addCustomer(this.customer).subscribe(x => {
      this.customer = x;
      console.log(x);
      this.authService.showToast(this.customer.name + " Eklendi.");
      setTimeout(x => {
        this.nav.setRoot(CustomerPage);
      }, 2000);
    },
      err => {
        console.log("addcustomer error");
        this.handleError(err, LoginPage);
      });
  }

  delete() {
    // if (confirm("Kaydı Silmek istediğinizden emin misiniz?")) {
    this.customerService.delCustomer(this.customer.id).subscribe(x => {
      this.authService.showToast(" Kayıt Silindi.");
      setTimeout(x => {
        this.nav.setRoot(CustomerPage);
      }, 2000);
    },
      err => {
        console.log("deleteCustomer error");
        this.handleError(err, LoginPage);
      });
    // }
  }

  cancel() {
    this.getCustomer(this.cid);
    console.log(this.customer);
    this.mode = "detail";
  }

  getCustomer(id: number) {
    this.customerService.getCustomer(id).subscribe(x => {
      this.customer = x;
      console.log("getCustomer OK");
    },
      err => {
        console.log("getcustomer error");
        this.handleError(err, LoginPage);
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
