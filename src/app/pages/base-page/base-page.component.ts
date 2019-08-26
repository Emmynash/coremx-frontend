import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { IPageData } from '../../interfaces/page-data';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import * as PageActions from '../../store/actions/page.actions';

@Component({
  selector: 'base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent implements OnInit, OnDestroy {
  pageData: IPageData;

  constructor(
    public store: Store<IAppState>,
    public httpSv: HttpService
  ) { }

  ngOnInit() {
    this.pageData ? this.store.dispatch(new PageActions.Set(this.pageData)) : null;
  }

  ngOnDestroy() {
    this.store.dispatch(new PageActions.Reset());
  }

  // get data
  // parameters:
  // * url - data url
  // * dataName - set data to 'dataName'
  // * callbackFnName run callback function with name 'callbackFnName'
  getData(url: string, dataName: string, callbackFnName?: string) {
    this.httpSv.getData(url).subscribe(
      data => {
        this[dataName] = data;
      },
      err => {
        console.log(err);
      },
      () => {
        (callbackFnName && typeof this[callbackFnName] === 'function') ? this[callbackFnName](this[dataName]) : null;
      }
    );
  }

  setLoaded(during: number = 0) {
    setTimeout(() => this.store.dispatch(new PageActions.Update({ loaded: true })), during);
  }
}
