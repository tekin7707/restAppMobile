import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovementDetailPage } from './movement-detail';

@NgModule({
  declarations: [
    MovementDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MovementDetailPage),
  ],
})
export class MovementDetailPageModule {}
