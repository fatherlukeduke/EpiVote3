import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteChoice, MeetingPatientQuestion, Role, Vote, VoteResults } from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../../pages/choose-vote/choose-vote';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { VoteMessage } from './../../models/interfaces';
import { Chart } from 'chart.js';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();

    //incoming message handler
    messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log(message);
      if (message.meetingPatientQuestionID == voteProvider.currentQuestion.meetingPatientQuestionID
        && message.votingOpen == "false") {

        voteProvider.getResults()
          .then((results: Array<Vote>) => {
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
    //render chart
    this.resultsChart = new Chart(this.chartCanvas.nativeElement, {

      type: 'horizontalBar',
      data: {
        labels: ["Strongly agree", "Agree", "Neutral", "Disagree", "Stongly disagree"],
        datasets: [{
          label: '',
          data: chartSummaryData,
          backgroundColor: [
            '#39a16c',
            '#bad530',
            '#feac27',
            '#ff8c33',
            '#ff696a'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontSize: 17
            }
          }]
        }
      }
    });

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
