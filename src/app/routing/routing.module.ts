import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';

import { MainPageComponent } from '../pages/main';
import { Page404Component } from '../pages/page-404';
import { PatientDiagnosisPageComponent } from '../pages/patient-diagnosis';
import { PatientVisitNotePageComponent } from '../pages/patient-visit-note';

const VERTICAL_ROUTES: Routes = [
  { path: 'main', component: MainPageComponent },
  { path: 'patient-diagnosis', component: PatientDiagnosisPageComponent},
  { path: 'patient-visit-note', component: PatientVisitNotePageComponent },  
  { path: '**', component: Page404Component }
];

const PUBLIC_ROUTES: Routes = [

];

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/vertical/main',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: '**',
    component: VerticalLayoutComponent,
    children: VERTICAL_ROUTES
  }
];

@NgModule({
  imports: [

  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
