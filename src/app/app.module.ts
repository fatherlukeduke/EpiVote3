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
import { VoteProvider } from '../providers/vote/vote';
import { UtilitiesProvider } from '../providers/utilities/utilities';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConfirmVotePage,
    ChooseVotePage
  ],
  imports: [
  BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConfirmVotePage,
    ChooseVotePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VoteProvider,
    UtilitiesProvider
  ]
})
export class AppModule {}
