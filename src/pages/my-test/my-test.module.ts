import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTestPage } from './my-test';

@NgModule({
  declarations: [
    MyTestPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTestPage),
  ],
})
export class MyTestPageModule {}
