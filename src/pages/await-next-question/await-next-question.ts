import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteChoice, MeetingPatientQuestion, Role, Vote, VoteResults } from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../../pages/choose-vote/choose-vote';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { VoteMessage } from './../../models/interfaces';
import { Chart } from 'chart.js';
import { ChartOptions } from '../../models/config';

@IonicPage()
@Component({
  selector: 'page-await-next-question',
  templateUrl: 'await-next-question.html',
})
export class AwaitNextQuestionPage {

  @ViewChild('chartCanvas') chartCanvas;

  waiting: boolean = true;
  resultsChart: any;
  voteCount: string;
  currentMessage: string;
  chartData: Array<number> = [0, 0, 0, 0, 0];
  _chartOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();


  }

  checkCurrentQuestionStatus() {
    this.voteProvider.getCurrentQuestion()
      .then((question: MeetingPatientQuestion) => {
        if (question.votingOpen) {
          this.waiting = true;
          this.currentMessage = 'Please wait for voting on this question to close.'
        } else {
          this.waiting = false;
        }
      })
  }

  nextQuestion() {
    this.voteProvider.getNextQuestion()
      .then(() => {
        this.navCtrl.push(ChooseVotePage)
      })
      .catch(error => {
        if (error.code = 404) {
          this.waiting = true;
          this.currentMessage = 'There are no more questions for this patient.'
          this.ref.detectChanges();
        }
      })
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

  ionViewWillEnter() {
    //incoming message handler
    this.messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log(message);

      //voting closed for this question
      if (message.meetingPatientQuestionID == this.voteProvider.currentQuestion.meetingPatientQuestionID
        && message.messageCode == 'questionclosed') {

        this.voteProvider.getResults()
          .then((results: VoteResults) => {
            this.waiting = false;
            this.currentMessage = 'Voting on this question is now closed.';
            this.ref.detectChanges();
            this.renderChart(results.chartData);
            this.voteCount = "Average score: " + results.averageScore.toFixed(1);
            this.ref.detectChanges();
          })
      }

      //voting closed for current patient


      //meeting over


    })
  }

  ionViewWillLeave() {
    this.messaging.messageChange.unsubscribe();
  }

  ///ngOnDestroy() {
    //this.messaging.messageChange.unsubscribe();
  //}
}
