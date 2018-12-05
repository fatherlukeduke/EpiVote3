import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UtilitiesProvider {

  constructor(public http: HttpClient) {
  
  }

  objectToUrlParameters (obj : object) : string {
    let params : string = Object.keys(obj).map( (key) => {
      return key + '=' + obj[key];
    }).join('&');

    return params;
  }

}
