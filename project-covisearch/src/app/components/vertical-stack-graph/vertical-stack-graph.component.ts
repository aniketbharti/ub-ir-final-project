import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-vertical-stack-graph',
  templateUrl: './vertical-stack-graph.component.html',
  styleUrls: ['./vertical-stack-graph.component.scss']
})
export class VerticalStackGraphComponent {
  @Input() vgraphData: any[] = []
  view: [number, number] = [700, 400];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Population';
  animations: boolean = true;


  onSelect(event: any) {
    console.log(event);
  }
}


