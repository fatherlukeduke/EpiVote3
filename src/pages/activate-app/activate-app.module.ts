import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivateAppPage } from './activate-app';

@NgModule({
  declarations: [
    ActivateAppPage,
  ],
  imports: [
    IonicPageModule.forChild(ActivateAppPage),
  ],
})
export class ActivateAppPageModule {}
