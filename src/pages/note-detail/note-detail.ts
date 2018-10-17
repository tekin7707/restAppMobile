import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, FabContainer } from 'ionic-angular';
import { NoteService } from '../../providers/note.service';
import { AuthService } from '../../providers/auth.service';
import { Note_s } from '../../models/Note_s';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { NotePage } from '../note/note';

@IonicPage()
@Component({
  selector: 'page-note-detail',
  templateUrl: 'note-detail.html',
  providers: [NoteService]
})
export class NoteDetailPage {
  loggedUser: User;
  note_id: number = 0;
  sdate: string = "";

  mode: string = "detail";//-insert -update -delete -confirm
  note: Note_s={ id:0, name:"",note_ : "", date:null, reminder:null,company_id:0, state:0};

  constructor(
    public noteService: NoteService,
    public authService: AuthService,
    public loadingController: LoadingController,
    public nav: NavController,
    public navParams: NavParams) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (note-detail_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
    console.log("note_id:");
    this.note_id = navParams.get("note_id");
    if (this.note_id == 0){
      this.note.company_id = this.loggedUser.company_id;
      this.mode = navParams.get("mode");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovementDetailPage');
    this.getNote(this.note_id);
  }

  getNote(note_id: number) {
    if (note_id > 0) {
      this.noteService.getNote(note_id).subscribe(x => {
        this.note = x;
        this.sdate = new Date(this.note.date).toISOString();
      },
        err => {
          this.authService.errShow(err);
          console.log("getMovementDetail error");
        });
    }
    else {

      this.note.date = new Date();
      this.sdate = new Date().toISOString();
      console.log(this.note);
    }
  }

  prepare(_m: string, fab: FabContainer) {
    fab.close();
    this.mode = _m;
    this.note.company_id = this.loggedUser.company_id;
    this.note.name="";
    this.note.note_="";
    this.note.date = new Date();//.toISOString();
  }

  confirm() {
    console.log("confirm Note ");
    if (this.note.id > 0) {
      if (this.mode == 'delete') {
        console.log("delete :" + this.note.id);
        this.delete();
      }
      else {
        console.log("edit :" + this.note.id);
        this.update();
      }
    }
    else {
      console.log("new");
      console.log(this.note);
      this.create();
    }
  }
  changeDate(_item) {
    console.log(_item);
    this.note.date = this.getIonDate(_item);
    console.log(this.note.date);
  }

  getIonDate(_d: any): Date {
    return new Date(_d.year, _d.month - 1, _d.day, _d.hour, _d.minute, _d.second);
  }

  cancel() {
    this.mode = "detail";
  }

  create() {
    this.noteService.addNote(this.note).subscribe(x => {
      this.note = x;
      console.log(x);
      this.authService.showToast(this.note.name + " Eklendi.");
      setTimeout(x => {
        this.nav.setRoot(NotePage);
      }, 1000);
    },
      err => {
        console.log("createNoteDetail error");
        this.handleError(err, NotePage);
      });
  }

  update() {
    this.noteService.updateNote(this.note).subscribe(x => {
      console.log("update ok.");
      this.authService.showToast(this.note.name + " Güncellendi.");
      setTimeout(x => {
        this.nav.setRoot(NotePage);
      }, 2000);
    },
      err => {
        console.log("updateNoteDetail error");
        this.handleError(err, NotePage);
      });
  }
  delete() {
    this.noteService.deleteNote(this.note.id).subscribe(x => {
      this.authService.showToast("Kayıt Silindi");
      setTimeout(x => {
        this.nav.setRoot(NotePage);
      }, 2000);
    },
      err => {
        console.log("deleteNoteDetail error");
        this.handleError(err, NotePage);
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
