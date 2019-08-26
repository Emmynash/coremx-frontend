import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPageData } from '../../interfaces/page-data';
import { IAppState } from '../../interfaces/app-state';
import { IOption } from '../../ui/interfaces/option';
import { HttpService } from '../../services/http/http.service';
import * as PageActions from '../../store/actions/page.actions';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'patient-diagnosis-page',
  templateUrl: './patient-diagnosis-page.component.html',
  styleUrls: ['./patient-diagnosis-page.component.scss']
})

export class PatientDiagnosisPageComponent implements OnInit, OnDestroy {
  pageData: IPageData;
  tableData: any[];
  error: any;
  patientDiagnosisForm: FormGroup;
  status: IOption[];
  severity: IOption[];
  Patient_Diagnosis_Query: any;
  ConfirmDeleteForm: FormGroup;
  @ViewChild('modalBody') modalBody: ElementRef<any>;
  @ViewChild('modalFooter') modalFooter: ElementRef<any>;
  @ViewChild('modalUpdateFooter') modalUpdateFooter: ElementRef<any>;
  @ViewChild('modalWarningBody') modalWarningBody: ElementRef<any>;
  @ViewChild('modalWarningFooter') modalWarningFooter: ElementRef<any>;

  constructor(
    public store: Store<IAppState>,
    public httpSv: HttpService,
    private modal: TCModalService,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
  ) {
    this.pageData = {
      title: 'Patient Diagnosis',
      loaded: false,
      breadcrumbs: [
        {
          title: 'Main',
          route: 'main'
        },
        {
          title: 'Patient Diagnosis'
        }
      ]
    };
    this.status = [
      {
        label: 'differential',
        value: 'differential'
      },
      {
        label: 'confirmed',
        value: 'confirmed'
      },
      {
        label: 'history',
        value: 'history'
      },
      {
        label: 'query',
        value: 'query'
      }
    ];

    this.severity = [
      {
        label: 'acute',
        value: 'acute'
      },
      {
        label: 'chronic',
        value: 'chronic'
      },
      {
        label: 'recurrent',
        value: 'recurrent'
      }
    ];
    this.tableData = [];
    this.Patient_Diagnosis_Query = gql`
    {
      PatientDiagnosis {
        id
        emr_id
        encounter_id
        active
        severity
        status
        diagnosis
        diagnosed_by
        date_of_entry
        diagnosis_note
        diagnosis_type
        in_parent_id
        body_part_id
        hospital_diagnosed
        created_at
      }
    }
    `;
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.patientDiagnosisForm.reset();
  }

  // open modal window
  openModal(body: any, header: any = null, footer: any = null, data: any = null) {
    this.initForm(data);

    this.modal.open({
      body: body,
      header: header,
      footer: footer
    });
  }

  // init PatientDiagnosiForm
  initForm(data: any) {
    this.patientDiagnosisForm = this.formBuilder.group({
      id: data ? data.id : '',
      diagnosis: data ? data.diagnosis : '',
      diagnosis_type: data ? data.diagnosis_type : '',
      hospital_diagnosed: data ? data.hospital_diagnosed : '',
      status: data ? data.status : '',
      severity: data ? data.severity : '',
      diagnosed_by: data ? data.diagnosed_by : '',
      emr_id: data ? data.emr_id : '',
      in_parent_id: data ? data.in_parent_id : '',
      body_part_id: data ? data.body_part_id : '',
      diagnosis_note: data ? data.diagnosis_note : '',
      active: [(data ? data.active : ''), Validators.required],
      date_of_entry: [(data ? data.date_of_entry : ''), Validators.required],
      encounter_id: [(data ? data.encounter_id : ''), Validators.required], 
    });
  }

  // edit Patienet Diagnosis
  edit(row: any) {
    this.openModal(this.modalBody, 'Edit Patient Diagnoisis', this.modalUpdateFooter, row);
  }

  // remove Patient Diagnosis
  remove(tableRow: any) {
    this.openConfirmDeleteModal(this.modalWarningBody, 'Confirm Delete', this.modalWarningFooter, tableRow);
  }

  openConfirmDeleteModal(body: any, header: any = null, footer: any = null, data: any = null) {
    this.ConfirmDeleteForm = this.formBuilder.group({
      isConfirmed: ['', Validators.required],
      id: [data.id, Validators.required],
    });
    this.modal.open({
      body: body,
      header: header,
      footer: footer
    });
  }

  closeConfirmDeleteModal() {
    this.modal.close();
    this.ConfirmDeleteForm.reset();
  }

