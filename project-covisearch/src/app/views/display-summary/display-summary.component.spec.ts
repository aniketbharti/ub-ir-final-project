import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySummaryComponent } from './display-summary.component';

describe('DisplaySummaryComponent', () => {
  let component: DisplaySummaryComponent;
  let fixture: ComponentFixture<DisplaySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
