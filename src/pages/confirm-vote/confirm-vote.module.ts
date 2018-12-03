import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmVotePage } from './confirm-vote';

@NgModule({
  declarations: [
    ConfirmVotePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmVotePage),
  ],
})
export class ConfirmVotePageModule {}
