import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer, ActionSheetController, ToastController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/user.service';
import { Camera } from '@ionic-native/camera';
import { Picture_s } from '../../models/Picture';


@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
  providers: [UserService]
})
export class UserDetailPage {
  public base64Image: string;
  public userPicture: Picture_s;
  loading: Loading;
  loggedUser: User;
  user: User;
  mode: string = "detail";//-insert -update -delete -confirm
  readyForUpload: boolean = false;
  constructor(
    public nav: NavController,//bir yere gitmek için
    public navParams: NavParams,//gelinen sayfadan parametre okumak için
    public authService: AuthService,
    public userService: UserService,
    public loadingController: LoadingController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (user_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
    this.authService.getUserPicture(this.loggedUser.id).subscribe(x => {
      this.userPicture = x;
      this.base64Image = x.data;
    });
  }

  accessGallery() {
    this.camera.getPicture({
      quality: 10,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = imageData;
      this.readyForUpload=true;
    }, (err) => {
      console.log(err);
    });
  }

  accessCamera() {
    this.camera.getPicture({
      quality: 20,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.base64Image = imageData;
      this.readyForUpload=true;
    }, (err) => {
      console.log(err);
    });
  }
  deleteUserPicture() {
    this.loading = this.loadingController.create({
      content: 'Siliniyor...',
    });
    this.loading.present();
    this.base64Image = null;
    if (this.userPicture) {
      this.authService.deleteUserPicture(this.userPicture.id).subscribe(x => {
        this.loading.dismiss();
        this.authService.showToast("Resim Silindi.");
      },
        err => {
          this.loading.dismiss();
          this.authService.showToast("Hata:" + err.message);
          // this.handleError(err, LoginPage);
        });
    }
    else {
      this.loading.dismiss();
    }


  }
  uploadImage() {
    this.loading = this.loadingController.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.authService.uploadString64(this.base64Image).subscribe(x => {
      this.loading.dismiss();
      this.authService.showToast("Resim Eklendi.");
    },
      err => {
        this.loading.dismiss();
        this.authService.showToast("Hata:" + err.message);
        // this.handleError(err, LoginPage);
      });

  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Galeriden Yükle',
          handler: () => {
            this.accessGallery();
          }
        },
        {
          text: 'Kamerayı Kullan',
          handler: () => {
            this.accessCamera();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserDetailPage');
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getUser(this.loggedUser.id);
      loader.dismiss();
    });
  }

  prepare(_m, fab: FabContainer) {
    fab.close();
    this.mode = _m;
    console.log(_m);
    this.authService.getUploadTestPicture().subscribe(x => {
      // console.log(x);
      this.base64Image = x;
    });

    if (_m == 'insert') {
      this.user.id = 0;
      this.user.name = "";
      this.user.email = "";
      this.user.address = "";
    }
    else if (_m == 'edit') {

    }
    else if (_m == 'delete') {
    }
  }

  confirm() {
    console.log("confirm User ");
    if (this.user.id > 0) {
      if (this.mode == 'delete') {
        console.log("delete :" + this.user.id);
        this.delete();
      } else {
        console.log("edit :" + this.user.id);
        this.update();
      }
    }
    else {
      console.log("new");
      this.create();
    }
  }

  update() {
    this.loading = this.loadingController.create({
      content: 'Uploading...',
    });
    this.loading.present();

    this.userService.updateUser(this.user).subscribe(x => {
      console.log("update ok.");
      this.authService.showToast(this.user.name + " Güncellendi.");
      this.loading.dismiss();
      setTimeout(x => {
        this.nav.setRoot(UserDetailPage);
      }, 2000);
    },
      err => {
        this.loading.dismiss();
        console.log("updateUserDetail error");
        this.handleError(err, LoginPage);
      });
  }

  create() {
    this.userService.addUser(this.user).subscribe(x => {
      this.user = x;
      console.log(x);
      this.authService.showToast(this.user.name + " Eklendi.");
      setTimeout(x => {
        this.nav.setRoot(UserDetailPage);
      }, 1000);
    },
      err => {
        console.log("createUserDetail error");
        this.handleError(err, LoginPage);
      });
  }

  delete() {
    // if (confirm("Kaydı Silmek istediğinizden emin misiniz?")) {
    this.userService.delUser(this.user.id).subscribe(x => {
      this.authService.showToast(" Kayıt Silindi.");
      setTimeout(x => {
        this.nav.setRoot(LoginPage);
      }, 2000);
      // setTimeout(x => {
      // this.nav.setRoot(UserPage);
      // }, 1000);
    },
      err => {
        console.log("deleteUserDetail error");
        this.handleError(err, LoginPage);

      });
    // }
  }

  cancel() {
    this.getUser(this.loggedUser.id);
    console.log(this.user);
    this.mode = "detail";
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(x => {
      this.user = x;
      console.log("getUser OK");

    },
      err => {
        console.log("getuser error");
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
