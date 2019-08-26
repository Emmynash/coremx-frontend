import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDiagnosisPageComponent } from './patient-diagnosis-page.component';

describe('PatientDiagnosisPageComponent', () => {
  let component: PatientDiagnosisPageComponent;
  let fixture: ComponentFixture<PatientDiagnosisPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDiagnosisPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDiagnosisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
