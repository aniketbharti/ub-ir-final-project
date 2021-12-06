import { Component, OnInit } from '@angular/core';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-summary',
  templateUrl: './display-summary.component.html',
  styleUrls: ['./display-summary.component.scss']
})
export class DisplaySummaryComponent implements OnInit {
  res: any | null = null;
  chartResult: any[] = [];
  barResult: any[] = []
  constructor(private httpService: HttpService, private graphdata: GraphDataConverterService) { }

  ngOnInit(): void {
    this.httpService.postMethod(environment.countrytweet, {}).subscribe((res) => {
      this.res = res
      this.chartResult = this.graphdata.convertToChart("country", res['response'])
      console.log(this.chartResult)
    })
    this.httpService.postMethod(environment.pois, {}).subscribe((res) => {
      this.res = res
      this.barResult = this.graphdata.convertToChart("poi_name", res['response'])
      console.log(this.barResult)
    })
  }

}
