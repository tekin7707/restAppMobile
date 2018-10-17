import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events, FabContainer } from 'ionic-angular';
import { NoteDetailPage } from '../note-detail/note-detail';
import { NoteService } from '../../providers/note.service';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';
import { Note_s } from '../../models/Note_s';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
  providers: [NoteService]
})
export class NotePage {
  loggedUser: User;
  notes: Note_s[];
  orjNotes: Note_s[];
  mode: string = "detail";
  constructor(
    public nav: NavController,//bir yere gitmek için
    public navParams: NavParams,//gelinen sayfadan parametre okumak için
    public authService: AuthService,
    public noteService: NoteService,
    public loadingController: LoadingController,
    public events: Events,
    public toastController: ToastController
  ) {
    this.loggedUser = this.authService.getLoginUser();
    console.log("loggedUser (customer_ts)-> ");
    console.log(this.loggedUser);
    if (!this.loggedUser) this.nav.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotePage');
    let loader = this.loadingController.create();
    loader.setContent("L o a d i n g");
    loader.present().then(() => {
      this.getNotes();
      loader.dismiss();
    });
  }

  getItems(ev) {
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.notes = this.orjNotes.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    else this.notes = this.orjNotes;
  }

  itemTapped(event, _note) {
    this.nav.push(NoteDetailPage, {
      note_id: _note.id
    });
  }

  getNotes() {
    this.noteService.getNotes(this.loggedUser.company_id).subscribe(x => {
      this.notes = x;
      this.orjNotes = x;
      console.log("getNotes OK");
    },
      err => {
        console.log("getNotes error");
        this.handleError(err, LoginPage);
      });
  }

  prepare(fab: FabContainer) {
    fab.close();
    this.nav.push(NoteDetailPage, {
      note_id: 0, mode: "insert"
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