  confirmRemove(form: FormGroup){
    if (form.valid) {
    let newData: any = form.value;
    this.apollo
      .mutate({
        mutation: gql`
          mutation deletePatientDiagnosis {
            deletePatientDiagnosis(id: "${newData.id}"){
                id
                emr_id
                encounter_id
                active
                severity
                status
                diagnosis
                diagnosed_by
                date_of_entry
                diagnosis_note
                diagnosis_type
                in_parent_id
                body_part_id
                hospital_diagnosed
                created_at
            }
          }
        `,
        update: (store, result: any) => {
          console.log(result);
          let deletePatientDiagnosis = result.data && result.data.deletePatientDiagnosis;
          console.log(deletePatientDiagnosis);
          const data:any = store.readQuery({ query: this.Patient_Diagnosis_Query,});
          let newData = [];
          for (let i = 0; i < data.PatientDiagnosis.length; i++) {
            console.log(data.PatientDiagnosis[i].id);
            // console.log(deletePatientDiagnosis.id);
            if (data.PatientDiagnosis[i].id === deletePatientDiagnosis.id){
              continue;
            }
            newData.push(data.PatientDiagnosis[i]);
          }
          data.PatientDiagnosis = newData;
          store.writeQuery({ query: this.Patient_Diagnosis_Query, data });
        },
      }).subscribe(()=>{
        this.closeConfirmDeleteModal();
      }, (error) => {
        console.log("An error occured", error)
      } ); 
    }
  }

  ngOnInit() {
    this.store.dispatch(new PageActions.Set(this.pageData));
    this.getData();
  }
  
  getData() {
    this.apollo
      .watchQuery({
        query: this.Patient_Diagnosis_Query,
      })
      .valueChanges.subscribe( (result: any) => {
        console.log(result);
        this.tableData = result.data && result.data.PatientDiagnosis;
        this.store.dispatch(new PageActions.Update({ loaded: !result.loading }));
        this.error = result.errors;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new PageActions.Reset());
  }

  update(form: FormGroup) {
    if (form.valid) {
      let newData: any = form.value;
      this.apollo
      .mutate({
        mutation: gql`
          mutation updatePatientDiagnosis {
            updatePatientDiagnosis(id: "${newData.id}", diagnosis: "${newData.diagnosis}", diagnosis_type: "${newData.diagnosis_type}", hospital_diagnosed: "${newData.hospital_diagnosed}", status: "${newData.status}", severity: "${newData.severity}", diagnosed_by: "${newData.diagnosed_by}", emr_id: "${newData.emr_id}", in_parent_id: "${newData.in_parent_id}", body_part_id: "${newData.body_part_id}", diagnosis_note: "${newData.diagnosis_note}", active: "${newData.active}", date_of_entry: "${newData.date_of_entry}", encounter_id: "${newData.encounter_id}"){
              id
              emr_id
              encounter_id
              active
              severity
              status
              diagnosis
              diagnosed_by
              date_of_entry
              diagnosis_note
              diagnosis_type
              in_parent_id
              body_part_id
              hospital_diagnosed
              created_at     
             }
          }
        `,
        update: (store, result: any) => {
          console.log(result);
          let updatePatientDiagnosis = result.data && result.data.updatePatientDiagnosis;
          console.log(updatePatientDiagnosis);
          const data: any = store.readQuery({ query: this.Patient_Diagnosis_Query,});
          let updatedData = data.PatientDiagnosis.map(item => {
            if(item.id === updatePatientDiagnosis.id){
              return updatePatientDiagnosis;
            }
            return item;
          });
          data.PatientDiagnosis = updatedData;
          store.writeQuery({ query: this.Patient_Diagnosis_Query, data });
        },
      }).subscribe(result => {
        console.log(result);
        this.closeModal();
      }, (error) => {
        console.log("An error occured", error)
      });
    }
  }

  addPatientDiagnosis(form: FormGroup) {
    if (form.valid) {
      let newData: any = form.value;
      this.apollo
      .mutate({
        mutation: gql`
          mutation addPatientDiagnosis {
            addPatientDiagnosis(diagnosis: "${newData.diagnosis}", diagnosis_type: "${newData.diagnosis_type}", hospital_diagnosed: "${newData.hospital_diagnosed}", status: "${newData.status}", severity: "${newData.severity}", diagnosed_by: "${newData.diagnosed_by}", emr_id: "${newData.emr_id}", in_parent_id: "${newData.in_parent_id}", body_part_id: "${newData.body_part_id}", diagnosis_note: "${newData.diagnosis_note}", active: "${newData.active}", date_of_entry: "${newData.date_of_entry}", encounter_id: "${newData.encounter_id}"){
                id
                emr_id
                encounter_id
                active
                severity
                status
                diagnosis
                diagnosed_by
                date_of_entry
                diagnosis_note
                diagnosis_type
                in_parent_id
                body_part_id
                hospital_diagnosed      
                created_at
            }
          }
        `,
        update: (store, result: any) => {
          console.log(result);
          let addPatientDiagnosis = result.data && result.data.addPatientDiagnosis;
          const data: any = store.readQuery({ query: this.Patient_Diagnosis_Query,});
          data.PatientDiagnosis.push(addPatientDiagnosis);
          store.writeQuery({ query: this.Patient_Diagnosis_Query, data });
        },
      }).subscribe(result => {
        this.closeModal();
      }, (error) => {
        console.log("An error occured", error)
      });
    }
  }

}
