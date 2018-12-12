import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfirmVotePage } from '../confirm-vote/confirm-vote';
import { VoteProvider } from '../../providers/vote/vote';
import { VoteChoice, MeetingPatientQuestion, Role } from '../../models/interfaces';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ChooseVotePage } from './../choose-vote/choose-vote';
import { stringify } from '@angular/compiler/src/util';
import { MessagingProvider } from './../../providers/messaging/messaging';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  currentPatient: number;
  votingChoices: VoteChoice;
  currentQuestion: MeetingPatientQuestion;
  roles: Role;
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
      .then((data: Role) => {
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }


  test() {
    this.incomingMessage = "button worked";
  }

  submitVote(choice, choiceText) {
    this.navCtrl.push(ConfirmVotePage, { choice: choice, choiceText: choiceText })
  }

  enterMeeting() {
    if (this.roleForm.value.role) {


      this.voteProvider.getFirstQuestion(1)
        .then(() => this.voteProvider.setCurrentRole(this.roleForm.value.role))
        .then(() => this.navCtrl.push(ChooseVotePage))

      console.log(this.roleForm.value.role);
    } else {
      this.error = true;
    }

  }

}
