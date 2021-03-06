import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-stack-graph',
  templateUrl: './vertical-stack-graph.component.html',
  styleUrls: ['./vertical-stack-graph.component.scss']
})
export class VerticalStackGraphComponent {
  @Input() vgraphData: any[] = []
  view: [number, number] = [400, 400];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Pois';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Tweet';
  animations: boolean = true;


  onSelect(event: any) {
    console.log(event);
  }
}


