import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FlagRenderer } from 'src/app/components/flag-renderer';
import { CovidCountryStats, TotalWorld } from 'src/app/interfaces/api.interfaces';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})

export class StatsPageComponent implements OnInit {
  data: CovidCountryStats[] = []
  columnDefs = [
    {
      field: 'country', sortable: true, filter: true, cellRendererSelector: (params: any) => {
        return {
          component: 'flagCellRenderer',
          params: params
        }
      }
    },
    {
      field: 'active', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.active),
    },
    { field: 'critical', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.critical) },
    { field: 'cases', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.cases) },
    { field: 'todayCases', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.todayCases) },
    { field: 'deaths', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.deaths) },
    { field: 'todayDeaths', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.todayDeaths) },
    { field: 'recovered', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.recovered) },
    { field: 'todayRecovered', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.todayRecovered) },
    { field: 'tests', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.tests) },
    { field: 'casesPerOneMillion', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.casesPerOneMillion) },
    { field: 'recoveredPerOneMillion', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.recoveredPerOneMillion) },
    { field: 'deathsPerOneMillion', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.deathsPerOneMillion) },
    { field: 'testsPerOneMillion', sortable: true, filter: 'agNumberColumnFilter', valueFormatter: (params: any) => this.dataFormatter(params.data.testsPerOneMillion) },
    { field: 'updated', sortable: true, filter: 'agDateColumnFilter', valueFormatter: (params: any) => (new Date(params.data.updated).toDateString()) }
  ];
  rowData: Observable<CovidCountryStats[]> | null = null;
  frameworkComponents = {
    flagCellRenderer: FlagRenderer,
  };
  gridApi: any;
  gridColumnApi: any;
  worldData: TotalWorld = {} as TotalWorld;

  cardHeading = {
    active: { title: "Active Cases", color: "#43ABC9" },
    cases: { title: "Total Cases", color: "#829356" },
    deaths: { title: "Total Death", color: "#4285f4" },
    recovered: { title: "Total Recovered", color: "#db4437" },
    tests: { title: "Total Test", color: "#f4b400" },
    todayCases: { title: "Total Cases Today", color: "#0f9d58" },
    todayRecovered: { title: "Total Recovered Today", color: "#790eb8" },
    todayDeaths: { title: "Total Death Today", color: "#e4a215" },
  }

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getMethod(environment.total).subscribe((res) => {
      this.worldData['active'] = res['active']
      this.worldData['cases'] = res['cases']
      this.worldData['deaths'] = res['deaths']
      this.worldData['recovered'] = res['recovered']
      this.worldData['tests'] = res['tests']
      this.worldData['todayCases'] = res['todayCases']
      this.worldData['todayRecovered'] = res['todayRecovered']
      this.worldData['todayDeaths'] = res['todayDeaths']
    })
    this.rowData = this.httpService.getMethod(environment.countries)
  }

  dataFormatter(value: number) {
    if (value && value > 0) {
      let fixed: string = value.toFixed(0);
      let formatted = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return `${formatted}`;
    }
    return "-"
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const sortModel = [
      { colId: 'active', sort: 'desc' }
    ];
    this.gridApi.setSortModel(sortModel);
  }
}



