import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
import { VoteMessage } from './../../models/interfaces';

//Creates a subscription service to receive all FCM messages
@Injectable()
export class MessagingProvider {

  public messageChange : Subject<object> = new Subject<object>();
  public voteMessage : VoteMessage;

  constructor(public http: HttpClient, public platform: Platform, public fcm: FCM) {
    console.log('Hello MessageingProvider Provider');

    this.messageChange.subscribe ( (value : VoteMessage) => {
      this.voteMessage = value;
    })

    //subscribe to FireBase messages
    platform.ready().then(() => {
      this.subscribeToTopic('meeting');

      fcm.getToken().then(token => {
        console.log('FCM token:' + token);
      })
      fcm.onNotification().subscribe(data => {
        this.messageChange.next(data);
      })
      fcm.onTokenRefresh().subscribe(token => {
        console.log('Token refresh: ' + token);
      });
    })

  }

  subscribeToTopic(topic : string ){
    this.fcm.subscribeToTopic(topic);
  }

   unsubscribeFromTopic(topic : string){
    this.fcm.unsubscribeFromTopic(topic);
  }



}
