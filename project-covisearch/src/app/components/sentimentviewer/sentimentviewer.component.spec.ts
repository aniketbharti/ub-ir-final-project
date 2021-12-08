import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentviewerComponent } from './sentimentviewer.component';

describe('SentimentviewerComponent', () => {
  let component: SentimentviewerComponent;
  let fixture: ComponentFixture<SentimentviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentimentviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
