import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStackGraphComponent } from './vertical-stack-graph.component';

describe('VerticalStackGraphComponent', () => {
  let component: VerticalStackGraphComponent;
  let fixture: ComponentFixture<VerticalStackGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalStackGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalStackGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
