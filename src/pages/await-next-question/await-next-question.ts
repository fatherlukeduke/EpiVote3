import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteChoice, MeetingPatientQuestion, Role, Vote, VoteResults } from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../../pages/choose-vote/choose-vote';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { VoteMessage } from './../../models/interfaces';
import { Chart } from 'chart.js';
import { ChartOptions } from '../../models/config';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-await-next-question',
  templateUrl: 'await-next-question.html',
})
export class AwaitNextQuestionPage {

  @ViewChild('chartCanvas') chartCanvas;

  waiting: boolean = true;
  //nextPatient: boolean = false;
  showResults: boolean = false;
  resultsChart: any;
  voteCount: string;
  currentMessage: string;
  _chartOptions: any;
  messageSub : Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.getCurrentQuestion();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    //incoming message handler
    this.messageSub = this.messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log('Incoming mesage: ' + JSON.stringify(message));
      console.log('message block, CurrentQuestionID: ' + this.voteProvider.currentMeetingPatientQuestionID)

      if (message.messageCode == 'question-open') {
        this.getCurrentQuestion();
      }

      //voting closed for this question
      if (message.meetingPatientQuestionID == this.voteProvider.currentMeetingPatientQuestionID
        && message.messageCode == 'voting-complete') {
        //console.log('Question closed');
         this.getResults();
      }

          //meeting over
          // if (message.meetingID == this.voteProvider.currentQuestion.meetingID
          //   && message.messageCode == 'meeting-closed') {
    
          // }

    })
  }

  getCurrentQuestion(){
    this.voteProvider.getActiveQuestion()
      .then((data : MeetingPatientQuestion) => {
          console.log(data);
          
          if (data.meetingPatientQuestionID === this.voteProvider.lastMeetingPatientQuestionID) {
            this.waitForNewQuestion('Waiting for the voting on this questions to close...');
          } else {
            this.navCtrl.push(ChooseVotePage);
          }  
      })
      .catch( (err) => {
        if(err.code = 404) {  //no active question
          console.log('No active question')
          this.waitForNewQuestion('No question currently open for voting.  Waiting.... ');
        }
      })
  }

  waitForNewQuestion(message){
    this.waiting = true;
    this.showResults = false;
    this.currentMessage = message;
    this.ref.detectChanges();
  }

  getResults(){
    this.voteProvider.getResults()
    .then((results: VoteResults) => {
      this.waiting = false;
      this.showResults = true;
      this.currentMessage = 'Voting on this question is now closed.';
      this.ref.detectChanges();
      this.renderChart(results.chartData);
      this.voteCount = "Average score: " + results.averageScore.toFixed(1);
      this.ref.detectChanges();
    })
  }


  renderChart(chartSummaryData: Array<number>) {

    this._chartOptions = ChartOptions;
    this._chartOptions.data.datasets[0].data = chartSummaryData;

    //render chart
    this.resultsChart = new Chart(this.chartCanvas.nativeElement, this._chartOptions);
    this.ref.detectChanges()
  }

  nextQuestion(){
    //check if any question open
    this.getCurrentQuestion();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AwaitNextQuestionPage');
  }

  //unsub from messages
  ionViewWillLeave() {
    console.log('ionViewWillLeave')
    this.messageSub.unsubscribe();
  }

}
