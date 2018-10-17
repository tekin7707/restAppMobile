import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer } from 'ionic-angular';
import { MovementPage } from '../movement/movement';
import { MovementService } from '../../providers/movement.service';
import { AuthService } from '../../providers/auth.service';
import { Movement_s, Movement, Movement_Lines } from '../../models/Movement';
import { Customer } from '../../models/customer';
import { MovementType } from '../../models/MovementType';
import { CustomerService } from '../../providers/customer.service';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-movement-detail',
  templateUrl: 'movement-detail.html',
  providers: [MovementService, CustomerService]
})
export class MovementDetailPage {
  loggedUser: User;
  // movement: Movement_s;
  mov_id: number = 0;
  sdate: string = "";

  customer_id: number = 0;
  mt_id: number = 0;
  mode: string = "detail";//-insert -update -delete -confirm

  customers: Customer[] = [];
  movementTypes: MovementType[] = [];
  _movement: Movement = { id: 0, date: null, price: 0, tax: 0, totalprice: 0, note: "", ref_id: 0, movement_type_id: 0, customer_id: 0, company_id: 0 };
  _customer: Customer = { id: 0, company_id: 0, name: "", pname: "", psurname: "", address: "", vd: "", vn: "" };
  _movement_type: MovementType[] = [{ id: 0, company_id: 0, name: "", plus: true, ref: false, note: "" }];
  _movement_line: Movement_Lines = { id: 0, quantity: 1, master_id: 0, name: "", price: 0, tax: 0, vat: 0, totalprice: 0 };
  movement: Movement_s;
  //  = { movement: this._movement, movement_type: this._movement_type[0], customer: this._customer[0], movement_lines: [this._movement_line] };

  constructor(
    public movementService: MovementService,
    public customerService: CustomerService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public nav: NavController,
    public navParams: NavParams) {

    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (user_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
    console.log("mov_id:");
    this.mov_id = navParams.get("mov_id");
    if (this.mov_id == 0)
      this.mode = navParams.get("mode");
    customerService.getCustomers(this.loggedUser.company_id).subscribe(x => {
      this.customers = x;
    },
      err => {
        this.authService.errShow(err);
        console.log("getCustomers - MovementDetail error");
      });
    movementService.getMovementTypes(this.loggedUser.company_id).subscribe(x => {
      this.movementTypes = x;
    },
      err => {
        this.authService.errShow(err);
        console.log("getMovementTypes - MovementDetail error");
        this.nav.setRoot(HomePage);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovementDetailPage');
    this.getMovement(this.mov_id);
  }

  getMovement(mov_id: number) {
    if (mov_id > 0) {
      this.movementService.getMovement(mov_id).subscribe(x => {
        this.movement = x;
        this.customer_id = this.movement.customer.id;
        this.mt_id = this.movement.movement_type.id;
        this.sdate = new Date(this.movement.movement.date).toISOString();
      },
        err => {
          this.authService.errShow(err);
          console.log("getMovementDetail error");
        });
    }
    else {
      this._movement.company_id = this.loggedUser.company_id;
      this.movement = { movement: this._movement, movement_type: this._movement_type[0], customer: this._customer, movement_lines: [this._movement_line] };
      this.customer_id = 0;
      this.movement.movement.date = new Date();
      this.mt_id = 0;
      this.sdate = new Date().toISOString();
      console.log(this.movement);
    }
  }

  prepare(_m: string, fab: FabContainer) {
    fab.close();
    this.mode = _m;
    this.nav.push(MovementDetailPage, {
      mov_id: 0, mode: "insert"
    });
  }

  confirm() {
    console.log("confirm Customer ");
    if (this.movement.movement.id > 0) {
      if (this.mode == 'delete') {
        console.log("delete :" + this.movement.movement.id);
        this.delete();
      }
      else {
        console.log("edit :" + this.movement.movement.id);
        this.update();
      }
    }
    else {
      console.log("new");
      console.log(this.movement);
      this.create();
    }
  }
  customerSelect(_item: any) {
    this.movement.movement.customer_id = _item;
    console.log(_item);
  }
  mtSelect(_item: any) {
    this.movement.movement.movement_type_id = _item;
    console.log(_item);
  }
  changeDate(_item) {
    console.log(_item);
    this.movement.movement.date = this.getIonDate(_item);
    console.log(this.movement.movement.date);
  }

  getIonDate(_d: any): Date {
    return new Date(_d.year, _d.month - 1, _d.day, _d.hour, _d.minute, _d.second);
  }

  cancel() {
    this.mode = "detail";
  }

  create() {
    this.movement.movement.totalprice = this.movement.movement.price;
    this.movement.movement_lines[0].totalprice = this.movement.movement.totalprice;
    this.movement.movement_lines[0].name = this.movement.movement.note;
    this.movementService.addMovement(this.movement).subscribe(x => {
      this.movement = x;
      console.log(x);
      this.authService.showToast(this.movement.customer.name + " Eklendi.");
      setTimeout(x => {
        this.nav.setRoot(MovementPage);
      }, 1000);
    },
      err => {
        console.log("createMovementDetail error");
        this.handleError(err, MovementPage);
      });
  }

  update() {
    this.movement.movement.totalprice = this.movement.movement.price;
    this.movement.movement_lines[0].totalprice = this.movement.movement.totalprice;
    this.movement.movement_lines[0].name = this.movement.movement.note;
    this.movementService.updateMovement(this.movement).subscribe(x => {
      console.log("update ok.");
      this.authService.showToast(this.movement.customer.name + " Güncellendi.");
      setTimeout(x => {
        this.nav.setRoot(MovementPage);
      }, 2000);
    },
      err => {
        console.log("updateMovementDetail error");
        this.handleError(err, MovementPage);
      });
  }
  delete() {
    this.movementService.deleteMovement(this.movement.movement.id, "Movement").subscribe(x => {
      this.authService.showToast("Kayıt Silindi");
      setTimeout(x => {
        this.nav.setRoot(MovementPage);
      }, 2000);
    },
      err => {
        console.log("deleteMovementDetail error");
        this.handleError(err, MovementPage);
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
