import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChooseVotePage } from '../pages/choose-vote/choose-vote';
import { ConfirmVotePage } from '../pages/confirm-vote/confirm-vote';
import { AwaitNextQuestionPage} from '../pages/await-next-question/await-next-question';
import { VoteProvider } from '../providers/vote/vote';
import { UtilitiesProvider } from '../providers/utilities/utilities';
import {FCM} from '@ionic-native/fcm'
import { MessagingProvider } from '../providers/messaging/messaging';
import { ChoosePatientPage } from '../pages/choose-patient/choose-patient';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfirmVotePage,
    ChooseVotePage,
    AwaitNextQuestionPage,
    ChoosePatientPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfirmVotePage,
    ChooseVotePage,
    AwaitNextQuestionPage,
    ChoosePatientPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VoteProvider,
    UtilitiesProvider,
    FCM,
    MessagingProvider
  ]
})
export class AppModule {}
