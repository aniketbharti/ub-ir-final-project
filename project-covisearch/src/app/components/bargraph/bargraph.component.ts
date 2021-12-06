import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss']
})
export class BargraphComponent {

  @Input() barResult: any[] = []

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Pois';
  showYAxisLabel = true;
  yAxisLabel = 'Tweet';


  constructor() {
  }

  onSelect(event: any) {
    console.log(event);
  }

}
