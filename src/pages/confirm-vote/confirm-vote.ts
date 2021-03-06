import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteProvider } from '../../providers/vote/vote';
import { HomePage } from '../home/home';
import { ChooseVotePage } from './../choose-vote/choose-vote';
import { AwaitNextQuestionPage } from './../await-next-question/await-next-question';
import { MeetingPatientQuestion } from '../../models/interfaces';

/**
 * Generated class for the ConfirmVotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-vote',
  templateUrl: 'confirm-vote.html',
})
export class ConfirmVotePage {

  choice : number;
  fullChoice : string;
  choiceText : string;
  currentPatient : number;
  currentQuestion : MeetingPatientQuestion;
  isenabled: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public voteProvider: VoteProvider) {
    this.choice = navParams.get("choice");
    this.choiceText = navParams.get("choiceText");
    this.currentQuestion = voteProvider.currentQuestion;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmVotePage');
  }


  confirm() {
    this.isenabled = false;
    this.voteProvider.lastMeetingPatientQuestionID = this.currentQuestion.meetingPatientQuestionID;
    this.voteProvider.submitVote(this.choice)
     .then(()=> {
      this.navCtrl.push(AwaitNextQuestionPage);
     })
    
  }

  cancel(){
    this.navCtrl.pop();
  }



}
