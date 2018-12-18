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
import { ChoosePatientPage } from './../choose-patient/choose-patient';

@IonicPage()
@Component({
  selector: 'page-await-next-question',
  templateUrl: 'await-next-question.html',
})
export class AwaitNextQuestionPage {

  @ViewChild('chartCanvas') chartCanvas;

  waiting: boolean = true;
  nextPatient: boolean = false;
  showResults: boolean = false;
  resultsChart: any;
  voteCount: string;
  currentMessage: string;
  //chartData: Array<number> = [0, 0, 0, 0, 0];
  _chartOptions: any;
  messageSub : Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
    //incoming message handler
    this.messageSub = this.messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log(message);

      //voting closed for this question
      if (message.meetingPatientQuestionID == this.voteProvider.currentQuestion.meetingPatientQuestionID
        && message.messageCode == 'questionclosed') {
        console.log('Question closed');
        this.getResults();
      }

      //voting closed for current patient
      if (message.meetingPatientID == this.voteProvider.currentQuestion.meetingPatientID
        && message.messageCode == 'patientclosed') {
         console.log('Patient closed')
         this.waiting = false;
         this.showResults = false;
         this.nextPatient = true;
         
         this.currentMessage = 'The voting has closed for this patient.';
         this.ref.detectChanges();

      }

      //meeting over
      if (message.meetingID == this.voteProvider.currentQuestion.meetingID
        && message.messageCode == 'meetingclosed') {

      }

    })
  }

  checkCurrentQuestionStatus() {
    this.voteProvider.getCurrentQuestion()
      .then((question: MeetingPatientQuestion) => {
        if (question.votingOpen) {
          this.waiting = true;
          this.showResults = false;
          this.currentMessage = 'Please wait for voting on this question to close.'
        } else {
          this.waiting = false;
          this.showResults = true;
          this.currentMessage = '';
          this.getResults();
        }
      })
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

  nextQuestion() {
    this.voteProvider.getCurrentPatient()
      .then(patient => console.log(patient) )

    console.log('Current patient: ' + this.voteProvider.getCurrentPatient())
    this.voteProvider.getNextQuestion()
      .then(() => {
        this.navCtrl.push(ChooseVotePage)
      })
      .catch(error => {
        if (error.code = 404) {
          this.voteProvider.getCurrentPatient()
            .then(patient => {

            })
          this.waiting = true;
          this.showResults = false;
          this.currentMessage = 'Awaiting further questions for this patient.'
          this.ref.detectChanges();
        }
      })
  }

  chooseNextPatient(){
    this.navCtrl.push(ChoosePatientPage);
  }
  renderChart(chartSummaryData: Array<number>) {

    this._chartOptions = ChartOptions;
    this._chartOptions.data.datasets[0].data = chartSummaryData;

    //render chart
    this.resultsChart = new Chart(this.chartCanvas.nativeElement, this._chartOptions);
    this.ref.detectChanges()
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
