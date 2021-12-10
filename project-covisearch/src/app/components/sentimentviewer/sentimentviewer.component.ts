import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sentimentviewer',
  templateUrl: './sentimentviewer.component.html',
  styleUrls: ['./sentimentviewer.component.scss'],
})
export class SentimentviewerComponent {
  @Input() stackedResult: any[] = [];
  view:[number,number]=[300,40]
  showXAxis: boolean = false;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = '';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = '';

  constructor() {}
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  onSelect(event: any) {
    console.log(event);
  }
}
