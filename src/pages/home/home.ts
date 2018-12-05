import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfirmVotePage } from '../confirm-vote/confirm-vote';
import { VoteProvider } from '../../providers/vote/vote';
import { VoteChoice , MeetingPatientQuestion, Role} from '../../models/interfaces';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ChooseVotePage } from './../choose-vote/choose-vote';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

currentPatient: number;
votingChoices : VoteChoice;
currentQuestion : MeetingPatientQuestion ;
roles : Role;
roleForm : FormGroup;
error : boolean = false;
loading : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
      public voteProvider: VoteProvider, public formBuilder : FormBuilder) {

        this.roleForm = this.formBuilder.group({
          role: ['', Validators.required]
        });

    this.voteProvider.getRoles()
      .then( (data : Role) => { 
        this.roles  = data ;
        this.loading = false;
       })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }


 submitVote(choice, choiceText){
    this.navCtrl.push(ConfirmVotePage, { choice : choice, choiceText : choiceText } )
 }

 enterMeeting (){
    if (this.roleForm.value.role){
      
      this.voteProvider.getVotingChoices()
        .then(() => this.voteProvider.getFirstQuestion(1) )
        .then(() => this.voteProvider.setCurrentRole(this.roleForm.value.role) )
        .then(() => this.navCtrl.push(ChooseVotePage))
    
      console.log( this.roleForm.value.role);
    } else {
      this.error = true;
    }
   
 }

}
