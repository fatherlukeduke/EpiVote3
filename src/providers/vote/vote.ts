import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoteChoice, MeetingPatientQuestion, Role, Vote, VoteResults, Meeting } from '../../models/interfaces';
import { UtilitiesProvider } from './../utilities/utilities';
import { Platform, Menu } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { AuthenticateProvider } from './../authenticate/authenticate';



@Injectable()
export class VoteProvider {

  public activeMeeting: Meeting;
  public currentQuestion: MeetingPatientQuestion;
  public lastQuestion: MeetingPatientQuestion;
  public currentRole: Role;
  public currentPatient: number;
  public currentMeetingPatientQuestionID: number = 0;
  public lastMeetingPatientQuestionID: number = 0;

  public votingChoices: VoteChoice;
  public roles: Role;
  public completedQuestions: Array<Number>;

  constructor(public http: HttpClient, public utilities: UtilitiesProvider,
    public platform: Platform, public fcm: FCM, public storage: Storage, public authProvider: AuthenticateProvider) {

    console.log('Hello VoteProvider Provider');
    //this.init();
  }


  setCurrentRole(role: Role) {
    this.currentRole = role;
  }


  getResults(): Promise<VoteResults> {
    return new Promise((resolve, reject) => {
      let header = this.authProvider.createAuthorisationHeader();
      this.http.get('https://api.epivote.uk/vote/GetResults/' + this.currentQuestion.meetingPatientQuestionID, {headers : header})
        .subscribe((data: VoteResults) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          })
    })
  }


  getActiveQuestion(): Promise<MeetingPatientQuestion> {

    return new Promise((resolve, reject) => {
      let header = this.authProvider.createAuthorisationHeader();
      this.http.get('https://api.epivote.uk/vote/GetCurrentQuestionForMeeting/' + this.activeMeeting.meetingID, {headers : header})
        .subscribe((data: MeetingPatientQuestion) => {
          this.currentQuestion = data;
          this.currentMeetingPatientQuestionID = data.meetingPatientQuestionID;
          resolve(data);
        },
          (err) => {
            reject(err)
          }
        )
    })
  }

  getRoles(): Promise<Array<Role>> {
    return new Promise((resolve) => {
      let header = this.authProvider.createAuthorisationHeader();

      this.http.get('https://api.epivote.uk/vote/getRoles', { headers: header })
        .subscribe((data: Array<Role>) => {
          resolve(data);
        })
    })
  }

  getVotingChoices(): Promise<VoteChoice> {
    return new Promise((resolve) => {
      let header = this.authProvider.createAuthorisationHeader();
      this.http.get('https://api.epivote.uk/vote/getVotechoices', {headers : header})
        .subscribe((data: VoteChoice) => {
          this.votingChoices = data;
          resolve(data);
        })
    })
  }

  getMeeting(meetingID): Promise<Meeting> {
    return new Promise((resolve) => {
      let header = this.authProvider.createAuthorisationHeader();
      this.http.get('https://api.epivote.uk/vote/getMeeting/' + meetingID, {headers : header})
        .subscribe((data: Meeting) => {
          this.activeMeeting = data;
          resolve(data);
        })
    })
  }

  getMeetings(): Promise<Array<Meeting>> {
    let header = this.authProvider.createAuthorisationHeader();
    return new Promise((resolve) => {
      this.http.get('https://api.epivote.uk/vote/getMeetings', {headers : header})
        .subscribe((data: Array<Meeting>) => {
          console.log('got meetings')
          resolve(data);
        })
    })
  }

  getActiveMeeting(): Promise<Meeting> {

    return new Promise((resolve, reject) => {

      let header = this.authProvider.createAuthorisationHeader();
      this.http.get('https://api.epivote.uk/vote/getActiveMeeting', { headers: header })
        .subscribe((data: Meeting) => {
          this.activeMeeting = data;
          resolve(data);
        },
          (err) => {
            reject(err);
          }
        )
    })
  }


  submitVote(choice: number) {
    return new Promise((resolve) => {
      let vote: Vote = {
        voteChoiceID: choice,
        roleID: this.currentRole.roleID,
        meetingPatientQuestionID: this.currentQuestion.meetingPatientQuestionID
      }

      let header = this.authProvider.createAuthorisationHeader(true);
      let params: string = this.utilities.objectToUrlParameters(vote);

      this.http.post('https://api.epivote.uk/vote/submitVote', params, { headers: header })
        .subscribe(() => resolve())
    })
  }

}
