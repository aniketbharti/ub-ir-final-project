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
  category: any[] = [];
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

      // ---------------------------------------------------------------
      this.hashTagArray = this.graphdata.gethashTagMapping(this.hashTagArray);
      // ----------------------------------------------------------
      this.chartCountry = this.graphdata.singleLevelDataMapping(
        'country',
        this.data
      );
      this.chartCountry.filter((ele)=> ['India', 'USA', 'Mexico'].includes(ele.name))
      // ----------------------------------------------------------
      const map: any = { en: 'English', hi: 'Hindi', es: 'Spanish' };
      this.chartLanguage = this.graphdata.singleLevelDataMapping(
        'tweet_lang',
        this.data
      );
      this.chartLanguage.forEach((ele: any) => {
        ele.name = (map as any)[ele.name];
      });
    // ----------------------------------------------------------------
      this.category = this.graphdata.singleLevelDataMapping(
        'category',
        this.data
      );
      
    // ----------------------------------------------------------------
      this.barResult = this.graphdata.getDataForTopNumberOfTweetsPOI(this.pois);

      let res1 = this.graphdata.multiLevelDataMapping(
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
      let data: any[] = [];
      this.pois.forEach((ele) => {
        this.data.forEach((ele2) => {
          if (ele.id == ele2.replied_to_tweet_id) {
            if (ele.id in data) {
              data.push(ele2);
            } else {
              data.push(ele2);
            }
          }
        });
      });
      this.loaderService.changeLoaderState({
        state: false,
        location: 'global',
      });
      console.log(res);
    });
  }
}
