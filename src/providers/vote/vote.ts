import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoteChoice , MeetingPatientQuestion ,Role , Vote, MeetingPatient ,VoteResults} from '../../models/interfaces';
import { UtilitiesProvider } from './../utilities/utilities';
import { Platform, Menu } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
import { HttpJsonParseError } from '@angular/common/http/src/response';
//import { resolveDefinition } from '@angular/core/src/view/util';


@Injectable()
export class VoteProvider {

 //public currentPatient : number;
 //public currentSession : Date;
 public currentMeeting : number = 1;
 public currentQuestion : MeetingPatientQuestion;
 public currentRole : Role;
 public currentPatient: number;

 public votingChoices : VoteChoice;
 public roles : Role;
 public newPatientFlag : boolean;
//  public messageChange : Subject<object> = new Subject<object>();
//  public firebaseMessage : object;

  constructor(public http : HttpClient, public utilities : UtilitiesProvider, public platform: Platform, public fcm : FCM) {
    console.log('Hello VoteProvider Provider');
  }
  
  getPatientsForMeeting() : Promise<Array<MeetingPatient>> {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.epivote.uk/vote/GetPatientsForMeeting/' + this.currentMeeting)
        .subscribe ( (data : Array<MeetingPatient>) => {
          resolve(data);
        })
    })
  }

  getResults() : Promise<VoteResults> {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.epivote.uk/vote/GetResults/' + this.currentQuestion.meetingPatientQuestionID)
        .subscribe ( (data : VoteResults) => {
          resolve(data);
        })
    })
  }

  setCurrentRole(role : Role){
    this.currentRole = role;
  }

  getFirstQuestionForPatient () : Promise<MeetingPatientQuestion> {
    return new Promise  ( (resolve) =>{
      this.http.get('https://api.epivote.uk/vote/getFirstQuestionForPatient/' + this.currentPatient )
      .subscribe( ( data : MeetingPatientQuestion) => {
        this.currentQuestion = data;
        resolve(data);
      })
    })
  }

  getNextQuestion() : Promise<MeetingPatientQuestion>{
    return new Promise  ( (resolve, reject) =>{
      
      this.http.get('https://api.epivote.uk/vote/getNextQuestionForPatient/' + 
        this.currentQuestion.meetingID +'/' +  
        this.currentQuestion.patientNumber + '/' +  
        this.currentQuestion.questionNumber)
      .subscribe( (data : MeetingPatientQuestion ) => {
        this.currentQuestion = data;  
        resolve(data);
      },
        ( err ) => {
            reject (err)
        }
      )
      
    })
  }
  
  getRoles() : Promise<Role> {
      return new Promise  ( (resolve) =>{
        this.http.get('https://api.epivote.uk/vote/getRoles')
        .subscribe( (data : Role ) => {
            this.roles = data;
            resolve(data);
        })
      })
    }

  getVotingChoices () : Promise<VoteChoice> {
    return new Promise  ( (resolve) =>{
      this.http.get('https://api.epivote.uk/vote/getVotechoices')
      .subscribe( (data : VoteChoice ) => {
          this.votingChoices = data;
          resolve(data);
      })
    })
  }

  getCurrentQuestion() : Promise<MeetingPatientQuestion> {
    return new Promise ( (resolve) => {
      this.http.get('https://api.epivote.uk/vote/GetQuestion/' + this.currentQuestion.meetingPatientQuestionID )
      .subscribe( (data : MeetingPatientQuestion ) => {
          resolve(data);
      })
    })
  }

  submitVote(choice : number){
    return new Promise ( (resolve) => {
       let vote : Vote = {
         voteChoiceID : choice,
         roleID : this.currentRole.roleID,
         meetingPatientQuestionID : this.currentQuestion.meetingPatientQuestionID
       }

       let params : string = this.utilities.objectToUrlParameters(vote); 

      this.http.post('https://api.epivote.uk/vote/submitVote', params , { headers: {'Content-Type': 'application/x-www-form-urlencoded'} } )
       .subscribe( () => resolve() )
    })
  }
}
