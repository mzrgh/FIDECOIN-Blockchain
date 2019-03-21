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
import { StoreService } from './Store.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-store',
  templateUrl: './Store.component.html',
  styleUrls: ['./Store.component.css'],
  providers: [StoreService]
})
export class StoreComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  storeName = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  address = new FormControl('', Validators.required);
  latitude = new FormControl('', Validators.required);
  latitudeDir = new FormControl('', Validators.required);
  longitude = new FormControl('', Validators.required);
  longitudeDir = new FormControl('', Validators.required);
  member = new FormControl('', Validators.required);
  publicId = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);


  constructor(public serviceStore: StoreService, fb: FormBuilder) {
    this.myForm = fb.group({
      storeName: this.storeName,
      type: this.type,
      address: this.address,
      latitude: this.latitude,
      latitudeDir: this.latitudeDir,
      longitude: this.longitude,
      longitudeDir: this.longitudeDir,
      member: this.member,
      publicId: this.publicId,
      email: this.email
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceStore.getAll()
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
      $class: 'es.gonzalezherrero.fidecoin.Store',
      'storeName': this.storeName.value,
      'type': this.type.value,
      'address': this.address.value,
      'latitude': this.latitude.value,
      'latitudeDir': this.latitudeDir.value,
      'longitude': this.longitude.value,
      'longitudeDir': this.longitudeDir.value,
      'member': this.member.value,
      'publicId': this.publicId.value,
      'email': this.email.value
    };

    this.myForm.setValue({
      'storeName': null,
      'type': null,
      'address': null,
      'latitude': null,
      'latitudeDir': null,
      'longitude': null,
      'longitudeDir': null,
      'member': null,
      'publicId': null,
      'email': null
    });

    return this.serviceStore.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'storeName': null,
        'type': null,
        'address': null,
        'latitude': null,
        'latitudeDir': null,
        'longitude': null,
        'longitudeDir': null,
        'member': null,
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
      $class: 'es.gonzalezherrero.fidecoin.Store',
      'storeName': this.storeName.value,
      'type': this.type.value,
      'address': this.address.value,
      'latitude': this.latitude.value,
      'latitudeDir': this.latitudeDir.value,
      'longitude': this.longitude.value,
      'longitudeDir': this.longitudeDir.value,
      'member': this.member.value,
      'email': this.email.value
    };

    return this.serviceStore.updateParticipant(form.get('publicId').value, this.participant)
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

    return this.serviceStore.deleteParticipant(this.currentId)
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

    return this.serviceStore.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'storeName': null,
        'type': null,
        'address': null,
        'latitude': null,
        'latitudeDir': null,
        'longitude': null,
        'longitudeDir': null,
        'member': null,
        'publicId': null,
        'email': null
      };

      if (result.storeName) {
        formObject.storeName = result.storeName;
      } else {
        formObject.storeName = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.address) {
        formObject.address = result.address;
      } else {
        formObject.address = null;
      }

      if (result.latitude) {
        formObject.latitude = result.latitude;
      } else {
        formObject.latitude = null;
      }

      if (result.latitudeDir) {
        formObject.latitudeDir = result.latitudeDir;
      } else {
        formObject.latitudeDir = null;
      }

      if (result.longitude) {
        formObject.longitude = result.longitude;
      } else {
        formObject.longitude = null;
      }

      if (result.longitudeDir) {
        formObject.longitudeDir = result.longitudeDir;
      } else {
        formObject.longitudeDir = null;
      }

      if (result.member) {
        formObject.member = result.member;
      } else {
        formObject.member = null;
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
      'storeName': null,
      'type': null,
      'address': null,
      'latitude': null,
      'latitudeDir': null,
      'longitude': null,
      'longitudeDir': null,
      'member': null,
      'publicId': null,
      'email': null
    });
  }
}
