import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VoteChoice, MeetingPatientQuestion, Role, Vote, VoteResults, Meeting, AuthenticationToken } from '../../models/interfaces';
import { UtilitiesProvider } from './../utilities/utilities';
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';


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
  public httpHeaders: HttpHeaders;

  constructor(public http: HttpClient, public utilities: UtilitiesProvider,
    public platform: Platform, public fcm: FCM, public storage: Storage, public httpNative: HTTP) {

    console.log('Hello VoteProvider Provider');
    this.init();
  }

  init() {

    console.log('Vote: initialised')


  }


  setCurrentRole(role: Role) {
    this.currentRole = role;
  }


  getResults(): Promise<VoteResults> {
    return new Promise((resolve, reject) => {
      this.http.get('https://api.epivote.uk/vote/GetResults/' + this.currentQuestion.meetingPatientQuestionID)
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
      this.http.get('https://api.epivote.uk/vote/GetCurrentQuestionForMeeting/' + this.activeMeeting.meetingID)
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
    return new Promise((resolve, reject) => {
      this.http.get('https://api.epivote.uk/vote/getRoles', { headers: this.httpHeaders })
        .subscribe((data: Array<Role>) => {
          resolve(data);
        },
          (err) => {
            reject(err);
          }
        )
    })
  }

  getVotingChoices(): Promise<VoteChoice> {
    return new Promise((resolve) => {
      this.http.get('https://api.epivote.uk/vote/getVotechoices', { headers: this.httpHeaders })
        .subscribe((data: VoteChoice) => {
          this.votingChoices = data;
          resolve(data);
        })
    })
  }

  getMeeting(meetingID): Promise<Meeting> {
    return new Promise((resolve) => {
      this.http.get('https://api.epivote.uk/vote/getMeeting/' + meetingID)
        .subscribe((data: Meeting) => {
          this.activeMeeting = data;
          resolve(data);
        })
    })
  }

  getMeetings(): Promise<Array<Meeting>> {
    return new Promise((resolve) => {
      this.http.get('https://api.epivote.uk/vote/getMeetings', { headers: this.httpHeaders })
        .subscribe((data: Array<Meeting>) => {
          resolve(data);
        })
    })
  }

  // getActiveMeeting(): Promise<Meeting> {
  //   return new Promise((resolve, reject) => {

  //     // this.storage.get("token")
  //     //   .then((authToken: AuthenticationToken) => {



  //         let newHeader = new HttpHeaders({
  //           'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbm9ueW1vdXMiOiIwNTkyIiwibmJmIjoxNTUwNTg4NTQxLCJleHAiOjE3MDgzNTQ5NDEsImlhdCI6MTU1MDU4ODU0MX0.XO4Ox_mYDvTssI4ykcRubAL9iFCJ9D6xTdxylAz0mfY'
  //         })


  //         this.http.get('https://api.epivote.uk/vote/getActiveMeeting', { headers :  newHeader })
  //           .subscribe((data: Meeting) => {
  //             this.activeMeeting = data;
  //             resolve(data);
  //           },
  //             (err) => {
  //               reject(err);
  //             }
  //           )
  //       })

  //   //})
  // }

  getActiveMeeting() {

    return new Promise((resolve, reject) => {
      this.httpNative.setHeader('*', 'Authorization', 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbm9ueW1vdXMiOiIwNTkyIiwibmJmIjoxNTUwNTg4NTQxLCJleHAiOjE3MDgzNTQ5NDEsImlhdCI6MTU1MDU4ODU0MX0.XO4Ox_mYDvTssI4ykcRubAL9iFCJ9D6xTdxylAz0mfY')

      const options = {
        method: 'get',
        data: { id: 12, message: 'test' },
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hbm9ueW1vdXMiOiIwNTkyIiwibmJmIjoxNTUwNTg4NTQxLCJleHAiOjE3MDgzNTQ5NDEsImlhdCI6MTU1MDU4ODU0MX0.XO4Ox_mYDvTssI4ykcRubAL9iFCJ9D6xTdxylAz0mfY' }
      };

      this.httpNative.get('https://api.epivote.uk/vote/getActiveMeeting', {}, {} )
        .then(result => {
          console.log(result);
          resolve(result.data)
        })
        .catch(err => {
          console.log(err.error);
          reject(err);
        })

    })
  }


  submitVote(choice: number) {
    return new Promise((resolve) => {
      let vote: Vote = {
        voteChoiceID: choice,
        roleID: this.currentRole.roleID,
        meetingPatientQuestionID: this.currentQuestion.meetingPatientQuestionID
      }

      let params: string = this.utilities.objectToUrlParameters(vote);

      this.http.post('https://api.epivote.uk/vote/submitVote', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .subscribe(() => resolve())
    })
  }




}
