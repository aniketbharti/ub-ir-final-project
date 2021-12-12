import { HttpParams } from '@angular/common/http';
import colorLib from '@kurkle/color';
import { Component, VERSION, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http.service';

class RadarModel {
  label: any = new Set();
  indiaData: number[] = [];
  mexicoData: number[] = [];
  usaData: number[] = [];
}
class BarModel {
  label: any = new Set();
  indiaData: number[] = [];
  mexicoData: number[] = [];
  usaData: number[] = [];
}

function transparentize(value: any, opacity: any) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}
@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss'],
})
export class ChartjsComponent implements AfterViewInit {
  private casesRadarChart: any;
  private casesBarChart: any;
  private dosesRadarChart: any;
  private dosesBarChart: any;

  name = 'Angular ' + VERSION.major;
  radarCorpusMain: RadarModel = new RadarModel();
  dataCorpus: any = [];
  barCorpusMain: BarModel = new BarModel();
  dataCorpusOther: any = new Map();

  labels: String[] = ['A', 'B', 'C', 'D', 'E', 'G'];
  dataSet1: Number[] = [86, 114, 10, 106, 107, 111];
  dataSet2: Number[] = [40, 220, 15, 16, 24, 212];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.radarCorpusMain = new RadarModel();
    this.barCorpusMain = new BarModel();
    let path = 'mexico,india,usa';
    this.httpService
      .getMethod(
        'https://disease.sh/v3/covid-19/historical/' +
          path +
          '?' +
          'lastdays=180'
      )
      .subscribe((data) => {
        this.dataCorpus = data;
        this.dataCorpus.forEach((element: any) => {
          let values = new Map();
          let values_2 = new Map();
          let prev_value = Number(
            Object.values(element['timeline']['cases'])[0]
          );
          Object.entries(element['timeline']['cases']).forEach((entry) => {
            const [key, value] = entry;
            let cases = Number(value) - prev_value;
            let date = moment(key, 'MM/DD/YY').format('MMM');
            let date_1 = moment(key, 'MM/DD/YY').format('DD-MMM');

            if (!values.has(date)) {
              this.radarCorpusMain.label.add(date);
              values.set(date, [cases]);
            } else {
              values.get(date).push(cases);
            }
            if (!values_2.has(date_1)) {
              this.barCorpusMain.label.add(date_1);
            }
            if (element['country'] == 'Mexico') {
              this.barCorpusMain.mexicoData.push(cases);
            } else if (element['country'] == 'India') {
              this.barCorpusMain.indiaData.push(cases);
            } else if (element['country'] == 'USA') {
              this.barCorpusMain.usaData.push(cases);
            }

            prev_value = Number(value);
            // if(!values.has(date)){
            //   values.set(date,new Array());
            //   values.get(date).push(value);
            // }else{
            //   values
            // }
          });
          this.dataCorpusOther.set(element['country'], values);
        });
        for (let item of this.radarCorpusMain.label) {
          let list = this.dataCorpusOther.get('India').get(item);
          let avg = list.reduce((a: any, b: any) => a + b, 0) / list.length;

          this.radarCorpusMain.indiaData.push(avg);

          avg =
            this.dataCorpusOther
              .get('Mexico')
              .get(item)
              .reduce((a: any, b: any) => a + b, 0) /
            this.dataCorpusOther.get('Mexico').get(item).length;
          this.radarCorpusMain.mexicoData.push(avg);
          avg =
            this.dataCorpusOther
              .get('USA')
              .get(item)
              .reduce((a: any, b: any) => a + b, 0) /
            this.dataCorpusOther.get('USA').get(item).length;
          this.radarCorpusMain.usaData.push(avg);
        }

        this.casesRadarChart = new Chart('cases_radar_chart', {
          type: 'radar',
          data: {
            labels: [...this.radarCorpusMain.label],
            datasets: [
              {
                data: this.radarCorpusMain.mexicoData,
                label: 'Mexico',
                backgroundColor: transparentize('#fa9cb0', 0.3),

                borderColor: '#fa9cb0',
              },
              {
                data: this.radarCorpusMain.indiaData,
                label: 'India',
                backgroundColor: transparentize('#ffcd56', 0.3),
                borderColor: '#ffcd56',
                fill: '-1',
              },

              {
                data: this.radarCorpusMain.usaData,
                label: 'USA',
                backgroundColor: transparentize('#3e95cd', 0.3),

                borderColor: '#3e95cd',
                fill: '-2',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Average Cases per Country',
              },
            },
          },
        });
        this.casesBarChart = new Chart('cases_bar_chart', {
          type: 'bar',
          data: {
            labels: [...this.barCorpusMain.label],
            datasets: [
              {
                label: 'Mexico',
                data: this.barCorpusMain.mexicoData,
                backgroundColor: transparentize('#fa9cb0', 0.3),

                borderColor: '#fa9cb0',
                borderWidth: 2,
                barThickness: 4,
                barPercentage: 0.5,
                borderRadius: 5,
                borderSkipped: false,
              },
              {
                label: 'India',
                data: this.barCorpusMain.indiaData,
                backgroundColor: transparentize('#ffcd56', 0.3),
                borderColor: '#ffcd56',
                barThickness: 4,
                barPercentage: 0.5,
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
              },
              {
                label: 'USA',
                data: this.barCorpusMain.usaData,
                backgroundColor: transparentize('#3e95cd', 0.3),
                barThickness: 4,
                borderColor: '#3e95cd',
                barPercentage: 0.5,

                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
              },
            ],
          },
          options: {
            indexAxis: 'x',
            plugins: {
              title: {
                display: true,
                text: 'COVID Cases for last 180 Day',
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          },
        });
      });

    this.httpService
      .getMethod(
        'https://disease.sh/v3/covid-19/vaccine/coverage/countries/' +
          'mexico' +
          '?' +
          'lastdays=180' +
          '&' +
          'fullData=false'
      )
      .subscribe((data) => {
        this.radarCorpusMain = new RadarModel();
        this.barCorpusMain = new BarModel();
        this.dataCorpusOther = new Map();
        this.dataCorpus = data;
        let values = new Map();
        let values_2 = new Map();
        let prev_value = Number(Object.values(this.dataCorpus['timeline'])[0]);

        Object.entries(this.dataCorpus['timeline']).forEach((entry) => {
          const [key, value] = entry;
          let doses = Number(value) - prev_value;
          if (doses < 0) {
            doses = 0;
          }
          let date = moment(key, 'MM/DD/YY').format('MMM');
          let date_1 = moment(key, 'MM/DD/YY').format('DD-MMM');

          if (!values.has(date)) {
            this.radarCorpusMain.label.add(date);
            values.set(date, [doses]);
          } else {
            values.get(date).push(doses);
          }
          if (!values_2.has(date_1)) {
            this.barCorpusMain.label.add(date_1);
          }
          this.barCorpusMain.mexicoData.push(doses);
          prev_value = Number(value);
          // if(!values.has(date)){
          //   values.set(date,new Array());
          //   values.get(date).push(value);
          // }else{
          //   values
          // }
        });
        this.dataCorpusOther.set('Mexico', values);
        this.httpService
          .getMethod(
            'https://disease.sh/v3/covid-19/vaccine/coverage/countries/' +
              'india' +
              '?' +
              'lastdays=180' +
              '&' +
              'fullData=false'
          )
          .subscribe((data) => {
            this.dataCorpus = data;
            let values = new Map();
            let values_2 = new Map();
            let prev_value = Number(
              Object.values(this.dataCorpus['timeline'])[0]
            );
            Object.entries(this.dataCorpus['timeline']).forEach((entry) => {
              const [key, value] = entry;
              let doses = Number(value) - prev_value;
              if (doses < 0) {
                doses = 0;
              }
              let date = moment(key, 'MM/DD/YY').format('MMM');
              let date_1 = moment(key, 'MM/DD/YY').format('DD-MMM');

              if (!values.has(date)) {
                this.radarCorpusMain.label.add(date);
                values.set(date, [doses]);
              } else {
                values.get(date).push(doses);
              }
              if (!values_2.has(date_1)) {
                this.barCorpusMain.label.add(date_1);
              }
              this.barCorpusMain.indiaData.push(doses);
              prev_value = Number(value);
              // if(!values.has(date)){
              //   values.set(date,new Array());
              //   values.get(date).push(value);
              // }else{
              //   values
              // }
            });
            this.dataCorpusOther.set('India', values);
            this.httpService
              .getMethod(
                'https://disease.sh/v3/covid-19/vaccine/coverage/countries/' +
                  'usa' +
                  '?' +
                  'lastdays=180' +
                  '&' +
                  'fullData=false'
              )
              .subscribe((data) => {
                this.dataCorpus = data;
                let values = new Map();
                let values_2 = new Map();
                let prev_value = Number(
                  Object.values(this.dataCorpus['timeline'])[0]
                );
                Object.entries(this.dataCorpus['timeline']).forEach((entry) => {
                  const [key, value] = entry;
                  let doses = Number(value) - prev_value;
                  if (doses < 0) {
                    doses = 0;
                  }
                  let date = moment(key, 'MM/DD/YY').format('MMM');
                  let date_1 = moment(key, 'MM/DD/YY').format('DD-MMM');

                  if (!values.has(date)) {
                    this.radarCorpusMain.label.add(date);
                    values.set(date, [doses]);
                  } else {
                    values.get(date).push(doses);
                  }
                  if (!values_2.has(date_1)) {
                    this.barCorpusMain.label.add(date_1);
                  }
                  this.barCorpusMain.usaData.push(doses);
                  prev_value = Number(value);
                  // if(!values.has(date)){
                  //   values.set(date,new Array());
                  //   values.get(date).push(value);
                  // }else{
                  //   values
                  // }
                });
                this.dataCorpusOther.set('USA', values);

                for (let item of this.radarCorpusMain.label) {
                  let list = this.dataCorpusOther.get('India').get(item);
                  let avg =
                    list.reduce((a: any, b: any) => a + b, 0) / list.length;
                  this.radarCorpusMain.indiaData.push(avg);
                  avg =
                    this.dataCorpusOther
                      .get('Mexico')
                      .get(item)
                      .reduce((a: any, b: any) => a + b, 0) /
                    this.dataCorpusOther.get('Mexico').get(item).length;
                  this.radarCorpusMain.mexicoData.push(avg);
                  avg =
                    this.dataCorpusOther
                      .get('USA')
                      .get(item)
                      .reduce((a: any, b: any) => a + b, 0) /
                    this.dataCorpusOther.get('USA').get(item).length;
                  this.radarCorpusMain.usaData.push(avg);
                }
                this.dosesRadarChart = new Chart('doses_radar_chart', {
                  type: 'radar',
                  data: {
                    labels: [...this.radarCorpusMain.label],
                    datasets: [
                      {
                        data: this.radarCorpusMain.mexicoData,
                        label: 'Mexico',
                        backgroundColor: transparentize('#fa9cb0', 0.3),
                        borderColor: '#fa9cb0',
                      },
                      {
                        data: this.radarCorpusMain.usaData,
                        label: 'USA',
                        backgroundColor: transparentize('#3e95cd', 0.3),

                        borderColor: '#3e95cd',
                        fill: '-1',
                      },
                      {
                        data: this.radarCorpusMain.indiaData,
                        label: 'India',
                        backgroundColor: transparentize('#ffcd56', 0.2),
                        borderColor: '#ffcd56',
                        fill: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Monthly Average Doses per Country',
                      },
                    },
                  },
                });
                this.dosesBarChart = new Chart('doses_bar_chart', {
                  type: 'bar',
                  data: {
                    labels: [...this.barCorpusMain.label],
                    datasets: [
                      {
                        label: 'Mexico',
                        data: this.barCorpusMain.mexicoData,
                        backgroundColor: transparentize('#fa9cb0', 0.3),

                        borderColor: '#fa9cb0',
                        borderWidth: 2,
                        barThickness: 4,
                        barPercentage: 0.5,
                        borderRadius: 5,
                        borderSkipped: false,
                      },
                      {
                        label: 'India',
                        data: this.barCorpusMain.indiaData,
                        backgroundColor: transparentize('#ffcd56', 0.3),
                        borderColor: '#ffcd56',
                        barThickness: 4,
                        barPercentage: 0.5,
                        borderWidth: 2,
                        borderRadius: 5,
                        borderSkipped: false,
                      },
                      {
                        label: 'USA',
                        data: this.barCorpusMain.usaData,
                        backgroundColor: transparentize('#3e95cd', 0.3),
                        barThickness: 4,
                        borderColor: '#3e95cd',
                        barPercentage: 0.5,

                        borderWidth: 2,
                        borderRadius: 5,
                        borderSkipped: false,
                      },
                    ],
                  },
                  options: {
                    indexAxis: 'x',
                    plugins: {
                      title: {
                        display: true,
                        text: 'Vaccine Coverage for last 180 Day',
                      },
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        grid: {
                          drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                      },
                    },
                  },
                });
              });
          });
      });
  }

  createChart() {
    var chartInstance = new Chart('chartJSContainer', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.dataSet2,
            label: 'Asia',
            backgroundColor: '#7b8dfd',
          },
          {
            data: this.dataSet1,
            label: 'Africa',
            backgroundColor: '#fa9cb0',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  }
}
