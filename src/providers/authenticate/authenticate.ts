import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthenticationToken } from '../../models/interfaces';
import { UtilitiesProvider } from './../utilities/utilities';

@Injectable()
export class AuthenticateProvider {

  public currentToken: AuthenticationToken;

  constructor(public http: HttpClient, public storage: Storage, public utilities: UtilitiesProvider) {
    console.log('Hello AuthenticateProvider Provider');

    //this.storage.set('token', '');

  }

  checkAuthenticated() {
    return new Promise((resolve, reject) => {
      this.storage.get('token')
        .then(token => {
          if (token) {
            console.log('API token: ' + token.rawData)
            this.currentToken = token;
            resolve();
          } else {
            console.log('no current API token');
            reject();
          }
        })
    })

  }

  authenticateApp(code: string) {
    return new Promise((resolve, reject) => {

      this.http.post('https://api.epivote.uk/user/registerClient?ActivationCode=' + code, null)
        .subscribe((authenticatationToken: AuthenticationToken) => {
          console.log('API token:' + authenticatationToken);
          this.currentToken = authenticatationToken;
          this.storage.set('token', authenticatationToken['token'])
            .then(() => resolve())
        }, err => {
          console.log('Authenticate error:' + JSON.stringify(err));
          reject(err);
        })
    })
  }

  createAuthorisationHeader(urlencoded: boolean = false): HttpHeaders {


    if (urlencoded) {
      var header = new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentToken.rawData,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    } else {
      var header = new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentToken.rawData
      })
    }
    return header;
  }

}
