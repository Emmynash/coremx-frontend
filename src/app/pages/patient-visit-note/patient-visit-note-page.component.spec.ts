import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitNotePageComponent } from './patient-visit-note-page.component';

describe('PatientDiagnosisPageComponent', () => {
  let component: PatientVisitNotePageComponent;
  let fixture: ComponentFixture<PatientVisitNotePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientVisitNotePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientVisitNotePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
