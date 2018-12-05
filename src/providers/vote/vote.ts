import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoteChoice , MeetingPatientQuestion ,Role , Vote} from '../../models/interfaces';
import { UtilitiesProvider } from './../utilities/utilities';


@Injectable()
export class VoteProvider {

 //public currentPatient : number;
 public currentSession : Date;
 public currentMeeting : number = 1;
 public currentQuestion : MeetingPatientQuestion;
 public currentRole : Role;

 public votingChoices : VoteChoice;
 public roles : Role;
 public newPatientFlag : boolean

  constructor(public http : HttpClient, public utilities : UtilitiesProvider) {
    console.log('Hello VoteProvider Provider');

  }

  setCurrentRole(role : Role){
    this.currentRole = role;
  }

  getFirstQuestion  (meetingID : number ){
    return new Promise  ( (resolve) =>{
      this.http.get('https://api.epivote.uk/vote/getFirstQuestion/' + meetingID )
      .subscribe( ( data : MeetingPatientQuestion) => {
        this.currentQuestion = data;
        resolve(data);
      })
    })
  }

  getNextQuestion( ){
    return new Promise  ( (resolve) =>{
      
      this.http.get('https://api.epivote.uk/vote/getNextQuestion/' + 
        this.currentQuestion.meetingID +'/' +  
        this.currentQuestion.patientNumber + '/' +  
        this.currentQuestion.questionNumber)
      .subscribe( (data : MeetingPatientQuestion ) => {
        this.currentQuestion = data;  
        resolve(data);
      })
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

  submitVote(choice : number){
    return new Promise ( (resolve) => {
       let vote : Vote = {
         voteChoiceID : choice,
         roleID : this.currentRole.roleID,
         meetingPatientQuestionID : this.currentQuestion.meetingPatientQuestionID
       }

      //  let params : string = Object.keys(vote).map( (key) => {
      //     return key + '=' + vote[key];
      //   }).join('&');

       let params : string = this.utilities.objectToUrlParameters(vote); 

      this.http.post('https://api.epivote.uk/vote/submitVote', params , { headers: {'Content-Type': 'application/x-www-form-urlencoded'} } )
       .subscribe( () => resolve() )
    })
  }
}
