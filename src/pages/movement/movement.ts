import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer } from 'ionic-angular';
import { MovementService } from '../../providers/movement.service';
import { Movement_List } from '../../models/Movement';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { LoginPage } from '../login/login';
import { MovementDetailPage } from '../movement-detail/movement-detail';

@IonicPage()
@Component({
  selector: 'page-movement',
  templateUrl: 'movement.html',
  providers: [MovementService]
})
export class MovementPage {
  movement_list: Movement_List[];
  loggedUser: User;
  orjML: any;
  mode: string = "detail";

  constructor(
    public movementService: MovementService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public nav: NavController,
    public navParams: NavParams
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (user_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovementPage');
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getMovementList();
      loader.dismiss();
    });
  }

  getItems(ev) {
    // console.log(this.orjML);
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.movement_list = this.orjML.filter((item) => {
        return (item.customer_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else this.movement_list = this.orjML;
  }

  itemTapped(event, _mov) {
    this.nav.push(MovementDetailPage, {
      mov_id: _mov.movement.id
    });
  }

  getMovementList() {
    console.log("getMovementList");
    this.movementService.getMovementList(this.loggedUser.company_id).subscribe(x => {
      this.movement_list = x;//.sort((n1,n2)=> n1.movement.date < n2.movement.date);
      this.orjML = x;//.sort((n1,n2)=> n1.movement.date < n2.movement.date);
      console.log(this.movement_list);
    },
      err => {
        console.log("getMovementList error");
        this.handleError(err,MovementPage);
      });
  }

  prepare(fab: FabContainer) {
    fab.close();
    this.nav.push(MovementDetailPage, {
      mov_id: 0,mode:"insert"
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
