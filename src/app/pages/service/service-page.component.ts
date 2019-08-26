import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IPageData } from '../../interfaces/page-data';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import * as PageActions from '../../store/actions/page.actions';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { IOption } from '../../ui/interfaces/option';

@Component({
  selector: 'service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss']
})

export class ServicePageComponent implements OnInit, OnDestroy {
  pageData: IPageData;
  tableData: any[];
  billerCategoryData: IOption[];
  error: any;
  ServiceForm: FormGroup;
  SERVICE_QUERY: any;
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
      title: 'Service',
      loaded: false,
      breadcrumbs: [
        {
          title: 'Main',
          route: 'main'
        },
        {
          title: 'Service'
        }
      ]
    };
    this.tableData = [];
    this.billerCategoryData = [];
    this.SERVICE_QUERY = gql`
    {
      services{
        id
        name
        unit_cost_price
        unit_selling_price
        description
        biller_category_id
        biller_category_name
        created_at
        biller_category{
          name
          description
        }
        reserved_name
        reserved
      }
    }
    `;
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.ServiceForm.reset();
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

  // init ServiceForm
  initForm(data: any) {
    this.ServiceForm = this.formBuilder.group({
      name: [(data ? data.name : ''), Validators.required],
      description: [(data ? data.description : ''), Validators.required],
      biller_category_id: [data ? data.biller_category_id : '', Validators.required],
      unit_cost_price: [data ? data.unit_cost_price : '', Validators.required],
      unit_selling_price: [data ? data.unit_selling_price : '', Validators.required],
      id: data ? data.id : '',
    });
  }

  // edit Service
  edit(row: any) {
    this.openModal(this.modalBody, 'Edit Service', this.modalUpdateFooter, row);
  }

  // remove Service
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
          mutation deleteService {
            deleteService(id: "${newData.id}"){
              id
              name
              unit_cost_price
              unit_selling_price
              description
              biller_category_id
              biller_category_name
              created_at
              biller_category{
                name
                description
              }
              reserved_name
              reserved
            }
          }
        `,
        update: (store, result: any) => {
          let deleteService = result.data && result.data.deleteService;
          const data:any = store.readQuery({ query: this.SERVICE_QUERY,});
          let newData = [];
          for(let i = 0; i < data.services.length; i++){
            if(data.services[i].id === deleteService.id){
              continue;
            }
            newData.push(data.services[i]);
          }
          data.services = newData;
          store.writeQuery({ query: this.SERVICE_QUERY, data });
        },
      }).subscribe(()=>{
        this.closeConfirmDeleteModal();
      });
    }
  }

  ngOnInit() {
    this.store.dispatch(new PageActions.Set(this.pageData));
    this.getData();
    this.getBillerCategories();
  }

  getBillerCategories() {
    this.apollo
      .watchQuery({
        query: gql`
        {
          billerCategories{
            id
            name
            description
            reserved_name
            reserved
            created_at
          }
        }
        `,
      })
      .valueChanges.subscribe( (result: any) => {
        let billerCategories = result.data && result.data.billerCategories || [];
        this.billerCategoryData = billerCategories.map((item, i) => {
          return {
            label: item.name,
            value: item.id
          }
        });
      });
  }
  
  getData() {
    this.apollo
      .watchQuery({
        query: this.SERVICE_QUERY,
      })
      .valueChanges.subscribe((result: any) => {
        this.tableData = result.data && result.data.services;
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
          mutation updateService {
            updateService(id: "${newData.id}", name: "${newData.name}", biller_category_id: "${newData.biller_category_id}", unit_cost_price:  ${parseFloat(newData.unit_cost_price)}, unit_selling_price: ${parseFloat(newData.unit_selling_price)}, description: "${newData.description}"){
              id
              name
              unit_cost_price
              unit_selling_price
              description
              biller_category_id
              biller_category_name
              created_at
              biller_category{
                name
                description
              }
              reserved_name
              reserved
            }
          }
        `,
        update: (store, result: any) => {
          let updateService = result.data && result.data.updateService;
          const data:any = store.readQuery({ query: this.SERVICE_QUERY,});
          let updatedData = data.services.map(item => {
            if(item.id === updateService.id){
              return updateService;
            }
            return item;
          });
          data.services = updatedData;
          store.writeQuery({ query: this.SERVICE_QUERY, data });
        },
      }).subscribe(result => {
        this.closeModal();
      });
    }
  }

  add(form: FormGroup) {
    if (form.valid) {
      let newData: any = form.value;
      this.apollo
      .mutate({
        mutation: gql`
          mutation addService {
            addService(name: "${newData.name}", biller_category_id: "${newData.biller_category_id}", unit_cost_price:  ${parseFloat(newData.unit_cost_price)}, unit_selling_price: ${parseFloat(newData.unit_selling_price)}, description: "${newData.description}"){
              id
              name
              unit_cost_price
              unit_selling_price
              description
              biller_category_id
              biller_category_name
              created_at
              biller_category{
                name
                description
                reserved_name
                reserved
              }
            }
          }
        `,
        update: (store, result: any) => {
          let addService = result.data && result.data.addService;
          const data:any = store.readQuery({ query: this.SERVICE_QUERY,});
          data.services.push(addService);
          store.writeQuery({ query: this.SERVICE_QUERY, data });
        },
      }).subscribe(result => {
        this.closeModal();
      });
    }
  }

}
