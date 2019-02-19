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
import { IonicStorageModule } from '@ionic/storage';
import { ActivateAppPage } from '../pages/activate-app/activate-app';
import { AuthenticateProvider } from '../providers/authenticate/authenticate';

import { HTTP } from '@ionic-native/http/ngx';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfirmVotePage,
    ChooseVotePage,
    AwaitNextQuestionPage,
    ActivateAppPage
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
    ActivateAppPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VoteProvider,
    UtilitiesProvider,
    FCM,
    MessagingProvider,
    AuthenticateProvider,
    HTTP
  ]
})
export class AppModule {}
