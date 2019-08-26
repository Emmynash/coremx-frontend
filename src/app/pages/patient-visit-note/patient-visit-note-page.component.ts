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
  selector: 'patient-visit-note-page',
  templateUrl: './patient-visit-note-page.component.html',
  styleUrls: ['./patient-visit-note-page.component.scss']
})

export class PatientVisitNotePageComponent implements OnInit, OnDestroy {
  pageData: IPageData;
  tableData: any[];
  error: any;
  patientVisitNoteForm: FormGroup;
  reason: IOption[];
  Patient_Visit_Note_Query: any;
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
      title: 'Patient Visit Note',
      loaded: false,
      breadcrumbs: [
        {
          title: 'Main',
          route: 'main'
        },
        {
          title: 'Patient Visit Note'
        }
      ]
    };
    this.reason = [
      {
        label: 'normal',
        value: 'normal'
      },
      {
        label: 'admission',
        value: 'admission'
      },
      {
        label: 'antenatal',
        value: 'antenatal'
      }
    ];

    this.tableData = [];
    this.Patient_Visit_Note_Query = gql`
    {
      PatientVisitNotes {
        id
        emr_id
        encounter_id
        reason
        decription
        source_app
        hospital_visited
        note_type
        date_of_entry
        module
        noted_by
      }
    }
    `;
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.patientVisitNoteForm.reset();
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

  // init PatientVisitNote
  initForm(data: any) {
    this.patientVisitNoteForm = this.formBuilder.group({
      id: data ? data.id : '',
      noted_by: [(data ? data.noted_by : ''), Validators.required],
      decription: [(data ? data.decription : ''), Validators.required],
      note_type: data ? data.note_type : '',
      reason: [(data ? data.reason : ''), Validators.required],
      hospital_visited: data ? data.hospital_visited : '',
      source_app: data ? data.source_app : '',
      emr_id: [(data ? data.emr_id : ''), Validators.required],
      module: [(data ? data.module : ''), Validators.required],
      date_of_entry: [(data ? data.date_of_entry : ''), Validators.required],
      encounter_id: [(data ? data.encounter_id : ''), Validators.required],
    });
  }

  // edit Patienet Visit Note
  edit(row: any) {
    this.openModal(this.modalBody, 'Edit Patient Visit Note', this.modalUpdateFooter, row);
  }

  // remove Patient Visit Note
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
      console.log(newData);
    this.apollo
      .mutate({
        mutation: gql`
          mutation deletePatientVisitNotes {
            deletePatientVisitNotes(id: "${newData.id}"){
                id
                emr_id
                encounter_id
                reason
                decription
                source_app
                hospital_visited
                note_type
                date_of_entry
                module
                noted_by

            }
          }
        `,        
        update: (store, result: any) => {
          let deletePatientVisitNotes = result.data && result.data.deletePatientVisitNotes;
          const data: any = store.readQuery({ query: this.Patient_Visit_Note_Query,});
          let newData = [];
          for (let i = 0; i < data.PatientVisitNotes.length; i++){
            if (data.PatientVisitNotes[i].id === deletePatientVisitNotes.id){
              continue;
            }
            newData.push(data.PatientVisitNotes[i]);
          }
          data.PatientVisitNotes = newData;
          store.writeQuery({ query: this.Patient_Visit_Note_Query, data });
        },
      }).subscribe(()=>{
        this.closeConfirmDeleteModal();
      }); 
    }
  }

  ngOnInit() {
    this.store.dispatch(new PageActions.Set(this.pageData));
    this.getData();
  }
  
  getData() {
    this.apollo
      .watchQuery({
        query: this.Patient_Visit_Note_Query,
      })
      .valueChanges.subscribe( (result: any) => {
        console.log(result);
        this.tableData = result.data && result.data.PatientVisitNotes;
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
          mutation updatePatientVisitNotes {
              updatePatientVisitNotes(id: "${newData.id}", noted_by: "${newData.noted_by}", decription: "${newData.decription}", date_of_entry: "${newData.date_of_entry}", note_type: "${newData.note_type}", reason: "${newData.reason}", hospital_visited: "${newData.hospital_visited}", source_app: "${newData.source_app}", emr_id: "${newData.emr_id}", module: "${newData.module}",, encounter_id: "${newData.encounter_id}"){
                id
                emr_id
                encounter_id
                reason
                decription
                source_app
                hospital_visited
                note_type
                date_of_entry
                module
                noted_by
            }
          }
        `,
        update: (store, result: any) => {
          console.log(newData);
          console.log(result);
          let updatePatientVisitNotes = result.data && result.data.updatePatientVisitNotes;
          const data: any = store.readQuery({ query: this.Patient_Visit_Note_Query,});
          let updatedData = data.PatientVisitNotes.map(item => {
            if (item.id === updatePatientVisitNotes.id){
              return updatePatientVisitNotes;
            }
            return item;
          });
          data.PatientVisitNotes = updatedData;
          store.writeQuery({ query: this.Patient_Visit_Note_Query, data });
        },
      }).subscribe(result => {
        this.closeModal();
      });
    }
  }

  addPatientVisitNote(form: FormGroup) {
    if (form.valid) {
      let newData: any = form.value;
      this.apollo
      .mutate({
        mutation: gql`
          mutation addPatientVisitNotes {
            addPatientVisitNotes(decription: "${newData.decription}", noted_by: "${newData.noted_by}", date_of_entry: "${newData.date_of_entry}", note_type: "${newData.note_type}", reason: "${newData.reason}", hospital_visited: "${newData.hospital_visited}", source_app: "${newData.source_app}", emr_id: "${newData.emr_id}", module: "${newData.module}", encounter_id: "${newData.encounter_id}"){
              id
              emr_id
              encounter_id
              reason
              decription
              source_app
              hospital_visited
              note_type
              date_of_entry
              module
              noted_by
            }
          }
        `,
        update: (store, result: any) => {
          let addPatientVisitNotes = result.data && result.data.addPatientVisitNotes;
          const data: any = store.readQuery({ query: this.Patient_Visit_Note_Query,});
          data.PatientVisitNotes.push(addPatientVisitNotes);
          store.writeQuery({ query: this.Patient_Visit_Note_Query, data });
        },
      }).subscribe(result => {
        this.closeModal();
      });
    }
  }

}
