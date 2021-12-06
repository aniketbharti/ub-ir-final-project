import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sentimentviewer',
  templateUrl: './sentimentviewer.component.html',
  styleUrls: ['./sentimentviewer.component.scss'],
})
export class SentimentviewerComponent {
  @Input() stackedResult: any[] = [];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Normalized Population';

  constructor() {}

  onSelect(event: any) {
    console.log(event);
  }
}
