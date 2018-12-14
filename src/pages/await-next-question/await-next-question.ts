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

  loading: boolean = true;
  resultsChart: any;
  chartData: Array<number> = [0, 0, 0, 0, 0];
  _chartOptions : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();

    //incoming message handler
    messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log(message);
      if (message.meetingPatientQuestionID == voteProvider.currentQuestion.meetingPatientQuestionID
        && message.votingOpen == "false") {

        voteProvider.getResults()
          .then((results: Array<VoteResults>) => {
            this.loading = false;
            this.ref.detectChanges();

            results.forEach(element => {
              switch (element.voteChoiceID) {
                case 5:
                  this.chartData[0]++;
                  break;
                case 4:
                  this.chartData[1]++;
                  break;
                case 3:
                  this.chartData[2]++;
                  break;
                case 2:
                  this.chartData[3]++;
                  break;
                case 1:
                  this.chartData[4]++;
                  break;
              }
            })
          })
          .then(() => {
            this.renderChart(this.chartData)
          })

      }
    })
  }

  checkCurrentQuestionStatus() {
    this.voteProvider.getCurrentQuestion()
      .then((question: MeetingPatientQuestion) => {
        if (question.votingOpen) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      })
  }

  nextQuestion() {
    this.voteProvider.getNextQuestion()
      .then(() => {
        this.navCtrl.push(ChooseVotePage)
      })
  }

  renderChart(chartSummaryData: Array<number>) {

    this._chartOptions = ChartOptions
    this._chartOptions.data.datasets[0].data = chartSummaryData;

    //render chart
    this.resultsChart = new Chart(this.chartCanvas.nativeElement, this._chartOptions );

    //refresh screen
    this.ref.detectChanges()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AwaitNextQuestionPage');
  }

  ngOnDestroy() {
    this.messaging.messageChange.unsubscribe();
  }
}
