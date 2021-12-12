import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as _ from 'lodash';
import { GraphDataConverterService } from 'src/app/services/graph.data.converter.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';
import colorLib from '@kurkle/color';
function transparentize(value: any, opacity: any) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

@Component({
  selector: 'app-display-summary',
  templateUrl: './display-summary.component.html',
  styleUrls: ['./display-summary.component.scss'],
})
export class DisplaySummaryComponent implements AfterViewInit {
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
  private multiChartLine: any;

  constructor(
    private httpService: HttpService,
    private graphdata: GraphDataConverterService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loaderService.loaderListener().subscribe((res: any) => {
      this.state = res.state;
    });
    this.httpService.getMethod(environment.global, {}).subscribe((res) => {
      this.data = res.response.docs;
      console.log(this.data);
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
      this.chartCountry.filter((ele) =>
        ['India', 'USA', 'Mexico'].includes(ele.name)
      );
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
      console.log(this.barResult);
      console.log(this.stackedResult);
      let label: any = [];
      let positive: any = [];
      let negative: any = [];
      let neutral: any = [];
      this.stackedResult.forEach((ele, idx) => {
        label.push(ele.name);

        ele['series'].forEach((ele2: any) => {
          if (ele2.name == 'Positive') {
            positive.push(ele2.value);
          } else if (ele2.name == 'Negative') {
            negative.push(ele2.value);
          } else if (ele2.name == 'Neutral') {
            neutral.push(ele2.value);
          }
        });

        if (idx != positive.length - 1) {
          positive.push(0);
        }
        if (idx != negative.length - 1) {
          negative.push(0);
        }
        if (idx != neutral.length - 1) {
          neutral.push(0);
        }
      });
     
      this.multiChartLine = new Chart('multi_chart', {
        type: 'line',
        data: {
          labels: [...Object.keys(this.barResult)],
          datasets: [
            {
              data: [...this.barResult.map((ele) => ele.value)],
              label: 'No. of Tweets',
              backgroundColor: transparentize('#fa9cb0', 0.3),
              borderColor: '#fa9cb0',
              yAxisID: 'y',
              type: 'bar',
            },
            {
              data: positive,
              label: 'Positive',
              backgroundColor: transparentize('#3e95cd', 0.3),

              borderColor: '#3e95cd',

              yAxisID: 'y1',
            },
            {
              data: negative,
              label: 'Negative',
              backgroundColor: transparentize('#ffcd56', 0.2),
              borderColor: '#ffcd56',
              yAxisID: 'y1',
            },
            {
              data: neutral,
              label: 'Neutral',
              backgroundColor: transparentize('#ffcd56', 0.2),
              borderColor: '#ffcd56',
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Dose Coverage',
            },
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
      this.loaderService.changeLoaderState({
        state: false,
        location: 'global',
      });
      console.log(res);
    });
  }
}
