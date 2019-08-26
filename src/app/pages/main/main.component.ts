import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'page-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainPageComponent extends BasePageComponent implements OnInit, OnDestroy {
  stats: any;
  STATS_QUERY: any;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private apollo: Apollo
  ) {
    super(store, httpSv);

    this.pageData = {
      title: '',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Main'
        }
      ]
    };
    this.stats = {
      biller_count: 0,
      biller_category_count: 0,
      billing_profile_count: 0,
      insurance_group_count: 0,
      insurance_scheme_count: 0,
      service_count: 0,
    };
    this.STATS_QUERY = gql`
    {
      statistics{
        biller_count
        biller_category_count
        billing_profile_count
        insurance_group_count
        insurance_scheme_count
        service_count
      }
    }
    `;
  }

  ngOnInit() {
    super.ngOnInit();
    this.apollo
      .watchQuery({
        query: this.STATS_QUERY,
      })
      .valueChanges.subscribe((result: any) => {
        this.stats = result.data && result.data.statistics;
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
