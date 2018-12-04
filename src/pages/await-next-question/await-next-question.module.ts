import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AwaitNextQuestionPage } from './await-next-question';

@NgModule({
  declarations: [
    AwaitNextQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(AwaitNextQuestionPage),
  ],
})
export class AwaitNextQuestionPageModule {}
