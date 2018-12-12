import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteChoice, MeetingPatientQuestion, Role } from '../../models/interfaces';
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, public messaging: MessagingProvider) {

    this.checkCurrentQuestionStatus();

    //incoming message handler
    messaging.messageChange.subscribe((message: VoteMessage) => {
      console.log(message);
      if (message.meetingPatientQuestionID == voteProvider.currentQuestion.meetingPatientQuestionID
        && message.votingOpen == "false") {
        this.loading = false;
        this.ref.detectChanges();
        this.renderChart();
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

  renderChart() {
    //render chart
    this.resultsChart = new Chart(this.chartCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
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

  ngOnDestroy(){
    this.messaging.messageChange.unsubscribe();
  }
}
