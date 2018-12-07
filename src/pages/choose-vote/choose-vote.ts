import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfirmVotePage } from '../confirm-vote/confirm-vote';
import { VoteProvider } from '../../providers/vote/vote';
import { VoteChoice, MeetingPatientQuestion } from '../../models/interfaces';


@IonicPage()
@Component({
  selector: 'page-choose-vote',
  templateUrl: 'choose-vote.html',
})
export class ChooseVotePage {
  currentPatient: number;
  votingChoices: VoteChoice;
  currentQuestion: MeetingPatientQuestion;
  loading : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public voteProvider: VoteProvider) {
      this.votingChoices = voteProvider.votingChoices;
      this.currentQuestion = voteProvider.currentQuestion;
      this.loading = false;
  }

  submitVote(choice, choiceText) {
    this.navCtrl.push(ConfirmVotePage, { choice: choice, choiceText: choiceText })
  }

}