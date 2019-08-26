import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UIModule } from '../ui/ui.module';
import { LayoutModule } from '../layout/layout.module';
import { BasePageComponent } from './base-page';

import { MainPageComponent } from './main';
import { Page404Component } from './page-404';
import { ServicePageComponent } from './service';
import {PatientDiagnosisPageComponent} from './patient-diagnosis';
import { PatientVisitNotePageComponent } from './patient-visit-note';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    UIModule,
    LayoutModule
  ],
  declarations: [
    BasePageComponent,
    MainPageComponent,
    ServicePageComponent,
    Page404Component,
    PatientDiagnosisPageComponent,
    PatientVisitNotePageComponent
  ],
  exports: [ ],
  entryComponents: [ ]
})
export class PagesModule {}
