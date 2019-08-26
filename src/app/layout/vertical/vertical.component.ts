import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { IAppState } from "../../interfaces/app-state";
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { HttpService } from '../../services/http/http.service';
import { IOption } from '../../ui/interfaces/option';
import { Content } from '../../ui/interfaces/modal';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { IService } from '../../interfaces/service';
import * as ServiceActions from '../../store/actions/service.actions';
import * as SettingsActions from '../../store/actions/app-settings.actions';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical.component.html',
  styleUrls: [
    '../base-layout/base-layout.component.scss',
    './vertical.component.scss'
  ]
})
export class VerticalLayoutComponent extends BaseLayoutComponent implements OnInit {
  serviceForm: FormGroup;
  biller_category: IOption[];

  constructor(
    store: Store<IAppState>,
    fb: FormBuilder,
    httpSv: HttpService,
    router: Router,
    elRef: ElementRef,
    private modal: TCModalService,
    private apollo: Apollo,
  ) {
    super(store, fb, httpSv, router, elRef);

    this.biller_category = [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.dispatch(new SettingsActions.Update({ layout: 'vertical' }));
  }

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.initPatientForm();

    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  generateBillers(){
    this.apollo
      .mutate({
        mutation: gql`
          mutation generateBillers {
            generateBillers{
              id
              service_id
              name
              service{
                id
              },
              billing_profile{
                id
              },
              insurance_rules{
                id
              }
            }
          }
        `,
      }).subscribe();
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.serviceForm.reset();
  }

  // upload new file
  onFileChanged(inputValue: any) {
    let file: File = inputValue.target.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = () => {
      // this.currentAvatar = reader.result;
    };

    reader.readAsDataURL(file);
  }

  // init form
  initPatientForm() {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: [],
      biller_category_id: ['', Validators.required],
      unit_selling_price: ['', Validators.required],
      unit_cost_price: ['', Validators.required]
    });
  }

  // add new patient
  addPatient(form: FormGroup) {
    if (form.valid) {
      let newPatient: IService = form.value;

      newPatient.id = '23';
      // newPatient.status = 'Pending';
      // newPatient.lastVisit = '';

      this.store.dispatch(new ServiceActions.Add(newPatient));
      this.closeModal();
      this.serviceForm.reset();
    }
  }
}
