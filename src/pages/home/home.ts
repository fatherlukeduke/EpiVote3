import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoteProvider } from '../../providers/vote/vote';
import { VoteChoice, MeetingPatientQuestion, Role } from '../../models/interfaces';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';
import { MessagingProvider } from './../../providers/messaging/messaging';
import { AwaitNextQuestionPage } from './../await-next-question/await-next-question';


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
  roleForm: FormGroup;
  error: boolean = false;
  loading: boolean = true;
  incomingMessage: string = "test";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public voteProvider: VoteProvider, public formBuilder: FormBuilder, private ref: ChangeDetectorRef, public messaging: MessagingProvider) {

    this.roleForm = this.formBuilder.group({
      role: ['', Validators.required]
    });

    this.voteProvider.getRoles()
      .then((data: Array<Role>) => {
        this.roles = data;        
      })
      .then(() => {
        this.voteProvider.getVotingChoices();
        this.loading = false;
      })

    messaging.messageChange.subscribe((value) => {
      this.incomingMessage = "INCOMING!";
      this.ref.detectChanges()
    })

  }

  enterMeeting() {
    if (this.roleForm.value.role) {

      // this.voteProvider.getFirstQuestion(1)
      //   .then(() => 
          this.voteProvider.setCurrentRole(this.roleForm.value.role)
          this.navCtrl.push(AwaitNextQuestionPage);

      console.log(this.roleForm.value.role);
    } else {
      this.error = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }


  // test() {
  //   this.incomingMessage = "button worked";
  // }

  // submitVote(choice, choiceText) {
  //   this.navCtrl.push(ConfirmVotePage, { choice: choice, choiceText: choiceText })
  // }



}
