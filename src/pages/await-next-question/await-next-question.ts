import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingPatientQuestion, VoteResults } from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../../pages/choose-vote/choose-vote';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { VoteMessage } from './../../models/interfaces';
import { Chart } from 'chart.js';
import { ChartOptions } from '../../models/config';
import { Subscription } from 'rxjs/Subscription';
import { Platform } from 'ionic-angular';
import { HomePage } from '../home/home';


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
  messageSub: Subscription;
  resumeListener: Subscription;
  currentQuestionText: string;
  currentPatientNumber: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ref: ChangeDetectorRef, public voteProvider: VoteProvider, 
    public messaging: MessagingProvider, public platform: Platform) {

    this.getCurrentQuestion();
    this.checkMeetingStatus();


    this.resumeListener = platform.resume.subscribe( e => {
      this.checkMeetingStatus();
      this.getCurrentQuestion();
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter AwaitNextQuestion')

    this.messaging.subscribeToTopic('vote');

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
        this.getResults();
      }

      //meeting over
      if (message.meetingID == this.voteProvider.activeMeeting.meetingID
        && message.messageCode == 'meeting-closed') {
        this.navCtrl.push(HomePage, { toastMessage: 'The meeting was closed' });
      }

    })
  }

  //check if the meeting has been ended and return to homepage if so.
  checkMeetingStatus(){
    this.voteProvider.getActiveMeeting()
    .then(meeting => {
      if (!meeting) {
        this.navCtrl.push(HomePage, { toastMessage: 'The meeting was closed' });
      }
    })
  }

  getCurrentQuestion() {
    this.voteProvider.getActiveQuestion()
      .then((data: MeetingPatientQuestion) => {
        //console.log(data);

        if (data.meetingPatientQuestionID === this.voteProvider.lastMeetingPatientQuestionID) {
          this.waitForNewQuestion('Waiting for the voting on this questions to close...');
        } else {
          this.navCtrl.push(ChooseVotePage);
        }
      })
      .catch((err) => {
        if (err.code = 404) {  //no active question
          console.log('No active question')
          this.waitForNewQuestion('Waiting for a new question to open for voting....');
        }
      })
  }

  waitForNewQuestion(message) {
    this.waiting = true;
    this.showResults = false;
    this.currentMessage = message;
    this.ref.detectChanges();
  }

  getResults() {
    this.voteProvider.getResults()
      .then((results: VoteResults) => {
        this.waiting = false;
        this.showResults = true;
        this.currentMessage = 'Voting on this question has closed.';
        this.ref.detectChanges();
        this.renderChart(results.chartData);
        this.currentQuestionText = results.questionText;
        this.currentPatientNumber = results.patientNumber;
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

  nextQuestion() {
    //check if any question open
    this.getCurrentQuestion();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AwaitNextQuestionPage');
  }

  //unsub from messages
  ionViewWillLeave() {
    console.log('ionViewWillLeave AwaitNextQuestion')
    this.messaging.unsubscribeFromTopic('vote');
    this.messageSub.unsubscribe();
    this.resumeListener.unsubscribe();
  }

}
