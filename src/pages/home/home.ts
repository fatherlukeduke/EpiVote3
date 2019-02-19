import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { VoteProvider } from '../../providers/vote/vote';
import { VoteChoice, MeetingPatientQuestion, Role, Meeting, VoteMessage } from '../../models/interfaces';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AwaitNextQuestionPage } from './../await-next-question/await-next-question';
import { ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { ActivateAppPage } from '../activate-app/activate-app';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  currentPatient: number;
  votingChoices: VoteChoice;
  currentQuestion: MeetingPatientQuestion;
  roles: Array<Role>;
  entryForm: FormGroup;
  error: boolean = false;
  loading: boolean = true;
  incomingMessage: string = "test";
  toastMessage: string;
  meetingToEnter: boolean = false;

  messageSub: Subscription;
  resumeListener: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public voteProvider: VoteProvider, public formBuilder: FormBuilder,
    public messaging: MessagingProvider, public toastCtrl: ToastController,
    public platform: Platform, public ref: ChangeDetectorRef) {

    //display toast message if passed
    this.toastMessage = this.navParams.get('toastMessage');

    if (this.toastMessage) {
      let toast = this.toastCtrl.create({
        message: this.toastMessage,
        duration: 6000,
        position: 'bottom'
      });
      toast.present();
    };

    //start up
    //this.voteProvider.init();
    this.checkForActiveMeeting();
    //this.populateRoles();

    //from background
    this.resumeListener = platform.resume.subscribe(e => {
      console.log('Home page: resumed');
      this.checkForActiveMeeting();
    });

    //validate form
    this.entryForm = this.formBuilder.group({
      role: ['', Validators.required],
      code: ['', Validators.required]
    });



  }

  populateRoles(){
        //populate roles and voting choices - move Voting choices?
        this.voteProvider.getRoles()
        .then((data: Array<Role>) => {
          this.roles = data;
        })
        .then(() => {
          this.voteProvider.getVotingChoices();
          this.loading = false;
        })
        .catch(err => {
          // if (err.status === 401) {  //not activated app
          //   this.navCtrl.push(ActivateAppPage);
          // } else {
            console.log('Populate roles error: '  + err);
         // }
        })
  }

  ionViewWillEnter() {
    console.log('Home: ionViewWillEnter')
    //incoming message handler
    this.messageSub = this.messaging.messageChange.subscribe((message: VoteMessage) => {

      console.log('Meeting page message: ' + JSON.stringify(message));

      if (message.messageCode == 'meeting-open') {
        this.meetingToEnter = true;
        this.ref.detectChanges();
      }

      if (message.messageCode == 'meeting-closed') {
        this.meetingToEnter = false;
        this.ref.detectChanges();
      }
    })

  }

  enterMeeting() {
    if (this.entryForm.value.role && this.entryForm.value.code) {

       this.voteProvider.getActiveMeeting()
         .then((data: Meeting) => {
           this.voteProvider.activeMeeting = data;
         })

      this.voteProvider.setCurrentRole(this.entryForm.value.role)
      this.navCtrl.push(AwaitNextQuestionPage);

    } else {
      this.error = true;
    }
  }

  checkForActiveMeeting() {
    this.voteProvider.getActiveMeeting()
      .then((data) => {
        if (data) {
          this.populateRoles();
          this.meetingToEnter = true;
        } else {
          this.meetingToEnter = false;
        }
      })
      .catch(err => {
        if (err.status === 401) {  //not activated app
          console.log("Check for meeting: Not authorised")
          this.navCtrl.setRoot(ActivateAppPage);
        } else {
          console.log('Check for meeting error:' + err);
        }
      })
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  //unsub from messages
  ionViewWillLeave() {
    console.log('Home: ionViewWillLeave')
    this.messageSub.unsubscribe();
    this.resumeListener.unsubscribe();
  }


}
