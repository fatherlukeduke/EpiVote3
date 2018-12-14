import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChoosePatientPage } from './choose-patient';

@NgModule({
  declarations: [
    ChoosePatientPage,
  ],
  imports: [
    IonicPageModule.forChild(ChoosePatientPage),
  ],
})
export class ChoosePatientPageModule {}
