import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseVotePage } from './choose-vote';

@NgModule({
  declarations: [
    ChooseVotePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseVotePage),
  ],
})
export class ChooseVotePageModule {}
