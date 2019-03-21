/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomerService } from './Customer.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-customer',
  templateUrl: './Customer.component.html',
  styleUrls: ['./Customer.component.css'],
  providers: [CustomerService]
})
export class CustomerComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  firstName = new FormControl('', Validators.required);
  lastName = new FormControl('', Validators.required);
  phoneNumber = new FormControl('', Validators.required);
  balance = new FormControl('', Validators.required);
  publicId = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);


  constructor(public serviceCustomer: CustomerService, fb: FormBuilder) {
    this.myForm = fb.group({
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      balance: this.balance,
      publicId: this.publicId,
      email: this.email
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCustomer.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'es.gonzalezherrero.fidecoin.Customer',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'phoneNumber': this.phoneNumber.value,
      'balance': this.balance.value,
      'publicId': this.publicId.value,
      'email': this.email.value
    };

    this.myForm.setValue({
      'firstName': null,
      'lastName': null,
      'phoneNumber': null,
      'balance': null,
      'publicId': null,
      'email': null
    });

    return this.serviceCustomer.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'firstName': null,
        'lastName': null,
        'phoneNumber': null,
        'balance': null,
        'publicId': null,
        'email': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'es.gonzalezherrero.fidecoin.Customer',
      'firstName': this.firstName.value,
      'lastName': this.lastName.value,
      'phoneNumber': this.phoneNumber.value,
      'balance': this.balance.value,
      'email': this.email.value
    };

    return this.serviceCustomer.updateParticipant(form.get('publicId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceCustomer.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCustomer.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'firstName': null,
        'lastName': null,
        'phoneNumber': null,
        'balance': null,
        'publicId': null,
        'email': null
      };

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.lastName) {
        formObject.lastName = result.lastName;
      } else {
        formObject.lastName = null;
      }

      if (result.phoneNumber) {
        formObject.phoneNumber = result.phoneNumber;
      } else {
        formObject.phoneNumber = null;
      }

      if (result.balance) {
        formObject.balance = result.balance;
      } else {
        formObject.balance = null;
      }

      if (result.publicId) {
        formObject.publicId = result.publicId;
      } else {
        formObject.publicId = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'firstName': null,
      'lastName': null,
      'phoneNumber': null,
      'balance': null,
      'publicId': null,
      'email': null
    });
  }
}