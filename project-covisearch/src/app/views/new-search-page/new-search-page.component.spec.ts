import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSearchPageComponent } from './new-search-page.component';

describe('NewSearchPageComponent', () => {
  let component: NewSearchPageComponent;
  let fixture: ComponentFixture<NewSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSearchPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
