import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-summary',
  templateUrl: './display-summary.component.html',
  styleUrls: ['./display-summary.component.scss'],
})
export class DisplaySummaryComponent implements OnInit {
  res: any | null = null;
  stackedResult: any[] = [];
  chartCountry: any[] = [];
  barResult: any[] = [];
  state: boolean = true;
  data: any[] = [];
  pois: any[] = [];
  nonpoi: any[] = [];
  chartLanguage: any[] = [];
  hashTagArray: any[] = [];
  constructor(
    private httpService: HttpService,
    private graphdata: GraphDataConverterService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.loaderListener().subscribe((res: any) => {
      this.state = res.state;
    });
    this.httpService.getMethod(environment.global, {}).subscribe((res) => {
      this.data = res.response.docs;
      res.response.docs.forEach((element: any) => {
        if ('poi_name' in element) {
          this.pois.push(element);
        } else {
          this.nonpoi.push(element);
        }
        if ('hashtags' in element) {
          this.hashTagArray = [...this.hashTagArray, ...element['hashtags']];
        }
      });
      let result = _.values(_.groupBy(this.hashTagArray)).map((d) => ({
        name: d[0],
        value: d.length,
      }));
      this.hashTagArray = _.orderBy(result, ['value'], ['desc']).slice(0, 10);
      
      this.chartCountry = this.graphdata.convertToChart('country', this.data);
      this.chartLanguage = this.graphdata.convertToChart(
        'tweet_lang',
        this.data
      );

      let barResult = this.graphdata.convertToChart('poi_name', this.pois);

      this.barResult = _.orderBy(
        barResult,
        ['name', 'value'],
        ['asc', 'desc']
      ).slice(0, 5);
      let res1 = this.graphdata.convertToBarGraph(
        'sentiments_text',
        this.pois,
        false,
        'poi_name'
      );

      this.barResult.forEach((ele) => {
        res1.forEach((ele2) => {
          if (ele.name == ele2.name) {
            // const a = ele.findIndex((i: any) => (i.name = 'Neutral'));
            // const value = Math.random() * (60 - 30) + 30
            // ele[a] = ele[a].value - value
            this.stackedResult.push(ele2);
          }
        });
      });
      console.log(this.stackedResult);

      this.loaderService.changeLoaderState({
        state: false,
        location: 'global',
      });
      console.log(res);
    });
  }
}
