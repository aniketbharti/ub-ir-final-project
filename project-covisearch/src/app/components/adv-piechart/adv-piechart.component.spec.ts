import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvPiechartComponent } from './adv-piechart.component';

describe('AdvPiechartComponent', () => {
  let component: AdvPiechartComponent;
  let fixture: ComponentFixture<AdvPiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvPiechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
