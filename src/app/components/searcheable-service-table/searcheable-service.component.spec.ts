import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcheableServiceTableComponent } from './searcheable-service.component';

describe('SearcheableServiceTableComponent', () => {
  let component: SearcheableServiceTableComponent;
  let fixture: ComponentFixture<SearcheableServiceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearcheableServiceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearcheableServiceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
