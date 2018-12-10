import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteChoice , MeetingPatientQuestion, Role} from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../../pages/choose-vote/choose-vote';
import { MessagingProvider } from './../../providers/messaging/messaging';


@IonicPage()
@Component({
  selector: 'page-await-next-question',
  templateUrl: 'await-next-question.html',
})
export class AwaitNextQuestionPage {

  loading : boolean=true;

  constructor(public navCtrl: NavController, public navParams: NavParams,  
    private ref: ChangeDetectorRef, public voteProvider : VoteProvider, messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();

    messaging.messageChange.subscribe ((value) => {        
      this.loading = false;
      this.ref.detectChanges()
    })

  }

  checkCurrentQuestionStatus() {
    this.voteProvider.getCurrentQuestion()
    .then((question : MeetingPatientQuestion) => {
        if (question.votingOpen){
          this.loading = true;
        } else {
          this.loading = false;
        }
    })
  }
  
  nextQuestion(){
    this.voteProvider.getNextQuestion()
      .then(()=>{
        this.navCtrl.push(ChooseVotePage)
      })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AwaitNextQuestionPage');
  }

}
