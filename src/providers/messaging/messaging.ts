import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { Subject } from 'rxjs/Subject';
/*
  Generated class for the MessageingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagingProvider {

  public messageChange : Subject<object> = new Subject<object>();
  public firebaseMessage : object;

  constructor(public http: HttpClient, public platform: Platform, public fcm: FCM) {
    console.log('Hello MessageingProvider Provider');

    this.messageChange.subscribe ( (value) => {
      this.firebaseMessage = value;
    })

    //subscribe to FireBase messages
    platform.ready().then(() => {
      fcm.subscribeToTopic('all');
      fcm.getToken().then(token => {
        console.log(token);
      })
      fcm.onNotification().subscribe(data => {
        this.messageChange.next(data);

        if (data.wasTapped) {
          console.log("Received in background: " + JSON.stringify(data));
        } else {
          console.log("Received in foreground: " + JSON.stringify(data));
        };
      })
      fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });
    })

  }

}
