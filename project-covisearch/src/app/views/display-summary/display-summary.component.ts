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
export class DisplaySummaryComponent implements AfterViewInit  {
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
  private multiChartLine: any;

  constructor(
    private httpService: HttpService,
    private graphdata: GraphDataConverterService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
  }

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
      console.log(this.barResult);
      console.log(this.stackedResult);
      let label: any = [];
      let positive: any = [];
      let negative: any = [];
      let neutral: any = [];
      this.stackedResult.forEach((ele,idx) => {
        label.push(ele.name);

        ele['series'].forEach((ele2: any) => {
          if (ele2.name == 'Positive') {
            positive.push(ele2.value);
          }
          else if (ele2.name == 'Negative') {
            negative.push(ele2.value);
          }
          else if (ele2.name == 'Neutral') {
            neutral.push(ele2.value);
          }
        });

        if(idx != positive.length - 1){
          positive.push(0);
          
        }
        if(idx != negative.length - 1){
          negative.push(0);
        }
        if(idx != neutral.length - 1){
          neutral.push(0);
        }
      });
      console.log('==========================');
      console.log(label);
      console.log(positive);

      console.log(negative);
      console.log(neutral);
      console.log('==========================');
      this.multiChartLine = new Chart('multi_chart', {
        type: 'line',
        data: {
          labels: [...Object.keys(this.barResult)],
          datasets: [
            {
              data: [...Object.values(this.barResult)],
              label: 'No. of Tweets',
              backgroundColor: transparentize('#fa9cb0', 0.3),
              borderColor: '#fa9cb0',
              yAxisID: 'y1',
              type: 'bar',
            },
            {
              data: positive,
              label: 'Positive',
              backgroundColor: transparentize('#3e95cd', 0.3),

              borderColor: '#3e95cd',

              yAxisID: 'y',
            },
            {
              data: negative,
              label: 'Negative',
              backgroundColor: transparentize('#ffcd56', 0.2),
              borderColor: '#ffcd56',
              yAxisID: 'y',
            },
            {
              data: neutral,
              label: 'Neutral',
              backgroundColor: transparentize('#ffcd56', 0.2),
              borderColor: '#ffcd56',
              yAxisID: 'y',
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

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
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
