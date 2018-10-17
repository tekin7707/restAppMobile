import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController, Platform } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Contacts } from '@ionic-native/contacts';
import { SMS } from '@ionic-native/sms';
import { AuthService } from '../../providers/auth.service';



@IonicPage()
@Component({
  selector: 'page-my-test',
  templateUrl: 'my-test.html',
})
export class MyTestPage {
  testNumber = 0;
  mesaj = "";
  //sms
  //contacts
  everybody;
  //sim
  public simInfo: any;
  public cards: any;
  constructor(
    public platform: Platform,
    private sms: SMS,
    private sim: Sim,
    public contacts: Contacts,
    public loadingController: LoadingController,
    public events: Events,
    public toastController: ToastController,
    public authService: AuthService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTestPage');
  }

  async sendSMS() {
    this.testNumber = 3;
    try {
      this.mesaj = "SMS Gönderiliyor";
      await this.sms.send('05334258329', 'Hello world!');
      this.mesaj = "SMS Gönderildi";
      this.authService.showToast("SMS Gönderildi");
    } catch (error) {
      this.authService.showToast("Hata: SMS Gönderilemedi." + error);
      console.log(error);
      this.mesaj = "Hata: SMS Gönderilemedi." + error;
    }
  }

  async getContacts() {
    this.testNumber = 2;
    try {
      this.everybody = await this.contacts.find(["*"]);
    } catch (error) {
      this.authService.showToast("Hata. Kişiler getirilemedi." + error);
      console.log(error);
    }
  }

  async getSimData() {
    this.testNumber = 1;
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getSimDatax();
      loader.dismiss();
    });
  }

  async getSimDatax() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.cards = simData.cards;
        console.log(simData);
      }
    } catch (error) {
      this.authService.showToast("Hata. Sim. " + error);
      console.log(error);
    }
  }



}
