import { Component } from '@angular/core';

/**
 * Generated class for the MedivoteHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'medivote-header',
  templateUrl: 'medivote-header.html'
})
export class MedivoteHeaderComponent {

  text: string;

  constructor() {
    console.log('Hello MedivoteHeaderComponent Component');
    this.text = 'Hello World';
  }

}
