import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-multiplebargraph',
  templateUrl: './multiplebargraph.component.html',
  styleUrls: ['./multiplebargraph.component.scss'],
})
export class MultiplebargraphComponent {
  @Input() multi: any[] = [];
  view: [number, number] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Pois';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Replies';
  legendTitle: string = 'Sentiments';

  constructor() {}

  onSelect(data: any): void {}

  onActivate(data: any): void {}

  onDeactivate(data: any): void {}
}
