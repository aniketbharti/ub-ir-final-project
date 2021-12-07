import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sentimentviewer',
  templateUrl: './sentimentviewer.component.html',
  styleUrls: ['./sentimentviewer.component.scss'],
})
export class SentimentviewerComponent {
  @Input() stackedResult: any[] = [];
  view:[number,number]=[300,100]
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Pois';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = '';

  constructor() {}
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  onSelect(event: any) {
    console.log(event);
  }
}
