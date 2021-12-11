import { Component, OnInit,VERSION ,AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.scss']
})

export class ChartjsComponent implements AfterViewInit {
    
    private chart: any;
    name = 'Angular ' + VERSION.major;
    labels: String[] = ['A', 'B', 'C', 'D', 'E', 'G'];
    dataSet1: Number[] = [86, 114, 10, 106, 107, 111];
    dataSet2: Number[] = [40, 220, 15, 16, 24, 212];
    

    ngAfterViewInit() :void{
      this.chart = new Chart('chart', {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.dataSet2,
              label: 'Asia',
              backgroundColor: '#7b6d'
            },
            {
              data: this.dataSet1,
              label: 'Africa',
              backgroundColor: '#fa9cb0'
            }
          ]
        },
        options: {
          responsive: true,
          indexAxis: 'x',
          scales: {
            x: {
              stacked: true // Make it true to make the overlapping bars visible
            },
            y: {
              stacked: true
            }
          }
        }
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
              backgroundColor: '#7b8dfd'
            },
            {
              data: this.dataSet1,
              label: 'Africa',
              backgroundColor: '#fa9cb0'
            }
          ]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              stacked: false // Make it true to make the overlapping bars visible
            },
            y: {
              stacked: true
            }
          }
        }
      });
    }
  }
  

//   const config = {
//     type: 'bar',
//     data: data,
//     options: {
//       responsive: true,
//       indexAxis:'x',
//       scales: {
//               x: {
//                 stacked: true // Make it true to make the overlapping bars visible
//               },
//               y: {
//                 stacked: true
//               }
//             },
//             xAxes:[{
//             categoryPercentage: 0.2
//             barPercentage: 1.0
//             }],
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Chart.js Bar Chart'
//         }
//       }
//     },
//   };

//   const DATA_COUNT = 7;
// const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

// const labels = Utils.months({count: 7});
// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: 'Fully Rounded',
//       data: Utils.numbers(NUMBER_CFG),
//       borderColor: Utils.CHART_COLORS.red,
//       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//       borderWidth: 2,
//       barThickness: 16,
//       barPercentage: 0.5,
//       borderRadius: Number.MAX_VALUE,
//       borderSkipped: false,
//     },
//     {
//       label: 'Small Radius',
//       data: Utils.numbers(NUMBER_CFG),
//       borderColor: Utils.CHART_COLORS.blue,
//       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
//       barThickness: 16,
//       barPercentage: 0.5,
//       borderWidth: 2,
//       borderRadius: 5,
//       borderSkipped: false,
//     }
//   ]
// };