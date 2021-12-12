import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplebargraphComponent } from './multiplebargraph.component';

describe('MultiplebargraphComponent', () => {
  let component: MultiplebargraphComponent;
  let fixture: ComponentFixture<MultiplebargraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplebargraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplebargraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
