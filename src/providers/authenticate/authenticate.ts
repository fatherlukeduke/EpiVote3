import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {  AuthenticationToken } from '../../models/interfaces';

@Injectable()
export class AuthenticateProvider {


  constructor(public http: HttpClient, public storage: Storage) {
    console.log('Hello AuthenticateProvider Provider');

    this.storage.set('token','');

  }

  authenticateApp(code: string) {
    return new Promise((resolve, reject) => {
      this.http.post('https://api.epivote.uk/user/registerClient/' + code, null )
        .subscribe((authenticatationToken : AuthenticationToken) => {
          this.storage.set('token', authenticatationToken.token.rawData)
            .then(() => resolve())
        }, err => {
          console.log('Authenticate error:' + err);
          reject(err);
        })
    })
  }

  createAuthorisationHeader(header : Headers) {
    this.storage.get('token')
      .then((authenticatationToken : AuthenticationToken) => {
        header.append('Authorization', authenticatationToken.token.rawData);
      })
  }

}
