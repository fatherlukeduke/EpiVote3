import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,  fcm: FCM) {
    platform.ready().then(() => {
     //Notifications
    //  fcm.subscribeToTopic('all');
    //  fcm.getToken().then(token=>{
    //      console.log(token);
    //  })
    //  fcm.onNotification().subscribe(data=>{
    //    if(data.wasTapped){
    //      console.log("Received in background: " +  JSON.stringify(data) );
    //    } else {
    //      console.log("Received in foreground: " + JSON.stringify(data));
    //    };
    //  })
    //  fcm.onTokenRefresh().subscribe(token=>{
    //    console.log(token);
    //  });
     //end notifications.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

