import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticateProvider } from '../../providers/authenticate/authenticate';
import { HomePage } from '../home/home';
import { HttpErrorResponse } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-activate-app',
  templateUrl: 'activate-app.html',
})
export class ActivateAppPage {

  activationForm: FormGroup;
  error : boolean  = false;
  errorText : string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    public authenticateProvider: AuthenticateProvider ) {

   //validate form
    this.activationForm = this.formBuilder.group({
      code: ['', Validators.required]
    });
  
  }

  authenticate () {
    this.authenticateProvider.authenticateApp(this.activationForm.value.code)
      .then(() =>{
        this.navCtrl.push(HomePage);
      })
      .catch((err : HttpErrorResponse) => {
        this.error = true;
        this.errorText = err.error;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivateAppPage');
  }

}