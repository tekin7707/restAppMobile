import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoteDetailPage } from './note-detail';

@NgModule({
  declarations: [
    NoteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NoteDetailPage),
  ],
})
export class NoteDetailPageModule {}
