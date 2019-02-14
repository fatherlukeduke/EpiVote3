import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
import { VoteMessage } from '../../models/interfaces';

//Creates a subscription service to receive meeting level FCM messages
@Injectable()
export class MeetingMessagingProvider {

  public messageChange : Subject<object> = new Subject<object>();
  public voteMessage : VoteMessage;

  constructor(public http: HttpClient, public platform: Platform, public fcm: FCM) {
    console.log('Hello MessageingProvider Provider');

    this.messageChange.subscribe ( (value : VoteMessage) => {
      this.voteMessage = value;
    })

    //subscribe to FireBase meeting level messages
    platform.ready().then(() => {
      fcm.subscribeToTopic('meeting');
      fcm.getToken().then(token => {
        console.log('New token:' + token);
      })
      fcm.onNotification().subscribe(data => {
        this.messageChange.next(data);

          if (data.wasTapped) {
            console.log("Meeting info message in background: " + JSON.stringify(data));
          } else {
            console.log("Meeting info message in foreground: " + JSON.stringify(data));
         };
      })
      fcm.onTokenRefresh().subscribe(token => {
        console.log('Token refresh: ' + token);
      });
    })

  }

}
