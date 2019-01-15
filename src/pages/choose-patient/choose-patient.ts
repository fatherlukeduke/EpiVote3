import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MeetingPatient } from '../../models/interfaces';
import { VoteProvider } from '../../providers/vote/vote';
import { ChooseVotePage } from '../choose-vote/choose-vote';

/**
 * Generated class for the ChoosePatientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-choose-patient',
  templateUrl: 'choose-patient.html', 
})
export class ChoosePatientPage {

  patients: Array<MeetingPatient>;
  loading : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public voteProvider: VoteProvider) {
    // this.voteProvider.getPatientsForMeeting()
    //   .then( (results) => {
    //     this.patients = results
    //     this.loading = false;
    //   })
  
  }

//  choosePatient(meetingPatientID : number){
//     this.voteProvider.currentPatient = meetingPatientID;
//     this.voteProvider.getFirstQuestionForPatient()
//       .then(() => {
//         this.navCtrl.push(ChooseVotePage);
//       })
//  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoosePatientPage');
  }

}
