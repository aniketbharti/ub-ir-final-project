import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-adv-piechart',
  templateUrl: './adv-piechart.component.html',
  styleUrls: ['./adv-piechart.component.scss'],
})
export class AdvPiechartComponent {
  @Input() pieData: any[] =[]
  single: any[] = [];
  view: [number, number] = [1360, 500];

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;


  constructor() {}

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
