import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteProvider } from '../../providers/vote/vote';
import { HomePage } from '../home/home';
import { ChooseVotePage } from './../choose-vote/choose-vote';
import { AwaitNextQuestionPage } from './../await-next-question/await-next-question';

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

  public choice : number;
  public fullChoice : string;
  public choiceText : string;
  public currentPatient : number;
  public currentQuestion;

  constructor(public navCtrl: NavController, public navParams: NavParams, public voteProvider: VoteProvider) {
    this.choice = navParams.get("choice");
    this.choiceText = navParams.get("choiceText");
    this.currentQuestion = voteProvider.currentQuestion;

    console.log(this.currentQuestion)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmVotePage');
  }


  confirm() {
    this.voteProvider.submitVote(this.choice)
     //.then(() =>  this.voteProvider.getNextQuestion() )
     .then(()=> {
      this.navCtrl.push(AwaitNextQuestionPage);
     })
    
  }

  cancel(){
    this.navCtrl.pop();
  }



}
